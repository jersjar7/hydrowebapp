// src/services/calculation/__tests__/calculationService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CalculationService } from '../calculationService';

// Mock dependencies
vi.mock('../../../core/computation/calculationOrchestrator', () => ({
  CalculationOrchestrator: vi.fn().mockImplementation(() => ({
    calculateWaterSurfaceProfile: vi.fn().mockResolvedValue({
      points: [
        { station: 0, elevation: 100 },
        { station: 100, elevation: 99.5 }
      ],
      metadata: { flowRegime: 'subcritical' }
    }),
    calculateCulvertFlow: vi.fn().mockResolvedValue({
      headwater: 100,
      tailwater: 98,
      flowCapacity: 9,
      controlType: 'inlet'
    }),
    dispose: vi.fn()
  }))
}));

describe('CalculationService', () => {
  let calculationService: CalculationService;
  const channelGeometry = { type: 'rectangular', width: 10 };
  const flowRate = 10;
  const manningsN = 0.013;

  beforeEach(() => {
    // Create a fresh instance for each test
    calculationService = new CalculationService();
  });

  afterEach(() => {
    // Clean up after each test
    calculationService.dispose();
    vi.clearAllMocks();
  });

  it('should calculate water surface profile', async () => {
    // Arrange
    const params = {
      channelGeometry,
      flowRate,
      manningsN,
      upstreamElevation: 100,
      downstreamElevation: 99
    };

    // Act
    const result = await calculationService.calculateWaterSurfaceProfile(params);

    // Assert
    expect(result).toBeDefined();
    expect(result.points).toHaveLength(2);
    expect(result.metadata.flowRegime).toBe('subcritical');
  });

  it('should calculate culvert flow', async () => {
    // Arrange
    const params = {
      culvertGeometry: { type: 'circular', diameter: 1.2 },
      flowRate: 5,
      inletConfiguration: 'projecting',
      outletConfiguration: 'free',
      headwaterElevation: 100,
      tailwaterElevation: 98
    };

    // Act
    const result = await calculationService.calculateCulvertFlow(params);

    // Assert
    expect(result).toBeDefined();
    expect(result.controlType).toBe('inlet');
    expect(result.flowCapacity).toBe(9);
  });

  it('should throw error for unimplemented rainfall-runoff calculation', async () => {
    // Arrange
    const params = {
      catchmentArea: 100,
      rainfallIntensity: 25,
      runoffCoefficient: 0.65,
      duration: 60
    };

    // Act & Assert
    await expect(calculationService.calculateRainfallRunoff(params))
      .rejects
      .toThrow('Rainfall-runoff calculation not yet implemented');
  });
});