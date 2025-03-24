// src/core/error/errorReporter.ts
export interface ErrorReportData {
    message: string;
    stack?: string;
    componentStack?: string;
    metadata?: Record<string, any>;
    userInfo?: {
      userAgent?: string;
      screen?: string;
      timestamp?: string;
    };
  }
  
  export class ErrorReporter {
    private endpoint: string | null = null;
    private enabled: boolean = false;
    private batchedErrors: ErrorReportData[] = [];
    private batchSize: number = 10;
    private batchInterval: number = 30000; // 30 seconds
    private batchTimeoutId: number | null = null;
    
    constructor(endpoint?: string, enabled: boolean = false) {
      if (endpoint) {
        this.endpoint = endpoint;
      }
      this.enabled = enabled;
      
      if (this.enabled) {
        this.startBatchTimer();
      }
    }
    
    /**
     * Configures the error reporter
     */
    public configure(options: { endpoint?: string; enabled?: boolean; batchSize?: number; batchInterval?: number }): void {
      if (options.endpoint !== undefined) {
        this.endpoint = options.endpoint;
      }
      
      if (options.enabled !== undefined) {
        this.enabled = options.enabled;
        
        if (this.enabled && !this.batchTimeoutId) {
          this.startBatchTimer();
        } else if (!this.enabled && this.batchTimeoutId) {
          this.stopBatchTimer();
        }
      }
      
      if (options.batchSize !== undefined) {
        this.batchSize = options.batchSize;
      }
      
      if (options.batchInterval !== undefined) {
        this.batchInterval = options.batchInterval;
        
        if (this.enabled) {
          this.restartBatchTimer();
        }
      }
    }
    
    /**
     * Reports an error to the configured endpoint
     */
    public reportError(error: Error, metadata?: Record<string, any>): void {
      if (!this.enabled || !this.endpoint) {
        return;
      }
      
      const errorData: ErrorReportData = {
        message: error.message,
        stack: error.stack,
        metadata,
        userInfo: {
          userAgent: navigator.userAgent,
          screen: `${window.innerWidth}x${window.innerHeight}`,
          timestamp: new Date().toISOString()
        }
      };
      
      this.batchedErrors.push(errorData);
      
      if (this.batchedErrors.length >= this.batchSize) {
        this.flushBatch();
      }
    }
    
    /**
     * Sends batched errors to the server
     */
    private async flushBatch(): Promise<void> {
      if (this.batchedErrors.length === 0 || !this.endpoint) {
        return;
      }
      
      const errors = [...this.batchedErrors];
      this.batchedErrors = [];
      
      try {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ errors }),
          keepalive: true // Ensure the request completes even if the page unloads
        });
      } catch (error) {
        console.error('Failed to send error reports:', error);
        
        // Add back to queue if sending failed
        this.batchedErrors = [...errors, ...this.batchedErrors];
        
        // Limit queue size if it grows too large
        if (this.batchedErrors.length > this.batchSize * 3) {
          this.batchedErrors = this.batchedErrors.slice(-this.batchSize * 3);
        }
      }
    }
    
    private startBatchTimer(): void {
      this.batchTimeoutId = window.setInterval(() => {
        this.flushBatch();
      }, this.batchInterval);
    }
    
    private stopBatchTimer(): void {
      if (this.batchTimeoutId !== null) {
        clearInterval(this.batchTimeoutId);
        this.batchTimeoutId = null;
      }
    }
    
    private restartBatchTimer(): void {
      this.stopBatchTimer();
      this.startBatchTimer();
    }
    
    /**
     * Flushes any pending errors and disposes resources
     */
    public dispose(): void {
      this.flushBatch();
      this.stopBatchTimer();
    }
  }
  
  // Create default instance with error reporting disabled
  export const errorReporter = new ErrorReporter(undefined, false);