// src/services/storage/indexedDBService.ts
import { StorageService, StorageOptions } from './storageInterface';

/**
 * Storage entry with metadata
 */
interface StorageEntry<T> {
  value: T;
  storedAt: number;
  expiresAt?: number;
  metadata?: Record<string, any>;
}

/**
 * Implementation of StorageService using IndexedDB
 */
export class IndexedDBService implements StorageService {
  private dbName: string;
  private storeName: string;
  
  /**
   * Creates a new IndexedDBService
   * 
   * @param dbName The name of the IndexedDB database
   * @param storeName The name of the object store to use
   */
  constructor(dbName: string = 'hydrowebapp-storage', storeName: string = 'data-store') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.initDB();
  }
  
  /**
   * Initializes the IndexedDB database
   */
  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to initialize IndexedDB'));
    });
  }
  
  /**
   * Gets the database connection
   */
  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  }
  
  /**
   * Retrieves a value by key
   * 
   * @param key The key to retrieve
   * @returns A promise resolving to the value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      
      request.onsuccess = () => {
        const entry = request.result as StorageEntry<T> | undefined;
        
        // Check if exists and not expired
        if (entry && (!entry.expiresAt || entry.expiresAt > Date.now())) {
          resolve(entry.value);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => reject(new Error(`Failed to get item: ${key}`));
    });
  }
  
  /**
   * Stores a value with the given key
   * 
   * @param key The key to store under
   * @param value The value to store
   * @param options Optional storage options
   * @returns A promise that resolves when storage is complete
   */
  async set<T>(key: string, value: T, options: StorageOptions = {}): Promise<void> {
    const db = await this.getDB();
    const now = Date.now();
    
    // Create storage entry with metadata
    const entry: StorageEntry<T> = {
      value,
      storedAt: now,
      metadata: options.metadata
    };
    
    // Set expiration if provided
    if (options.expiration) {
      entry.expiresAt = now + options.expiration;
    }
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(entry, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to store item: ${key}`));
    });
  }
  
  /**
   * Removes a value by key
   * 
   * @param key The key to remove
   * @returns A promise that resolves when removal is complete
   */
  async remove(key: string): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to remove item: ${key}`));
    });
  }
  
  /**
   * Clears all stored values
   * 
   * @returns A promise that resolves when clearing is complete
   */
  async clear(): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to clear storage'));
    });
  }
  
  /**
   * Retrieves all stored values, optionally filtered by key prefix
   * 
   * @param prefix Optional key prefix to filter by
   * @returns A promise resolving to a record of keys and values
   */
  async getAll<T>(prefix?: string): Promise<Record<string, T>> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      const keyRequest = store.getAllKeys();
      
      let keys: IDBValidKey[] = [];
      let entries: Array<StorageEntry<T>> = [];
      
      keyRequest.onsuccess = () => {
        keys = keyRequest.result;
      };
      
      request.onsuccess = () => {
        entries = request.result;
        
        const result: Record<string, T> = {};
        const now = Date.now();
        
        for (let i = 0; i < keys.length; i++) {
          const key = String(keys[i]);
          const entry = entries[i];
          
          // Skip if not matching prefix or expired
          if ((!prefix || key.startsWith(prefix)) && 
              (!entry.expiresAt || entry.expiresAt > now)) {
            result[key] = entry.value;
          }
        }
        
        resolve(result);
      };
      
      request.onerror = () => reject(new Error('Failed to get all items'));
    });
  }
}