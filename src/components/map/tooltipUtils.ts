import type { RiskLayer, ForecastHorizon } from '../../types/riskMap';
import { RISK_MAP_LAYERS, getMetricFillColor, getMetricCategoryLabel } from '../../data/geo/layerConfigs';
import { DEMO_DATA_STATUS } from '../../data/mock/riskMap';

/**
 * Generates semantic, high-precision HTML string for Leaflet vector tooltips
 */
export function generateTooltipHtml(data: {
  locationName: string;
  layer: RiskLayer;
  value: number;
  horizon: ForecastHorizon;
  elevationMeters?: number;
}): string {
  const config = RISK_MAP_LAYERS[data.layer];
  const color = getMetricFillColor(data.layer, data.value);
  const categoryLabel = getMetricCategoryLabel(data.layer, data.value);
  const formattedVal = data.layer === 'rainfallAnomaly'
    ? `${data.value > 0 ? '+' : ''}${data.value}%`
    : `${data.value}%`;

  return `
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 6px 8px; min-width: 170px; line-height: 1.35; background: #0B1F33; color: #FFFFFF; border-radius: 3px; border: 1px solid #1E354D; box-shadow: 0 4px 12px rgba(11,31,51,0.35);">
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 4px; margin-bottom: 5px;">
        <strong style="text-transform: uppercase; font-size: 12px; color: #FFFFFF; letter-spacing: 0.5px;">${data.locationName}</strong>
        ${data.elevationMeters ? `<span style="font-size: 10px; color: #A4BCDA;">${data.elevationMeters}m</span>` : ''}
      </div>
      
      <div style="font-size: 10px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">
        ${config.shortName}
      </div>
      
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
        <span style="font-size: 16px; font-weight: 700; color: ${color};">
          ${formattedVal}
        </span>
        <span style="font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 2px; background: rgba(255,255,255,0.1); color: #FFFFFF; text-transform: uppercase;">
          Status: ${categoryLabel}
        </span>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 10px; color: #A4BCDA; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px; margin-top: 4px;">
        <span>Forecast:</span>
        <strong style="color: #FFFFFF;">${data.horizon.replace('D', ' Days')}</strong>
      </div>

      <div style="margin-top: 4px; padding-top: 2px; font-size: 9px; color: #F4D79C; letter-spacing: 0.3px; text-transform: uppercase; text-align: center;">
        ● ${DEMO_DATA_STATUS}
      </div>
    </div>
  `;
}
