// src/core/computation/taskManager.ts
import { ComputationScheduler } from './computationScheduler';
import { ResultCache } from './resultCache';

export class TaskManager {
  private scheduler: ComputationScheduler;
  private cache: ResultCache;
  
  constructor() {
    this.scheduler = new ComputationScheduler('calculationWorker');
    this.cache = new ResultCache();
  }
  
  public async executeHydraulicCalculation(calculationType: string, parameters: any): Promise<any> {
    // Generate cache key for this calculation
    const cacheKey = this.generateCacheKey(calculationType, parameters);
    
    // Check cache first
    const cachedResult = await this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    let result;
    
    switch (calculationType) {
      case 'WATER_SURFACE_PROFILE':
        result = await this.calculateWaterSurfaceProfile(parameters);
        break;
      case 'CULVERT_ANALYSIS':
        result = await this.calculateCulvertFlow(parameters);
        break;
      // Add other calculation types as needed
      default:
        throw new Error(`Unknown calculation type: ${calculationType}`);
    }
    
    // Cache the result
    await this.cache.set(cacheKey, result);
    
    return result;
  }
  
  private async calculateWaterSurfaceProfile(parameters: {
    channelGeometry: any;
    flowRate: number;
    manningsN: number;
    upstreamElevation?: number;
    downstreamElevation?: number;
  }): Promise<any> {
    // Split calculation into subtasks
    const geometryTaskId = 'geometry-' + Date.now();
    await this.scheduler.scheduleTask(
      'PROCESS_GEOMETRY',
      parameters.channelGeometry,
      { id: geometryTaskId, priority: 'high' }
    );
    
    const flowTaskId = 'flow-' + Date.now();
    await this.scheduler.scheduleTask(
      'CALCULATE_FLOW_PARAMETERS',
      {
        flowRate: parameters.flowRate,
        manningsN: parameters.manningsN
      },
      { id: flowTaskId, priority: 'high' }
    );
    
    // Final calculation using results from subtasks
    return this.scheduler.scheduleTask(
      'CALCULATE_WATER_SURFACE_PROFILE',
      {
        geometryTaskId,
        flowTaskId,
        upstreamElevation: parameters.upstreamElevation,
        downstreamElevation: parameters.downstreamElevation
      },
      {
        dependencies: [geometryTaskId, flowTaskId],
        priority: 'normal'
      }
    );
  }
  
  private async calculateCulvertFlow(parameters: any): Promise<any> {
    // Implementation for culvert flow calculations
    return this.scheduler.scheduleTask(
      'CALCULATE_CULVERT_FLOW',
      parameters,
      { priority: 'normal' }
    );
  }
  
  private generateCacheKey(calculationType: string, parameters: any): string {
    // Sort parameters to ensure consistent key generation
    const sortedParams = this.sortObjectDeep(parameters);
    
    // Create a deterministic string representation
    const paramsString = JSON.stringify(sortedParams);
    
    // Generate hash
    return `${calculationType}:${this.hashString(paramsString)}`;
  }
  
  private sortObjectDeep(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectDeep(item));
    }
    
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = this.sortObjectDeep(obj[key]);
        return result;
      }, {} as any);
  }
  
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
  
  public terminate() {
    this.scheduler.terminate();
  }
}