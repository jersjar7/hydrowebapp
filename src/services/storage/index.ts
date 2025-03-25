// src/services/storage/index.ts
/**
 * Storage services for persistent data management
 */

// Export types and interfaces
export type {
    StorageService,
    StorageOptions,
    StorageGetResult
  } from './storageInterface';
  
  // Export classes and implementations
  export { IndexedDBService } from './indexedDBService';
  
  // Create and export default instance
  import { IndexedDBService } from './indexedDBService';
  export const storageService = new IndexedDBService();