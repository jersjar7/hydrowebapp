// src/services/index.ts
/**
 * Application services providing domain-specific functionality
 */

// Re-export all types and services from storage
export * from './storage';

// Re-export all types and services from calculation
export * from './calculation';

// Re-export projectService
export { projectService } from './projectService';

// Add other service exports as they are implemented:
// export * from './export';
// export * from './notifications';
// export * from './diagnostics';