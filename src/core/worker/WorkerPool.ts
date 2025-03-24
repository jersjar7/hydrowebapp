// src/core/worker/WorkerPool.ts - Move or consolidate with the class above
// Since we now have a proper implementation in src/core/computation/workerPool.ts,
// we should either:
// 1. Remove this file completely and update imports to use the new class, or
// 2. Add a deprecation notice and re-export the new class

// Option 1: Export the class from computation/workerPool.ts
export { WorkerPool } from '../computation/workerPool';

// Alternatively, add a deprecation notice:
/*
 * @deprecated Use ComputationWorkerPool from '../computation/workerPool' instead.
 * This file will be removed in a future version.
 */