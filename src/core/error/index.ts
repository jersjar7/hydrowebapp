// src/core/error/index.ts
/**
 * Core error handling functionality
 */

// Export types and interfaces
export type {
    ErrorSeverity,
    ErrorOptions
  } from './errorHandler';
  
  export type {
    ErrorReportData
  } from './errorReporter';
  
  // Export classes and functions
  export { ErrorHandler } from './errorHandler';
  export { ErrorReporter, errorReporter } from './errorReporter';
  
  // Export other error handling components when they're implemented
  // export { errorRegistry } from './errorRegistry';
  // export { ErrorClassification } from './errorClassification';
  // export { ErrorRecoveryStrategy } from './errorRecovery';
  // export { createErrorBoundary } from './errorBoundaries';