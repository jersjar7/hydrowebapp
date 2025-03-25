/**
 * Types and interfaces for the calculation service
 */

/**
 * General options for calculation operations
 */
export interface CalculationOptions {
    /** Whether to use cache for the calculation */
    useCache?: boolean;
    /** Priority level for the calculation task */
    priority?: 'high' | 'normal' | 'low';
  }
  
  /**
   * Geometry types for channel cross-sections
   */
  export type ChannelGeometryType = 'rectangular' | 'trapezoidal' | 'circular' | 'irregular';
  
  /**
   * Base geometry definition
   */
  export interface BaseGeometry {
    type: ChannelGeometryType;
  }
  
  /**
   * Rectangular channel geometry
   */
  export interface RectangularGeometry extends BaseGeometry {
    type: 'rectangular';
    width: number;
    depth?: number;
  }
  
  /**
   * Trapezoidal channel geometry
   */
  export interface TrapezoidalGeometry extends BaseGeometry {
    type: 'trapezoidal';
    bottomWidth: number;
    sideSlope: number; // Horizontal:Vertical
    depth?: number;
  }
  
  /**
   * Circular channel geometry
   */
  export interface CircularGeometry extends BaseGeometry {
    type: 'circular';
    diameter: number;
  }
  
  /**
   * Irregular channel geometry defined by station-elevation pairs
   */
  export interface IrregularGeometry extends BaseGeometry {
    type: 'irregular';
    stations: Array<{
      station: number;
      elevation: number;
    }>;
  }
  
  /**
   * Union type for all channel geometries
   */
  export type ChannelGeometry = 
    | RectangularGeometry
    | TrapezoidalGeometry
    | CircularGeometry
    | IrregularGeometry;
  
  /**
   * Parameters for water surface profile calculation
   */
  export interface WaterSurfaceProfileParams {
    /** Channel geometry definition */
    channelGeometry: ChannelGeometry;
    /** Flow rate in cubic meters/second or cubic feet/second */
    flowRate: number;
    /** Manning's roughness coefficient */
    manningsN: number;
    /** Upstream water surface elevation */
    upstreamElevation?: number;
    /** Downstream water surface elevation */
    downstreamElevation?: number;
    /** Channel slope (m/m or ft/ft) */
    slope?: number;
  }
  
  /**
   * Parameters for culvert flow calculation
   */
  export interface CulvertFlowParams {
    /** Culvert geometry definition */
    culvertGeometry: CircularGeometry | RectangularGeometry;
    /** Flow rate in cubic meters/second or cubic feet/second */
    flowRate: number;
    /** Inlet configuration type */
    inletConfiguration: 'projecting' | 'mitered' | 'headwall' | 'beveled';
    /** Outlet configuration type */
    outletConfiguration: 'free' | 'submerged' | 'tailwater';
    /** Headwater elevation */
    headwaterElevation?: number;
    /** Tailwater elevation */
    tailwaterElevation?: number;
    /** Culvert length in meters or feet */
    length?: number;
    /** Culvert slope (m/m or ft/ft) */
    slope?: number;
    /** Manning's roughness coefficient */
    manningsN?: number;
  }
  
  /**
   * Parameters for rainfall runoff calculation
   */
  export interface RainfallRunoffParams {
    /** Catchment area in square kilometers or square miles */
    catchmentArea: number;
    /** Rainfall intensity in mm/hour or inches/hour */
    rainfallIntensity: number;
    /** Runoff coefficient (dimensionless) */
    runoffCoefficient: number;
    /** Storm duration in minutes */
    duration: number;
    /** Time of concentration in minutes */
    timeOfConcentration?: number;
  }
  
  /**
   * Results of a water surface profile calculation
   */
  export interface WaterSurfaceProfileResult {
    /** Array of points defining the water surface profile */
    points: Array<{
      station: number;
      elevation: number;
    }>;
    /** Additional metadata about the calculation */
    metadata: {
      /** Flow regime classification */
      flowRegime: 'subcritical' | 'supercritical' | 'mixed';
      /** Froude number at each station (optional) */
      froudeNumbers?: number[];
      /** Whether critical depth was reached */
      criticalDepthReached?: boolean;
      /** Whether a hydraulic jump occurred */
      hydraulicJump?: boolean;
    };
  }
  
  /**
   * Results of a culvert flow calculation
   */
  export interface CulvertFlowResult {
    /** Headwater elevation */
    headwater: number;
    /** Tailwater elevation */
    tailwater: number;
    /** Flow capacity in cubic meters/second or cubic feet/second */
    flowCapacity: number;
    /** Type of control determining flow */
    controlType: 'inlet' | 'outlet';
    /** Velocity at culvert outlet in meters/second or feet/second */
    outletVelocity?: number;
    /** Pipe full percentage */
    fullnessPercentage?: number;
  }
  
  /**
   * Results of a rainfall-runoff calculation
   */
  export interface RainfallRunoffResult {
    /** Peak flow rate in cubic meters/second or cubic feet/second */
    peakFlow: number;
    /** Runoff volume in cubic meters or cubic feet */
    runoffVolume: number;
    /** Time to peak in minutes */
    timeToPeak: number;
    /** Generated hydrograph points (if requested) */
    hydrograph?: Array<{
      time: number;
      flow: number;
    }>;
  }