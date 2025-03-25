/**
 * Options for storage operations
 */
export interface StorageOptions {
  /** Optional expiration time in milliseconds */
  expiration?: number;
  /** Whether to compress the data before storing */
  compress?: boolean;
  /** Optional metadata to store with the value */
  metadata?: Record<string, any>;
}

/**
 * Result of a get operation
 */
export interface StorageGetResult<T> {
  /** The retrieved value */
  value: T;
  /** When the value was stored */
  storedAt?: number;
  /** When the value will expire (if applicable) */
  expiresAt?: number;
  /** Any metadata stored with the value */
  metadata?: Record<string, any>;
}

/**
 * Interface for storage services
 */
export interface StorageService {
  /**
   * Retrieves a value by key
   * 
   * @param key The key to retrieve
   * @returns A promise resolving to the value or null if not found
   */
  get<T>(key: string): Promise<T | null>;
  
  /**
   * Stores a value with the given key
   * 
   * @param key The key to store under
   * @param value The value to store
   * @param options Optional storage options
   * @returns A promise that resolves when storage is complete
   */
  set<T>(key: string, value: T, options?: StorageOptions): Promise<void>;
  
  /**
   * Removes a value by key
   * 
   * @param key The key to remove
   * @returns A promise that resolves when removal is complete
   */
  remove(key: string): Promise<void>;
  
  /**
   * Clears all stored values
   * 
   * @returns A promise that resolves when clearing is complete
   */
  clear(): Promise<void>;
  
  /**
   * Retrieves all stored values, optionally filtered by key prefix
   * 
   * @param prefix Optional key prefix to filter by
   * @returns A promise resolving to a record of keys and values
   */
  getAll<T>(prefix?: string): Promise<Record<string, T>>;
}