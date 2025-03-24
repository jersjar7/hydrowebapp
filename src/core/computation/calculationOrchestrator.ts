// src/core/computation/calculationOrchestrator.ts
import { TaskManager } from './taskManager';

export class CalculationOrchestrator {
  private taskManager: TaskManager;
  
  constructor() {
    this.taskManager = new TaskManager();
  }
  
  public async calculateWaterSurfaceProfile(parameters: {
    channelGeometry: any;
    flowRate: number;
    manningsN: number;
    upstreamElevation?: number;
    downstreamElevation?: number;
  }): Promise<any> {
    // Use the taskManager to handle the calculation
    return this.taskManager.executeHydraulicCalculation('WATER_SURFACE_PROFILE', parameters);
  }
  
  public async calculateCulvertFlow(parameters: {
    culvertGeometry: any;
    flowRate: number;
    inletConfiguration: string;
    outletConfiguration: string;
    headwaterElevation?: number;
    tailwaterElevation?: number;
  }): Promise<any> {
    return this.taskManager.executeHydraulicCalculation('CULVERT_ANALYSIS', parameters);
  }

  public async calculateBridgeHydraulics(parameters: {
    bridgeGeometry: any;
    channelGeometry: any;
    flowRate: number;
    manningsN: number;
    upstreamElevation?: number;
    downstreamElevation?: number;
  }): Promise<any> {
    return this.taskManager.executeHydraulicCalculation('BRIDGE_HYDRAULICS', parameters);
  }
  
  public async calculateStormwaterSystem(parameters: {
    networkTopology: any;
    rainfallData: any;
    catchmentProperties: any;
    designStorm?: any;
  }): Promise<any> {
    return this.taskManager.executeHydraulicCalculation('STORMWATER_SYSTEM', parameters);
  }
  
  public dispose() {
    this.taskManager.terminate();
  }
}