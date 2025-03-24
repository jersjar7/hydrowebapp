// src/services/storage/index.ts
export * from './storageInterface';
export * from './indexedDBService';

import { IndexedDBService } from './indexedDBService';

// Create and export a default instance
export const storageService = new IndexedDBService();