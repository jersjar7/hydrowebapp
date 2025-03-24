// src/services/calculation/calculationOrchestrator.ts
import { TaskManager } from '../../core/computation/taskManager';

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
  
  public async calculateCulvertFlow(parameters: any): Promise<any> {
    return this.taskManager.executeHydraulicCalculation('CULVERT_ANALYSIS', parameters);
  }
  
  // Add other domain-specific calculation methods
  
  public dispose() {
    this.taskManager.terminate();
  }
}