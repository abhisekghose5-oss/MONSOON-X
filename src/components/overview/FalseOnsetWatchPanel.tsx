import React from 'react';
import type { FalseOnsetWatch as OverviewFalseOnsetWatch } from '../../types/overview';
import { FalseOnsetWatch } from '../common/FalseOnsetWatch';
import { FalseOnsetService } from '../../services/falseOnsetService';

interface FalseOnsetWatchPanelProps {
  watch: OverviewFalseOnsetWatch;
}

export function FalseOnsetWatchPanel({ watch }: FalseOnsetWatchPanelProps) {
  // Adapt overview diagnostic parameters into FalseOnsetService evaluation
  const evaluatedResult = FalseOnsetService.evaluate({
    onsetProbability: watch.status === 'false_onset_detected' ? 72 : watch.status === 'active_watch' ? 58 : 34,
    rainfallPersistenceDays: watch.rainfallContinuityMet ? 5 : 2,
    drySpellProbability: watch.status === 'false_onset_detected' ? 64 : watch.status === 'active_watch' ? 54 : 22,
    forecastHorizonDays: 14,
  });

  return <FalseOnsetWatch data={evaluatedResult} />;
}
