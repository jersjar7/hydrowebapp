// src/core/worker/WorkerPool.ts
import { v4 as uuidv4 } from 'uuid';
import { WorkerMessage, TaskPromise } from './workerTypes';

export class WorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private taskQueue: Map<string, TaskPromise> = new Map();
  
  constructor(
    private workerScript: string,
    private poolSize: number = navigator.hardwareConcurrency || 4
  ) {
    this.initialize();
  }
  
  private initialize() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(new URL(`../../webWorkers/${this.workerScript}.ts`, import.meta.url), { type: 'module' });
      
      worker.onmessage = this.handleWorkerMessage.bind(this, worker);
      worker.onerror = this.handleWorkerError.bind(this, worker);
      
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }
  
  private handleWorkerMessage(worker: Worker, event: MessageEvent<WorkerMessage>) {
    const { taskId, type, payload } = event.data;
    
    if (type === 'RESULT' || type === 'ERROR') {
      const task = this.taskQueue.get(taskId);
      if (!task) return;
      
      this.taskQueue.delete(taskId);
      this.availableWorkers.push(worker);
      
      if (type === 'RESULT') {
        task.resolve(payload);
      } else {
        task.reject(new Error(payload));
      }
      
      this.processNextTask();
    }
  }
  
  private handleWorkerError(worker: Worker, error: ErrorEvent) {
    console.error('Worker error:', error);
    // Replace the failed worker
    const index = this.workers.indexOf(worker);
    if (index !== -1) {
      this.workers.splice(index, 1);
      const newWorker = new Worker(new URL(`../../webWorkers/${this.workerScript}.ts`, import.meta.url), { type: 'module' });
      newWorker.onmessage = this.handleWorkerMessage.bind(this, newWorker);
      newWorker.onerror = this.handleWorkerError.bind(this, newWorker);
      this.workers.push(newWorker);
      this.availableWorkers.push(newWorker);
    }
  }
  
  public executeTask<T>(taskType: string, payload: any, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<T> {
    return new Promise((resolve, reject) => {
      const taskId = uuidv4();
      
      this.taskQueue.set(taskId, { resolve, reject, priority });
      
      if (this.availableWorkers.length > 0) {
        this.processNextTask();
      }
    });
  }
  
  private processNextTask() {
    if (this.availableWorkers.length === 0 || this.taskQueue.size === 0) return;
    
    // Get next worker
    const worker = this.availableWorkers.pop()!;
    
    // Find highest priority task
    let nextTaskId: string | null = null;
    let highestPriority = 'low';
    
    for (const [taskId, { priority }] of this.taskQueue.entries()) {
      if (
        (priority === 'high' && highestPriority !== 'high') ||
        (priority === 'normal' && highestPriority === 'low')
      ) {
        highestPriority = priority;
        nextTaskId = taskId;
      }
      
      // Exit early if we found a high-priority task
      if (highestPriority === 'high') break;
    }
    
    if (!nextTaskId) {
      // Get the first task if no priorities matter
      nextTaskId = Array.from(this.taskQueue.keys())[0];
    }
    
    // Send the task to the worker
    worker.postMessage({
      taskId: nextTaskId,
      type: 'TASK',
      payload: this.taskQueue.get(nextTaskId)
    });
  }
  
  public terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue.clear();
  }
}