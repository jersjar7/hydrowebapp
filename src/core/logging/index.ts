// src/core/logging/index.ts
/**
 * Core logging functionality
 */

// Export types and interfaces
export type {
    LogLevel,
    LogEntry,
    LoggerOptions
  } from './logger';
  
  // Export classes and functions
  export { Logger, logger } from './logger';
  
  // Export other logging components when they're implemented
  // export { telemetry } from './telemetry';
  // export { monitoring } from './monitoring';
  // export { logConfig } from './logConfig';