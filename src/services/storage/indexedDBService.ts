// src/services/storage/indexedDBService.ts
import { StorageService } from './storageInterface';

export class IndexedDBService implements StorageService {
  private dbName: string;
  private storeName: string;
  
  constructor(dbName: string = 'hydrowebapp-storage', storeName: string = 'data-store') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.initDB();
  }
  
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
  
  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  }
  
  async get<T>(key: string): Promise<T | null> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error(`Failed to get item: ${key}`));
    });
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to store item: ${key}`));
    });
  }
  
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
  
  async getAll<T>(prefix?: string): Promise<Record<string, T>> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      const keyRequest = store.getAllKeys();
      
      let keys: IDBValidKey[] = [];
      let values: any[] = [];
      
      keyRequest.onsuccess = () => {
        keys = keyRequest.result;
      };
      
      request.onsuccess = () => {
        values = request.result;
        
        const result: Record<string, T> = {};
        
        for (let i = 0; i < keys.length; i++) {
          const key = String(keys[i]);
          
          if (!prefix || key.startsWith(prefix)) {
            result[key] = values[i];
          }
        }
        
        resolve(result);
      };
      
      request.onerror = () => reject(new Error('Failed to get all items'));
    });
  }
}