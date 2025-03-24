// src/core/computation/workerPool.ts
import { v4 as uuidv4 } from 'uuid';
import { WorkerMessage } from '..//';

interface TaskPromise {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  priority: 'high' | 'normal' | 'low';
}

export const workerPool = {
  workers: [] as Worker[],
  availableWorkers: [] as Worker[],
  taskQueue: new Map<string, TaskPromise>(),
  
  initialize(workerScript: string, poolSize: number = navigator.hardwareConcurrency || 4) {
    // Clean up any existing workers
    this.terminate();
    
    // Create new workers
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(new URL(`../../webWorkers/${workerScript}.ts`, import.meta.url), { type: 'module' });
      
      worker.onmessage = (event) => this.handleWorkerMessage(worker, event);
      worker.onerror = (error) => this.handleWorkerError(worker, error);
      
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  },
  
  handleWorkerMessage(worker: Worker, event: MessageEvent<WorkerMessage>) {
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
  },
  
  handleWorkerError(worker: Worker, error: ErrorEvent) {
    console.error('Worker error:', error);
    // Replace the failed worker
    const index = this.workers.indexOf(worker);
    if (index !== -1) {
      this.workers.splice(index, 1);
      const workerScript = worker.constructor.toString().match(/new Worker\(.*?([^\/]+\.ts)/)?.[1] || 'calculationWorker.ts';
      const newWorker = new Worker(new URL(`../../webWorkers/${workerScript}`, import.meta.url), { type: 'module' });
      newWorker.onmessage = (event) => this.handleWorkerMessage(newWorker, event);
      newWorker.onerror = (error) => this.handleWorkerError(newWorker, error);
      this.workers.push(newWorker);
      this.availableWorkers.push(newWorker);
    }
  },
  
  executeTask<T>(taskType: string, payload: any, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<T> {
    return new Promise((resolve, reject) => {
      const taskId = uuidv4();
      
      this.taskQueue.set(taskId, { resolve, reject, priority });
      
      if (this.availableWorkers.length > 0) {
        this.processNextTask();
      }
    });
  },
  
  processNextTask() {
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
  },
  
  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue.clear();
  }
};