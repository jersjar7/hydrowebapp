// src/services/calculation/index.ts
/**
 * Calculation services for hydraulic and hydrologic computations
 */

// Export types and interfaces
export type {
    // Options
    CalculationOptions,
    
    // Geometry types
    ChannelGeometryType,
    BaseGeometry,
    ChannelGeometry,
    RectangularGeometry,
    TrapezoidalGeometry,
    CircularGeometry,
    IrregularGeometry,
    
    // Parameter types
    WaterSurfaceProfileParams,
    CulvertFlowParams,
    RainfallRunoffParams,
    
    // Result types
    WaterSurfaceProfileResult,
    CulvertFlowResult,
    RainfallRunoffResult
  } from './types';
  
  // Export classes and functions
  export { CalculationService, calculationService } from './calculationService';
  
  // Export other calculation components when they're implemented
  // export { ResultProcessor } from './resultProcessor';
  // export { CalculationSync } from './calculationSync';