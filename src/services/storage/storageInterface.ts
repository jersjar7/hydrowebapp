// src/services/storage/storageInterface.ts
export interface StorageService {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
    getAll<T>(prefix?: string): Promise<Record<string, T>>;
  }