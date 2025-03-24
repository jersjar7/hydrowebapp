// src/core/computation/workerPool.ts
import { v4 as uuidv4 } from 'uuid';
import { WorkerMessage } from '../worker/workerTypes';

export class ComputationWorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private taskQueue: Map<string, { 
    resolve: (value: any) => void;
    reject: (error: any) => void;
    priority: 'high' | 'normal' | 'low';
    taskType: string;  // Store the task type with the task
    payload: any;      // Store the payload with the task
  }> = new Map();
  
  constructor(
    private workerScript: string,
    private poolSize: number = navigator.hardwareConcurrency || 4
  ) {
    this.initialize();
  }
  
  private initialize() {
    // Create new workers
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(new URL(`../../webWorkers/${this.workerScript}.ts`, import.meta.url), { type: 'module' });
      
      worker.onmessage = (event) => this.handleWorkerMessage(worker, event);
      worker.onerror = (error) => this.handleWorkerError(worker, error);
      
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
      newWorker.onmessage = (event) => this.handleWorkerMessage(newWorker, event);
      newWorker.onerror = (error) => this.handleWorkerError(newWorker, error);
      this.workers.push(newWorker);
      this.availableWorkers.push(newWorker);
    }
  }
  
  public executeTask<T>(taskType: string, payload: any, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<T> {
    return new Promise((resolve, reject) => {
      const taskId = uuidv4();
      
      // Store task type and payload along with callbacks
      this.taskQueue.set(taskId, { 
        resolve, 
        reject, 
        priority,
        taskType, 
        payload 
      });
      
      if (this.availableWorkers.length > 0) {
        this.processNextTask();
      }
    });
  }
  
  private processNextTask() {
    if (this.availableWorkers.length === 0 || this.taskQueue.size === 0) return;
    
    // Find highest priority task in a more straightforward way
    let highPriorityTasks: string[] = [];
    let normalPriorityTasks: string[] = [];
    let lowPriorityTasks: string[] = [];
    
    for (const [taskId, task] of this.taskQueue.entries()) {
      if (task.priority === 'high') {
        highPriorityTasks.push(taskId);
      } else if (task.priority === 'normal') {
        normalPriorityTasks.push(taskId);
      } else {
        lowPriorityTasks.push(taskId);
      }
    }
    
    // Get next task based on priority
    let nextTaskId: string;
    if (highPriorityTasks.length > 0) {
      nextTaskId = highPriorityTasks[0];
    } else if (normalPriorityTasks.length > 0) {
      nextTaskId = normalPriorityTasks[0];
    } else {
      nextTaskId = lowPriorityTasks[0];
    }
    
    // Get next worker and task
    const worker = this.availableWorkers.pop()!;
    const task = this.taskQueue.get(nextTaskId)!;
    
    // Send the task to the worker - now using the stored taskType and payload
    worker.postMessage({
      taskId: nextTaskId,
      type: 'TASK',
      payload: {
        type: task.taskType,
        data: task.payload
      }
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

// To fix the singleton pattern issue, export the class instead of an instance
export { ComputationWorkerPool as WorkerPool };