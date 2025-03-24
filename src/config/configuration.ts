// Environment-specific configuration
interface EnvironmentConfig {
    apiUrl: string;
    workerPoolSize: number;
    cacheTimeToLive: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  }
  
  // Feature flags configuration
  interface FeatureFlags {
    enabledModules: string[];
    experimentalFeatures: Record<string, boolean>;
  }
  
  // Application configuration
  class Configuration {
    private env: EnvironmentConfig;
    private features: FeatureFlags;
    
    constructor() {
      // Load environment-specific configuration
      this.env = this.loadEnvironmentConfig();
      
      // Load feature flags
      this.features = this.loadFeatureFlags();
    }
    
    private loadEnvironmentConfig(): EnvironmentConfig {
      // In a real app, this would load from environment variables
      const nodeEnv = process.env.NODE_ENV || 'development';
      
      // Default configuration
      const defaultConfig: EnvironmentConfig = {
        apiUrl: 'http://localhost:3000/api',
        workerPoolSize: 4,
        cacheTimeToLive: 3600,
        logLevel: 'info'
      };
      
      // Environment-specific overrides
      switch (nodeEnv) {
        case 'production':
          return {
            ...defaultConfig,
            apiUrl: 'https://api.hydrowebapp.com',
            logLevel: 'error'
          };
        case 'staging':
          return {
            ...defaultConfig,
            apiUrl: 'https://staging-api.hydrowebapp.com',
            logLevel: 'warn'
          };
        default:
          return defaultConfig;
      }
    }
    
    private loadFeatureFlags(): FeatureFlags {
      // This would normally load from a separate config file or API
      return {
        enabledModules: [
          'hydraulics.openChannel',
          'hydraulics.culverts'
        ],
        experimentalFeatures: {
          '3dVisualization': true,
          'cloudCalculations': false
        }
      };
    }
    
    // Getter methods
    getApiUrl(): string {
      return this.env.apiUrl;
    }
    
    getWorkerPoolSize(): number {
      return this.env.workerPoolSize;
    }
    
    isFeatureEnabled(featureName: string): boolean {
      return this.features.experimentalFeatures[featureName] || false;
    }
    
    getEnabledModules(): string[] {
      return this.features.enabledModules;
    }
    
    getLogLevel(): string {
      return this.env.logLevel;
    }
  }
  
  // Create a singleton instance
  export const config = new Configuration();