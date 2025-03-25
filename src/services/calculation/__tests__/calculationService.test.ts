// src/services/calculation/__tests__/calculationService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CalculationService } from '../calculationService';
import { CalculationOrchestrator } from '../calculationOrchestrator';

// Mock the orchestrator
vi.mock('../calculationOrchestrator', () => {
  return {
    CalculationOrchestrator: vi.fn().mockImplementation(() => ({
      calculateWaterSurfaceProfile: vi.fn(),
      calculateCulvertFlow: vi.fn(),
      calculateBridgeHydraulics: vi.fn(),
      calculateStormwaterSystem: vi.fn(),
      dispose: vi.fn()
    }))
  };
});

describe('CalculationService', () => {
  let calculationService: CalculationService;
  let mockOrchestrator: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create service instance
    calculationService = new CalculationService();
    
    // Get mock orchestrator instance
    mockOrchestrator = (CalculationOrchestrator as unknown as ReturnType<typeof vi.fn>).mock.results[0].value;
  });

  afterEach(() => {
    calculationService.dispose();
  });

  describe('calculateWaterSurfaceProfile', () => {
    const validParams = {
      channelGeometry: { type: 'rectangular', width: 10 },
      flowRate: 10,
      manningsN: 0.013,
      upstreamElevation: 100,
      downstreamElevation: 98
    };

    it('should call orchestrator with correct parameters', async () => {
      // Setup mock return value
      mockOrchestrator.calculateWaterSurfaceProfile.mockResolvedValue({
        points: [{ station: 0, elevation: 100 }, { station: 100, elevation: 98 }],
        metadata: { flowRegime: 'subcritical' }
      });

      // Execute service method
      const result = await calculationService.calculateWaterSurfaceProfile(validParams);

      // Verify orchestrator was called with correct parameters
      expect(mockOrchestrator.calculateWaterSurfaceProfile).toHaveBeenCalledWith(validParams);
      
      // Verify result matches mock
      expect(result).toEqual({
        points: [{ station: 0, elevation: 100 }, { station: 100, elevation: 98 }],
        metadata: { flowRegime: 'subcritical' }
      });
    });

    it('should pass through errors from orchestrator', async () => {
      // Setup mock to throw error
      const testError = new Error('Calculation failed');
      mockOrchestrator.calculateWaterSurfaceProfile.mockRejectedValue(testError);

      // Verify error is passed through
      await expect(calculationService.calculateWaterSurfaceProfile(validParams))
        .rejects.toThrow('Calculation failed');
    });
  });

  describe('calculateCulvertFlow', () => {
    const validParams = {
      culvertGeometry: { type: 'circular', diameter: 1.2 },
      flowRate: 5,
      inletConfiguration: 'projecting',
      outletConfiguration: 'free',
      headwaterElevation: 100,
      tailwaterElevation: 98
    };

    it('should call orchestrator with correct parameters', async () => {
      // Setup mock return value
      mockOrchestrator.calculateCulvertFlow.mockResolvedValue({
        headwater: 100,
        tailwater: 98,
        flowCapacity: 10,
        controlType: 'inlet'
      });

      // Execute service method
      const result = await calculationService.calculateCulvertFlow(validParams);

      // Verify orchestrator was called with correct parameters
      expect(mockOrchestrator.calculateCulvertFlow).toHaveBeenCalledWith(validParams);
      
      // Verify result
      expect(result).toEqual({
        headwater: 100,
        tailwater: 98,
        flowCapacity: 10,
        controlType: 'inlet'
      });
    });

    it('should handle edge case with zero flow rate', async () => {
      // Edge case parameters
      const edgeCaseParams = {
        ...validParams,
        flowRate: 0
      };

      // Setup mock return value
      mockOrchestrator.calculateCulvertFlow.mockResolvedValue({
        headwater: 100,
        tailwater: 98,
        flowCapacity: 0,
        controlType: 'inlet'
      });

      const result = await calculationService.calculateCulvertFlow(edgeCaseParams);
      
      expect(mockOrchestrator.calculateCulvertFlow).toHaveBeenCalledWith(edgeCaseParams);
      expect(result.flowCapacity).toBe(0);
    });
  });

  describe('calculateRainfallRunoff', () => {
    const validParams = {
      catchmentArea: 100,
      rainfallIntensity: 25,
      runoffCoefficient: 0.65,
      duration: 60
    };

    it('should throw not implemented error', async () => {
      await expect(calculationService.calculateRainfallRunoff(validParams))
        .rejects.toThrow('Rainfall-runoff calculation not yet implemented');
    });
  });

  describe('dispose', () => {
    it('should call dispose on orchestrator', () => {
      calculationService.dispose();
      expect(mockOrchestrator.dispose).toHaveBeenCalled();
    });
  });
});