// src/services/storage/__tests__/indexedDBService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IndexedDBService } from '../indexedDBService';

// Mock indexedDB
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn()
};

// Mock transaction, store, and request objects
const mockTransaction = { objectStore: vi.fn() };
const mockObjectStore = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
  getAll: vi.fn(),
  getAllKeys: vi.fn(),
  openCursor: vi.fn()
};
const mockRequest = {};
const mockKeyRequest = {};

// Replace global indexedDB with our mock
Object.defineProperty(global, 'indexedDB', {
  value: mockIndexedDB,
  writable: true
});

describe('IndexedDBService', () => {
  let indexedDBService: IndexedDBService;
  let openDBRequest: any;
  let onupgradeneededCallback: Function;
  let onsuccessCallback: Function;
  let onerrorCallback: Function;

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
    
    // Set up database open request
    openDBRequest = {
      result: {
        transaction: vi.fn().mockReturnValue(mockTransaction),
        objectStoreNames: {
          contains: vi.fn().mockReturnValue(false)
        },
        createObjectStore: vi.fn().mockReturnValue(mockObjectStore)
      },
      onupgradeneeded: null as any,
      onsuccess: null as any,
      onerror: null as any
    };
    
    // Mock indexedDB.open() to capture event callbacks
    mockIndexedDB.open.mockReturnValue(openDBRequest);
    
    // Mock objectStore operations
    mockTransaction.objectStore.mockReturnValue(mockObjectStore);
    mockObjectStore.get.mockReturnValue(mockRequest);
    mockObjectStore.put.mockReturnValue(mockRequest);
    mockObjectStore.delete.mockReturnValue(mockRequest);
    mockObjectStore.clear.mockReturnValue(mockRequest);
    mockObjectStore.getAll.mockReturnValue(mockRequest);
    mockObjectStore.getAllKeys.mockReturnValue(mockKeyRequest);
    mockObjectStore.openCursor.mockReturnValue(mockRequest);
    
    // Create the service instance
    indexedDBService = new IndexedDBService('test-db', 'test-store');
    
    // Capture callbacks for later triggering
    onupgradeneededCallback = openDBRequest.onupgradeneeded;
    onsuccessCallback = openDBRequest.onsuccess;
    onerrorCallback = openDBRequest.onerror;
  });

  // Helper function to simulate successful DB open
  const simulateDBOpen = () => {
    // Trigger onupgradeneeded if it exists
    if (typeof onupgradeneededCallback === 'function') {
      onupgradeneededCallback();
    }
    
    // Then trigger onsuccess
    if (typeof onsuccessCallback === 'function') {
      onsuccessCallback();
    }
  };

  describe('get', () => {
    it('should retrieve an item by key', async () => {
      const testData = { name: 'Test Item' };
      const promise = indexedDBService.get<typeof testData>('test-key');
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate successful get request
      Object.defineProperty(mockRequest, 'onsuccess', {
        set(callback) {
          Object.defineProperty(mockRequest, 'result', {
            value: testData
          });
          callback();
        }
      });
      
      const result = await promise;
      expect(result).toEqual(testData);
      expect(mockObjectStore.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null for non-existent key', async () => {
      const promise = indexedDBService.get('non-existent-key');
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate empty result
      Object.defineProperty(mockRequest, 'onsuccess', {
        set(callback) {
          Object.defineProperty(mockRequest, 'result', {
            value: undefined
          });
          callback();
        }
      });
      
      const result = await promise;
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const promise = indexedDBService.get('test-key');
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate error
      Object.defineProperty(mockRequest, 'onerror', {
        set(callback) {
          callback(new Error('Failed to get item'));
        }
      });
      
      await expect(promise).rejects.toThrow('Failed to get item');
    });
  });

  describe('set', () => {
    it('should store an item with the given key', async () => {
      const testData = { name: 'Test Item' };
      const promise = indexedDBService.set('test-key', testData);
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate successful put request
      Object.defineProperty(mockRequest, 'onsuccess', {
        set(callback) {
          callback();
        }
      });
      
      await promise;
      expect(mockObjectStore.put).toHaveBeenCalledWith(testData, 'test-key');
    });

    it('should handle errors', async () => {
      const testData = { name: 'Test Item' };
      const promise = indexedDBService.set('test-key', testData);
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate error
      Object.defineProperty(mockRequest, 'onerror', {
        set(callback) {
          callback(new Error('Failed to store item'));
        }
      });
      
      await expect(promise).rejects.toThrow('Failed to store item');
    });
  });

  describe('remove', () => {
    it('should delete an item by key', async () => {
      const promise = indexedDBService.remove('test-key');
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate successful delete request
      Object.defineProperty(mockRequest, 'onsuccess', {
        set(callback) {
          callback();
        }
      });
      
      await promise;
      expect(mockObjectStore.delete).toHaveBeenCalledWith('test-key');
    });

    it('should handle errors', async () => {
      const promise = indexedDBService.remove('test-key');
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate error
      Object.defineProperty(mockRequest, 'onerror', {
        set(callback) {
          callback(new Error('Failed to remove item'));
        }
      });
      
      await expect(promise).rejects.toThrow('Failed to remove item');
    });
  });

  describe('clear', () => {
    it('should clear all stored items', async () => {
      const promise = indexedDBService.clear();
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate successful clear request
      Object.defineProperty(mockRequest, 'onsuccess', {
        set(callback) {
          callback();
        }
      });
      
      await promise;
      expect(mockObjectStore.clear).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const promise = indexedDBService.clear();
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate error
      Object.defineProperty(mockRequest, 'onerror', {
        set(callback) {
          callback(new Error('Failed to clear storage'));
        }
      });
      
      await expect(promise).rejects.toThrow('Failed to clear storage');
    });
  });

  describe('getAll', () => {
    it('should retrieve all items', async () => {
      const testData = [
        { name: 'Item 1' },
        { name: 'Item 2' }
      ];
      const testKeys = ['key1', 'key2'];
      
      const promise = indexedDBService.getAll();
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate successful getAllKeys request
      Object.defineProperty(mockKeyRequest, 'onsuccess', {
        set(callback) {
          Object.defineProperty(mockKeyRequest, 'result', {
            value: testKeys
          });
          callback();
        }
      });
      
      // Simulate successful getAll request
      Object.defineProperty(mockRequest, 'onsuccess', {
        set(callback) {
          Object.defineProperty(mockRequest, 'result', {
            value: testData
          });
          callback();
        }
      });
      
      const result = await promise;
      expect(result).toEqual({
        key1: { name: 'Item 1' },
        key2: { name: 'Item 2' }
      });
    });

    it('should filter by prefix when provided', async () => {
      const testData = [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 3' }
      ];
      const testKeys = ['prefix_key1', 'prefix_key2', 'other_key'];
      
      const promise = indexedDBService.getAll('prefix_');
      
      // Simulate successful DB open
      simulateDBOpen();
      
      // Simulate successful getAllKeys request
      Object.defineProperty(mockKeyRequest, 'onsuccess', {
        set(callback) {
          Object.defineProperty(mockKeyRequest, 'result', {
            value: testKeys
          });
          callback();
        }
      });
      
      // Simulate successful getAll request
      Object.defineProperty(mockRequest, 'onsuccess', {
        set(callback) {
          Object.defineProperty(mockRequest, 'result', {
            value: testData
          });
          callback();
        }
      });
      
      const result = await promise;
      expect(Object.keys(result)).toEqual(['prefix_key1', 'prefix_key2']);
      expect(result).not.toHaveProperty('other_key');
    });
  });
});