import type { RiskMapLayerConfig, RiskLayer } from '../../types/riskMap';

export const RISK_MAP_LAYERS: Record<RiskLayer, RiskMapLayerConfig> = {
  onset: {
    id: 'onset',
    name: 'Monsoon Onset Probability',
    shortName: 'Onset Probability',
    unit: '%',
    description: 'Ensemble probability of South-West Monsoon front arrival over Koraput during the active forecast horizon.',
    colorScale: [
      { min: 0, max: 20, label: '0–20%', subLabel: 'Very Low', color: '#D4E6F1', textColor: '#0C4E83' },
      { min: 20, max: 40, label: '20–40%', subLabel: 'Low', color: '#85C1E9', textColor: '#0B3A60' },
      { min: 40, max: 60, label: '40–60%', subLabel: 'Moderate', color: '#3498DB', textColor: '#FFFFFF' },
      { min: 60, max: 80, label: '60–80%', subLabel: 'High', color: '#1479C9', textColor: '#FFFFFF' },
      { min: 80, max: 100, label: '80–100%', subLabel: 'Very High', color: '#0B3A60', textColor: '#FFFFFF' },
    ],
  },
  break: {
    id: 'break',
    name: 'Break / Dry Spell Probability',
    shortName: 'Break / Dry Spell',
    unit: '%',
    description: 'Probability of consecutive dry days (>5 days with rain <2.5mm) threatening rainfed seedling survival.',
    colorScale: [
      { min: 0, max: 20, label: '0–20%', subLabel: 'Very Low', color: '#EDF7F1', textColor: '#154D2F', borderColor: '#ABD7C0' },
      { min: 20, max: 40, label: '20–40%', subLabel: 'Low', color: '#FAECD0', textColor: '#8C5D00' },
      { min: 40, max: 60, label: '40–60%', subLabel: 'Moderate', color: '#F59E0B', textColor: '#FFFFFF' },
      { min: 60, max: 80, label: '60–80%', subLabel: 'High', color: '#D97706', textColor: '#FFFFFF' },
      { min: 80, max: 100, label: '80–100%', subLabel: 'Very High', color: '#C43D3D', textColor: '#FFFFFF' },
    ],
  },
  heavyRain: {
    id: 'heavyRain',
    name: 'Heavy Rainfall Probability',
    shortName: 'Heavy Rainfall',
    unit: '%',
    description: 'Probability of 24-hour convective or orographic precipitation exceeding IMD heavy threshold (≥64.5mm).',
    colorScale: [
      { min: 0, max: 20, label: '0–20%', subLabel: 'Very Low', color: '#EAF0F6', textColor: '#4B5B6D' },
      { min: 20, max: 40, label: '20–40%', subLabel: 'Low', color: '#93C5FD', textColor: '#0B3A60' },
      { min: 40, max: 60, label: '40–60%', subLabel: 'Moderate', color: '#3B82F6', textColor: '#FFFFFF' },
      { min: 60, max: 80, label: '60–80%', subLabel: 'High', color: '#EF4444', textColor: '#FFFFFF' },
      { min: 80, max: 100, label: '80–100%', subLabel: 'Very High', color: '#991B1B', textColor: '#FFFFFF' },
    ],
  },
  rainfallAnomaly: {
    id: 'rainfallAnomaly',
    name: 'Rainfall Anomaly (% Departure)',
    shortName: 'Rainfall Anomaly',
    unit: '%',
    description: 'Departure of precipitation forecast against 30-year IMD Long Period Average (LPA) baseline.',
    colorScale: [
      { min: -100, max: -60, label: '< -60%', subLabel: 'Strong Deficit', color: '#C43D3D', textColor: '#FFFFFF' },
      { min: -60, max: -20, label: '-59% to -20%', subLabel: 'Deficit', color: '#D99000', textColor: '#FFFFFF' },
      { min: -20, max: 20, label: '-19% to +19%', subLabel: 'Near Normal', color: '#247A4A', textColor: '#FFFFFF' },
      { min: 20, max: 60, label: '+20% to +59%', subLabel: 'Above Normal', color: '#1479C9', textColor: '#FFFFFF' },
      { min: 60, max: 200, label: '> +60%', subLabel: 'Strong Excess', color: '#0B1F33', textColor: '#FFFFFF' },
    ],
  },
};

/**
 * Maps a numerical metric value to the corresponding color in the layer scale
 */
export function getMetricFillColor(layer: RiskLayer, value: number): string {
  const config = RISK_MAP_LAYERS[layer];
  for (const step of config.colorScale) {
    if (value >= step.min && value <= step.max) {
      return step.color;
    }
  }
  // Clamp to boundary steps
  if (value < config.colorScale[0].min) return config.colorScale[0].color;
  return config.colorScale[config.colorScale.length - 1].color;
}

/**
 * Returns qualitative category label (e.g. "High", "Near Normal") for a metric value
 */
export function getMetricCategoryLabel(layer: RiskLayer, value: number): string {
  const config = RISK_MAP_LAYERS[layer];
  for (const step of config.colorScale) {
    if (value >= step.min && value <= step.max) {
      return step.subLabel || step.label;
    }
  }
  if (value < config.colorScale[0].min) return config.colorScale[0].subLabel || config.colorScale[0].label;
  return config.colorScale[config.colorScale.length - 1].subLabel || config.colorScale[config.colorScale.length - 1].label;
}

/**
 * Legacy compatibility wrapper for geojson polygon coloring
 */
export function getFeatureFillColor(
  layerId: RiskLayer,
  properties: {
    onsetProbability: number;
    breakProbability: number;
    heavyRainProbability: number;
    rainfallAnomalyPercent: number;
  }
): string {
  let val = 0;
  if (layerId === 'onset') val = properties.onsetProbability;
  else if (layerId === 'break') val = properties.breakProbability;
  else if (layerId === 'heavyRain') val = properties.heavyRainProbability;
  else if (layerId === 'rainfallAnomaly') val = properties.rainfallAnomalyPercent;

  return getMetricFillColor(layerId, val);
}
