// src/webWorkers/shared/workerBootstrap.ts
import { WorkerMessage } from '../../core/worker/workerTypes';

// Worker initialization and message handling
export function initializeWorker(processors: Record<string, (data: any) => any>) {
  self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { taskId, type, payload } = event.data;
    
    if (type === 'TASK') {
      try {
        // Process task based on payload.type
        if (!payload.type || !processors[payload.type]) {
          throw new Error(`Unknown task type: ${payload.type}`);
        }
        
        const result = processors[payload.type](payload.data);
        self.postMessage({
          taskId,
          type: 'RESULT',
          payload: result
        });
      } catch (error) {
        self.postMessage({
          taskId,
          type: 'ERROR',
          payload: error instanceof Error ? error.message : String(error)
        });
      }
    }
  };
}