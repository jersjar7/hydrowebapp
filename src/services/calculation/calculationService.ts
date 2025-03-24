// src/services/calculation/calculationService.ts
import { CalculationOrchestrator } from '../../core/computation/calculationOrchestrator';

export interface CalculationOptions {
  useCache?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

export class CalculationService {
  private orchestrator: CalculationOrchestrator;
  
  constructor() {
    this.orchestrator = new CalculationOrchestrator();
  }
  
  // Hydraulic calculations
  
  async calculateWaterSurfaceProfile(params: {
    channelGeometry: any;
    flowRate: number;
    manningsN: number;
    upstreamElevation?: number;
    downstreamElevation?: number;
  }, _options: CalculationOptions = {}): Promise<any> {
    // Using underscore prefix to indicate intentionally unused parameter
    return this.orchestrator.calculateWaterSurfaceProfile(params);
  }
  
  async calculateCulvertFlow(params: {
    culvertGeometry: any;
    flowRate: number;
    inletConfiguration: string;
    outletConfiguration: string;
    headwaterElevation?: number;
    tailwaterElevation?: number;
  }, _options: CalculationOptions = {}): Promise<any> {
    // Using underscore prefix to indicate intentionally unused parameter
    return this.orchestrator.calculateCulvertFlow(params);
  }
  
  // Hydrologic calculations
  
  async calculateRainfallRunoff(_params: {
    catchmentArea: number;
    rainfallIntensity: number;
    runoffCoefficient: number;
    duration: number;
  }, _options: CalculationOptions = {}): Promise<any> {
    // Using underscore prefix on both unused parameters
    // Will integrate with orchestrator when implemented
    
    console.log("Rainfall-runoff calculation requested with catchment area:", 
                _params.catchmentArea, "and duration:", _params.duration);
                
    throw new Error('Rainfall-runoff calculation not yet implemented');
  }
  
  // Cleanup
  
  dispose(): void {
    this.orchestrator.dispose();
  }
}

// Export a default instance
export const calculationService = new CalculationService();