// src/core/computation/resourceMonitor.ts

/**
 * Service for monitoring browser resources and adapting
 * computation strategies based on available resources.
 * 
 * @todo Implement full resource monitoring functionality
 */
export class ResourceMonitorService {
    private cpuUtilization: number = 0;
    private memoryUtilization: number = 0;
    private gpuAvailable: boolean = false;
    private lastUpdate: number = 0;
    private updateInterval: number = 5000; // 5 seconds
    
    constructor() {
      // Initialize monitoring
      this.updateResourceMetrics();
    }
    
    /**
     * Updates resource metrics
     */
    private async updateResourceMetrics(): Promise<void> {
      // In a real implementation, this would use various browser APIs
      // to measure resource utilization
      
      // Simplified implementation for now
      this.lastUpdate = Date.now();
      
      // Use performance.memory if available (Chrome only)
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        this.memoryUtilization = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      }
      
      // Check for WebGL support as a proxy for GPU availability
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.gpuAvailable = !!gl;
      } catch (e) {
        this.gpuAvailable = false;
      }
      
      // Schedule next update
      setTimeout(() => this.updateResourceMetrics(), this.updateInterval);
    }
    
    /**
     * Gets the current CPU utilization estimate
     */
    public getCpuUtilization(): number {
      return this.cpuUtilization;
    }
    
    /**
     * Gets the current memory utilization estimate
     */
    public getMemoryUtilization(): number {
      return this.memoryUtilization;
    }
    
    /**
     * Checks if GPU acceleration is available
     */
    public isGpuAvailable(): boolean {
      return this.gpuAvailable;
    }
    
    /**
     * Determines the optimal number of worker threads to use
     * based on current system resources
     */
    public getOptimalWorkerCount(): number {
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      
      // If system is under heavy load, use fewer workers
      if (this.cpuUtilization > 0.8 || this.memoryUtilization > 0.8) {
        return Math.max(1, Math.floor(hardwareConcurrency / 2));
      }
      
      return hardwareConcurrency;
    }
    
    /**
     * Determines if a calculation should be offloaded to the cloud
     * based on current resource utilization
     */
    public shouldOffloadToCloud(calculationComplexity: 'low' | 'medium' | 'high'): boolean {
      if (calculationComplexity === 'low') return false;
      
      if (calculationComplexity === 'high' && 
          (this.cpuUtilization > 0.7 || this.memoryUtilization > 0.7)) {
        return true;
      }
      
      return calculationComplexity === 'medium' && 
             this.cpuUtilization > 0.9 && 
             this.memoryUtilization > 0.9;
    }
  }
  
  // Export a default instance
  export const resourceMonitor = new ResourceMonitorService();