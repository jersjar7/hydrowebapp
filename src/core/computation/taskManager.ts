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
    const cacheKey = await this.generateCacheKey(calculationType, parameters);
    
    // Check cache first
    const cachedResult = await this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    try {
      let result;
      
      switch (calculationType) {
        case 'WATER_SURFACE_PROFILE':
          result = await this.calculateWaterSurfaceProfile(parameters);
          break;
        case 'CULVERT_ANALYSIS':
          result = await this.calculateCulvertFlow(parameters);
          break;
        case 'BRIDGE_HYDRAULICS':
          result = await this.calculateBridgeHydraulics(parameters);
          break;
        case 'STORMWATER_SYSTEM':
          result = await this.calculateStormwaterSystem(parameters);
          break;
        default:
          throw new Error(`Unknown calculation type: ${calculationType}`);
      }
      
      // Cache the result
      await this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error(`Error in ${calculationType} calculation:`, error);
      throw error;
    }
  }
  
  private async calculateWaterSurfaceProfile(parameters: {
    channelGeometry: any;
    flowRate: number;
    manningsN: number;
    upstreamElevation?: number;
    downstreamElevation?: number;
  }): Promise<any> {
    try {
      // Split calculation into subtasks
      const geometryTaskId = 'geometry-' + Date.now();
      const geometryResult = await this.scheduler.scheduleTask(
        'PROCESS_GEOMETRY',
        parameters.channelGeometry,
        { id: geometryTaskId, priority: 'high' }
      );
      
      const flowTaskId = 'flow-' + Date.now();
      const flowResult = await this.scheduler.scheduleTask(
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
          geometryData: geometryResult,
          flowData: flowResult,
          upstreamElevation: parameters.upstreamElevation,
          downstreamElevation: parameters.downstreamElevation
        },
        {
          priority: 'normal'
        }
      );
    } catch (error) {
      console.error('Water surface profile calculation failed:', error);
      throw new Error(`Water surface profile calculation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private async calculateCulvertFlow(parameters: any): Promise<any> {
    try {
      // Implementation for culvert flow calculations
      return this.scheduler.scheduleTask(
        'CALCULATE_CULVERT_FLOW',
        parameters,
        { priority: 'normal' }
      );
    } catch (error) {
      console.error('Culvert flow calculation failed:', error);
      throw new Error(`Culvert flow calculation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private async calculateBridgeHydraulics(parameters: any): Promise<any> {
    try {
      return this.scheduler.scheduleTask(
        'CALCULATE_BRIDGE_HYDRAULICS',
        parameters,
        { priority: 'normal' }
      );
    } catch (error) {
      console.error('Bridge hydraulics calculation failed:', error);
      throw new Error(`Bridge hydraulics calculation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private async calculateStormwaterSystem(parameters: any): Promise<any> {
    try {
      return this.scheduler.scheduleTask(
        'CALCULATE_STORMWATER_SYSTEM',
        parameters,
        { priority: 'normal' }
      );
    } catch (error) {
      console.error('Stormwater system calculation failed:', error);
      throw new Error(`Stormwater system calculation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private async generateCacheKey(calculationType: string, parameters: any): Promise<string> {
    // Sort parameters to ensure consistent key generation
    const sortedParams = this.sortObjectDeep(parameters);
    
    // Create a deterministic string representation
    const paramsString = JSON.stringify(sortedParams);
    
    // Use SHA-256 or another more robust hashing algorithm
    // If crypto is not available in the browser, use a different approach
    try {
      // Using browser's crypto API if available
      if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(`${calculationType}:${paramsString}`);
        
        try {
          // Use await to properly handle the Promise
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
          return this.fallbackHash(`${calculationType}:${paramsString}`);
        }
      }
      return this.fallbackHash(`${calculationType}:${paramsString}`);
    } catch (e) {
      return this.fallbackHash(`${calculationType}:${paramsString}`);
    }
  }
  
  private fallbackHash(str: string): string {
    // A more robust fallback hashing algorithm (FNV-1a)
    let hash = 0x811c9dc5; // FNV offset basis
    const prime = 0x01000193; // FNV prime
    
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, prime) | 0; // 32-bit FNV-1a hash
    }
    
    return (hash >>> 0).toString(16); // Convert to unsigned 32-bit integer
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
  
  public terminate() {
    this.scheduler.terminate();
    this.cache.dispose();
  }
}