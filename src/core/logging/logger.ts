// src/core/logging/logger.ts
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  source?: string;
}

export interface LoggerOptions {
  minLevel?: LogLevel;
  enableConsole?: boolean;
  enableRemote?: boolean;
  remoteEndpoint?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

export class Logger {
  private options: LoggerOptions;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  
  constructor(options: LoggerOptions = {}) {
    this.options = {
      minLevel: 'info',
      enableConsole: true,
      enableRemote: false,
      ...options
    };
  }
  
  public debug(message: string, data?: any, source?: string): void {
    this.log('debug', message, data, source);
  }
  
  public info(message: string, data?: any, source?: string): void {
    this.log('info', message, data, source);
  }
  
  public warn(message: string, data?: any, source?: string): void {
    this.log('warn', message, data, source);
  }
  
  public error(message: string, data?: any, source?: string): void {
    this.log('error', message, data, source);
  }
  
  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    // Check minimum log level
    if (LOG_LEVELS[level] < LOG_LEVELS[this.options.minLevel!]) {
      return;
    }
    
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      source
    };
    
    // Store log
    this.logs.push(logEntry);
    
    // Trim logs if exceeding max capacity
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Console output
    if (this.options.enableConsole) {
      this.outputToConsole(logEntry);
    }
    
    // Remote logging
    if (this.options.enableRemote && this.options.remoteEndpoint) {
      this.sendToRemote(logEntry);
    }
  }
  
  private outputToConsole(logEntry: LogEntry): void {
    const { level, message, timestamp, data } = logEntry;
    const formattedTimestamp = timestamp.split('T')[1].split('.')[0];
    
    const consoleMessage = `[${formattedTimestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'debug':
        console.debug(consoleMessage, data || '');
        break;
      case 'info':
        console.info(consoleMessage, data || '');
        break;
      case 'warn':
        console.warn(consoleMessage, data || '');
        break;
      case 'error':
        console.error(consoleMessage, data || '');
        break;
    }
  }
  
  private sendToRemote(logEntry: LogEntry): void {
    // Placeholder for remote logging
    // Would be implemented to send logs to a remote endpoint
    if (this.options.remoteEndpoint) {
      // In a real implementation, this would make an API call
      // For now, it's a placeholder
      console.debug(`Would send log to ${this.options.remoteEndpoint}`, logEntry);
    }
  }
  
  public getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }
  
  public clearLogs(): void {
    this.logs = [];
  }
}

// Create default instance
export const logger = new Logger();