// src/core/computation/fallbackComputation.ts

/**
 * Service providing simplified calculation methods that can run
 * on the main thread as fallbacks when Web Workers are not available
 * or when calculations fail.
 * 
 * @todo Implement simplified fallback calculations
 */
export class FallbackComputationService {
    private isWorkerAvailable: boolean;
    
    constructor() {
      this.isWorkerAvailable = typeof Worker !== 'undefined';
    }
    
    /**
     * Determines if fallback computation should be used
     */
    public shouldUseFallback(): boolean {
      return !this.isWorkerAvailable;
    }
    
    /**
     * Fallback implementation of water surface profile calculation
     */
    public calculateWaterSurfaceProfile(parameters: {
      channelGeometry: any;
      flowRate: number;
      manningsN: number;
      upstreamElevation?: number;
      downstreamElevation?: number;
    }): any {
      console.warn('Using simplified fallback calculation for water surface profile');
      
      // Very basic implementation - would be expanded in the real version
      const { channelGeometry, flowRate, manningsN } = parameters;
      
      // This is just a placeholder for the actual fallback calculation
      // In a real implementation, this would be a simplified but functional algorithm
      
      return {
        points: [
          { station: 0, elevation: parameters.upstreamElevation || 100 },
          { station: 100, elevation: (parameters.upstreamElevation || 100) - 0.5 },
          { station: 200, elevation: (parameters.upstreamElevation || 100) - 1.0 },
          { station: 300, elevation: (parameters.upstreamElevation || 100) - 1.5 },
          { station: 400, elevation: (parameters.upstreamElevation || 100) - 2.0 },
          { station: 500, elevation: parameters.downstreamElevation || 98 }
        ],
        metadata: {
          isFallbackCalculation: true,
          accuracy: 'low',
          flowRegime: flowRate > 10 ? 'supercritical' : 'subcritical'
        }
      };
    }
    
    /**
     * Fallback implementation of culvert flow calculation
     */
    public calculateCulvertFlow(parameters: any): any {
      console.warn('Using simplified fallback calculation for culvert flow');
      
      // Simplified placeholder implementation
      return {
        headwater: parameters.headwaterElevation || 100,
        tailwater: parameters.tailwaterElevation || 98,
        flowCapacity: parameters.flowRate * 0.9,
        controlType: 'inlet',
        isFallbackCalculation: true
      };
    }
  }
  
  // Export a default instance
  export const fallbackComputation = new FallbackComputationService();