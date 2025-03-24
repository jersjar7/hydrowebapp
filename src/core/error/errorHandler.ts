// src/core/error/errorHandler.ts
import { logger } from '../logging/logger';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorOptions {
  severity?: ErrorSeverity;
  source?: string;
  data?: any;
  recoverable?: boolean;
  recoveryAction?: () => Promise<void>;
}

export class ErrorHandler {
  private static isHandlingError = false;
  
  /**
   * Handles an error with appropriate logging and recovery strategies
   */
  public static handleError(error: Error, options: ErrorOptions = {}): void {
    // Prevent recursive error handling
    if (this.isHandlingError) {
      console.error('Recursive error handling detected:', error);
      return;
    }
    
    this.isHandlingError = true;
    
    try {
      const {
        severity = 'medium',
        source = 'application',
        data,
        recoverable = false,
        recoveryAction
      } = options;
      
      // Log the error
      logger.error(
        `${error.name}: ${error.message}`,
        { 
          stack: error.stack,
          severity,
          source,
          data,
          recoverable
        },
        source
      );
      
      // Report to error monitoring service if critical
      if (severity === 'high' || severity === 'critical') {
        this.reportToMonitoring(error, options);
      }
      
      // Execute recovery action if provided
      if (recoverable && recoveryAction) {
        recoveryAction().catch(recoveryError => {
          logger.error(
            `Recovery action failed: ${recoveryError.message}`,
            { originalError: error },
            source
          );
        });
      }
    } finally {
      this.isHandlingError = false;
    }
  }
  
  /**
   * Reports an error to a monitoring service
   */
  private static reportToMonitoring(error: Error, options: ErrorOptions): void {
    // This would connect to an error monitoring service like Sentry
    // For now it's just a placeholder
    console.debug('Would report to error monitoring:', {
      error,
      options
    });
  }
  
  /**
   * Creates a boundary error handler for React components
   */
  public static createBoundaryHandler(componentName: string): (error: Error, info: { componentStack: string }) => void {
    return (error: Error, info: { componentStack: string }) => {
      this.handleError(error, {
        severity: 'high',
        source: `component:${componentName}`,
        data: { componentStack: info.componentStack }
      });
    };
  }
}