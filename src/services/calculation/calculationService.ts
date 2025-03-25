// src/services/calculation/calculationService.ts
import { CalculationOrchestrator } from './calculationOrchestrator';
import {
    CalculationOptions,
    WaterSurfaceProfileParams,
    CulvertFlowParams,
    RainfallRunoffParams,
    WaterSurfaceProfileResult,
    CulvertFlowResult,
    RainfallRunoffResult
  } from './types';
  
  export class CalculationService {
    private orchestrator: CalculationOrchestrator;
    
    constructor() {
      this.orchestrator = new CalculationOrchestrator();
    }
    
    /**
     * Calculates a water surface profile for open channel flow
     * 
     * @param params The calculation parameters
     * @param options Optional calculation options
     * @returns A promise resolving to the calculation results
     */
    async calculateWaterSurfaceProfile(
      params: WaterSurfaceProfileParams, 
      _options: CalculationOptions = {}
    ): Promise<WaterSurfaceProfileResult> {
      // Using underscore prefix to indicate intentionally unused parameter
      return this.orchestrator.calculateWaterSurfaceProfile(params);
    }
    
    /**
     * Calculates hydraulic characteristics of culvert flow
     * 
     * @param params The culvert parameters
     * @param options Optional calculation options
     * @returns A promise resolving to the calculation results
     */
    async calculateCulvertFlow(
      params: CulvertFlowParams, 
      _options: CalculationOptions = {}
    ): Promise<CulvertFlowResult> {
      // Using underscore prefix to indicate intentionally unused parameter
      return this.orchestrator.calculateCulvertFlow(params);
    }
    
    /**
     * Calculates rainfall-runoff characteristics for a catchment
     * 
     * @param params The rainfall and catchment parameters
     * @param options Optional calculation options
     * @returns A promise resolving to the calculation results
     * @throws Error when not implemented
     */
    async calculateRainfallRunoff(
      params: RainfallRunoffParams, 
      _options: CalculationOptions = {}
    ): Promise<RainfallRunoffResult> {
      // Using underscore prefix on both unused parameters
      // Will integrate with orchestrator when implemented
      
      console.log("Rainfall-runoff calculation requested with catchment area:", 
                  params.catchmentArea, "and duration:", params.duration);
                  
      throw new Error('Rainfall-runoff calculation not yet implemented');
    }
    
    /**
     * Disposes of resources used by the calculation service
     */
    dispose(): void {
      this.orchestrator.dispose();
    }
  }
  
  /**
   * Default instance of the calculation service
   */
  export const calculationService = new CalculationService();