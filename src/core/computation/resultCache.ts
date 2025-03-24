// src/core/computation/resultCache.ts
interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  expiresAt: number;
}

export class ResultCache {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private dbName: string = 'hydro-computation-cache';
  private cleanupInterval: number | null = null;
  
  constructor(cleanupFrequency: number = 30 * 60 * 1000) {
    this.initDB();
    this.startPeriodicCleanup(cleanupFrequency);
  }
  
  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('calculations')) {
          db.createObjectStore('calculations', { keyPath: 'key' });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to initialize cache DB'));
    });
  }
  
  private startPeriodicCleanup(frequency: number) {
    this.cleanupInterval = window.setInterval(() => {
      this.clearExpired();
    }, frequency);
  }
  
  public async get(key: string): Promise<any | null> {
    // Check memory cache first
    const memoryResult = this.memoryCache.get(key);
    if (memoryResult && memoryResult.expiresAt > Date.now()) {
      return memoryResult.data;
    }
    
    // Check IndexedDB
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calculations'], 'readonly');
        const store = transaction.objectStore('calculations');
        const request = store.get(key);
        
        request.onsuccess = () => {
          const entry = request.result as CacheEntry;
          if (entry && entry.expiresAt > Date.now()) {
            // Add to memory cache
            this.memoryCache.set(key, entry);
            resolve(entry.data);
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => reject(new Error('Failed to retrieve from cache'));
      });
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }
  
  public async set(key: string, data: any, options: {
    memoryTTL?: number;
    persistentTTL?: number;
  } = {}): Promise<void> {
    const now = Date.now();
    const persistentTTL = options.persistentTTL || 24 * 60 * 60 * 1000; // 24h default
    
    // Create entry for persistent storage
    const entry: CacheEntry = {
      key,
      data,
      timestamp: now,
      expiresAt: now + persistentTTL
    };
    
    // Update memory cache (could use a different TTL if specified)
    this.memoryCache.set(key, {
      ...entry,
      expiresAt: now + (options.memoryTTL || 5 * 60 * 1000) // Use memory-specific TTL
    });
    
    // Update IndexedDB
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calculations'], 'readwrite');
        const store = transaction.objectStore('calculations');
        const request = store.put(entry);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
          console.error('Cache storage error:', event);
          reject(new Error('Failed to store in cache'));
        };
      });
    } catch (error) {
      console.error('Cache storage error:', error);
      throw new Error(`Failed to store in cache: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to open cache DB'));
    });
  }
  
  public async clearExpired(): Promise<void> {
    const now = Date.now();
    
    // Clear memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt <= now) {
        this.memoryCache.delete(key);
      }
    }
    
    // Clear IndexedDB
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calculations'], 'readwrite');
        const store = transaction.objectStore('calculations');
        
        const request = store.openCursor();
        
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            if (cursor.value.expiresAt <= now) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        
        request.onerror = () => reject(new Error('Failed to clear expired cache entries'));
      });
    } catch (error) {
      console.error('Cache cleanup error:', error);
      throw error;
    }
  }
  
  public async clearAll(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear();
    
    // Clear IndexedDB
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calculations'], 'readwrite');
        const store = transaction.objectStore('calculations');
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to clear cache'));
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }
  
  public dispose() {
    if (this.cleanupInterval !== null) {
      window.clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}