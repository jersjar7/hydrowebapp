// src/core/computation/computationScheduler.ts
import { ComputationTask, ComputationResult } from '../worker/workerTypes';
import { WorkerPool } from '../worker/WorkerPool';

export class ComputationScheduler {
  private tasks: Map<string, ComputationTask> = new Map();
  private completedTasks: Set<string> = new Set();
  private results: Map<string, ComputationResult> = new Map();
  private taskPromises: Map<string, Promise<any>> = new Map();
  private workerPool: WorkerPool;
  
  constructor(workerScript: string, poolSize?: number) {
    this.workerPool = new WorkerPool(workerScript, poolSize);
  }
  
  public scheduleTask<T>(
    type: string,
    payload: any,
    options: {
      priority?: 'high' | 'normal' | 'low';
      dependencies?: string[];
      id?: string;
    } = {}
  ): Promise<T> {
    const taskId = options.id || `${type}-${Date.now()}`;
    const task: ComputationTask = {
      id: taskId,
      type,
      payload,
      priority: options.priority || 'normal',
      dependencies: options.dependencies
    };
    
    this.tasks.set(taskId, task);
    
    const taskPromise = this.executeTaskWhenReady<T>(task);
    this.taskPromises.set(taskId, taskPromise);
    
    return taskPromise;
  }
  
  private async executeTaskWhenReady<T>(task: ComputationTask): Promise<T> {
    // Wait for dependencies if any
    if (task.dependencies && task.dependencies.length > 0) {
      const dependencyPromises = task.dependencies.map(depId => {
        const promise = this.taskPromises.get(depId);
        if (!promise) {
          throw new Error(`Dependency task ${depId} not found`);
        }
        return promise;
      });
      
      await Promise.all(dependencyPromises);
    }
    
    // Execute the task
    const result = await this.workerPool.executeTask<T>(
      task.type,
      task.payload,
      task.priority
    );
    
    // Store the result
    this.results.set(task.id, {
      taskId: task.id,
      data: result,
      timestamp: Date.now()
    });
    this.completedTasks.add(task.id);
    
    return result;
  }
  
  public getTaskResult<T>(taskId: string): T | undefined {
    const result = this.results.get(taskId);
    return result ? (result.data as T) : undefined;
  }
  
  public isTaskCompleted(taskId: string): boolean {
    return this.completedTasks.has(taskId);
  }
  
  public clear() {
    this.tasks.clear();
    this.completedTasks.clear();
    this.results.clear();
    this.taskPromises.clear();
  }
  
  public terminate() {
    this.workerPool.terminate();
    this.clear();
  }
}