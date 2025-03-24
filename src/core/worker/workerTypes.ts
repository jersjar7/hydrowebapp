// src/core/worker/workerTypes.ts
export interface WorkerMessage {
    taskId: string;
    type: 'TASK' | 'RESULT' | 'ERROR' | 'INIT' | 'TERMINATE';
    payload?: any;
    priority?: 'high' | 'normal' | 'low';
  }

  export interface ComputationTask {
    id: string;
    type: string;
    payload: any;
    priority: 'high' | 'normal' | 'low';
    dependencies?: string[]; // IDs of tasks this depends on
  }
  
  export interface ComputationResult {
    taskId: string;
    data: any;
    timestamp: number;
    metadata?: any;
  }
  
  export interface TaskPromise {
    resolve: (value: any) => void;
    reject: (error: any) => void;
    priority: 'high' | 'normal' | 'low';
  }