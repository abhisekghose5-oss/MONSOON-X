import { useQuery } from '@tanstack/react-query';
import { FalseOnsetService } from '../services/falseOnsetService';
import { useBlockSelection } from './useBlockSelection';
import type { FalseOnsetInputs, FalseOnsetThresholdConfig } from '../types/falseOnset';

export function useFalseOnsetWatch(
  horizonDays: number = 14,
  customInputs?: Partial<FalseOnsetInputs>,
  customThresholds?: Partial<FalseOnsetThresholdConfig>
) {
  const { selectedBlockId } = useBlockSelection();

  const query = useQuery({
    queryKey: ['falseOnset', selectedBlockId, horizonDays, customInputs, customThresholds],
    queryFn: async () => {
      if (customInputs && customInputs.onsetProbability !== undefined) {
        // Direct evaluation mode if explicit inputs provided
        const inputs: FalseOnsetInputs = {
          onsetProbability: customInputs.onsetProbability,
          rainfallPersistenceDays: customInputs.rainfallPersistenceDays ?? 3,
          drySpellProbability: customInputs.drySpellProbability ?? 50,
          forecastHorizonDays: horizonDays,
        };
        return FalseOnsetService.evaluate(inputs, customThresholds);
      }

      // Default block-based service call
      return FalseOnsetService.getFalseOnsetWatch(
        selectedBlockId,
        horizonDays,
        customThresholds
      );
    },
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    falseOnset: query.data,
  };
}
