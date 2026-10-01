import React from 'react';
import type { CropRiskDetail, CropDefinition } from '../../types/agriculture';
import {
  CloudRain,
  Sun,
  AlertTriangle,
  Calendar,
  Droplets,
  CheckCircle2,
  Gauge,
  Layers,
} from 'lucide-react';
import { RiskBadge } from '../design-system/RiskBadge';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface CropDetailCardProps {
  cropDef: CropDefinition;
  detail: CropRiskDetail;
  targetBlock: string;
}

export function CropDetailCard({
  cropDef,
  detail,
  targetBlock,
}: CropDetailCardProps) {
  return (
    <div className="rounded-md border border-[#E2E8F0] bg-white shadow-gov-card overflow-hidden space-y-0">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-[#E2E8F0] bg-[#F5F7FA]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-sm bg-[#247A4A] text-white">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#0B1F33] font-sans">
                {detail.cropName}
              </h3>
              <span className="font-mono text-xs font-semibold text-[#247A4A] bg-[#EDF7F1] px-2 py-0.5 rounded-xs border border-[#ABD7C0]">
                {detail.localName}
              </span>
              <span className="font-mono text-[11px] text-[#6E7F94] italic">
                {cropDef.scientificName}
              </span>
            </div>
            <p className="text-xs text-[#4B5B6D] font-mono mt-0.5">
              Region: <strong className="text-[#0B1F33]">{targetBlock}</strong> · Current Phenology: <strong className="text-[#1479C9]">{detail.phenologyStage}</strong>
            </p>
          </div>
        </div>

        {/* 1. CURRENT RISK BADGE */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#6E7F94] uppercase tracking-wider hidden sm:inline">
            Crop Risk Status:
          </span>
          <RiskBadge
            level={detail.currentRisk}
            label={detail.currentRiskLabel}
            size="md"
          />
        </div>
      </div>

      {/* 8 Required Crop Attributes Grid */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Core 4 Metric Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 2. RAINFALL OUTLOOK */}
          <div className="p-3.5 rounded-sm bg-[#EDF6FC] border border-[#ACD5F2] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#0C4E83]">
                Rainfall Outlook
              </span>
              <CloudRain className="w-4 h-4 text-[#1479C9]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#0B1F33] leading-snug">
                {detail.rainfallOutlook}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#6E7F94]">
              14-Day Downscaled QPF
            </span>
          </div>

          {/* 3. DRY SPELL PROBABILITY */}
          <div className="p-3.5 rounded-sm bg-[#FDF7EB] border border-[#F4D79C] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#8C5D00]">
                Dry Spell Probability
              </span>
              <Sun className="w-4 h-4 text-[#D99000]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#8C5D00]">
                {detail.drySpellProbability}%
              </span>
              <span className="text-[11px] font-mono text-[#B37700]">
                {detail.drySpellProbability >= 40 ? 'High Concern' : 'Low Hazard'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#6E7F94]">
              Threshold: &gt; 7 Days Deficit
            </span>
          </div>

          {/* 4. HEAVY RAIN PROBABILITY */}
          <div className="p-3.5 rounded-sm bg-[#FCEDEC] border border-[#EEA9A7] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#802626]">
                Heavy Rain Probability
              </span>
              <AlertTriangle className="w-4 h-4 text-[#C43D3D]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#802626]">
                {detail.heavyRainProbability}%
              </span>
              <span className="text-[11px] font-mono text-[#A33131]">
                {detail.heavyRainProbability >= 40 ? 'Waterlogging Risk' : 'Nominal'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#6E7F94]">
              Threshold: &gt; 50 mm / 24h
            </span>
          </div>

          {/* 8. CONFIDENCE */}
          <div className="p-3.5 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#4B5B6D]">
                Ensemble Confidence
              </span>
              <Gauge className="w-4 h-4 text-[#1479C9]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#0B1F33]">
                {detail.confidence.score}%
              </span>
              <span className="text-[11px] font-mono font-bold text-[#247A4A]">
                [{detail.confidence.tier}]
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#6E7F94] truncate" title={detail.confidence.basis}>
              {detail.confidence.basis}
            </span>
          </div>
        </div>

        {/* 5. SOWING WINDOW & 6. WATER STRESS DUAL PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 5. SOWING WINDOW */}
          <div className="p-3.5 rounded-sm bg-white border border-[#CBD5E1] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0B1F33] uppercase">
                <Calendar className="w-3.5 h-3.5 text-[#1479C9]" />
                <span>Sowing Window Status</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#1479C9] bg-[#EDF6FC] px-2 py-0.5 rounded-xs border border-[#ACD5F2]">
                {detail.sowingWindow.status}
              </span>
            </div>
            <div className="text-xs font-mono text-[#4B5B6D]">
              <span className="text-[#6E7F94]">Calibrated Window:</span>{' '}
              <strong className="text-[#0B1F33]">{detail.sowingWindow.recommendedWindowDate}</strong>
            </div>
            <p className="text-xs text-[#4B5B6D] leading-relaxed">
              {detail.sowingWindow.advice}
            </p>
          </div>

          {/* 6. WATER STRESS */}
          <div className="p-3.5 rounded-sm bg-white border border-[#CBD5E1] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0B1F33] uppercase">
                <Droplets className="w-3.5 h-3.5 text-[#247A4A]" />
                <span>Crop Water Stress & Root-Zone Hydrology</span>
              </div>
              <span
                className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-xs border ${
                  detail.waterStress.level === 'None'
                    ? 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]'
                    : detail.waterStress.level === 'Low'
                    ? 'bg-[#EDF6FC] text-[#0C4E83] border-[#ACD5F2]'
                    : 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]'
                }`}
              >
                Stress: {detail.waterStress.level}
              </span>
            </div>
            <div className="text-xs font-mono text-[#4B5B6D]">
              <span className="text-[#6E7F94]">Root-Zone Soil Moisture (0–30 cm):</span>{' '}
              <strong className="text-[#0B1F33]">{detail.waterStress.rootZoneMoistureVolumetricPct}% Volumetric Water Content</strong>
            </div>
            <p className="text-xs text-[#4B5B6D] leading-relaxed">
              {detail.waterStress.description}
            </p>
          </div>
        </div>

        {/* 7. RECOMMENDED ACTION BANNER */}
        <div className="rounded-sm border-l-4 border-l-[#247A4A] border border-[#CBD5E1] bg-[#EDF7F1] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#154D2F]">
              <CheckCircle2 className="w-4 h-4 text-[#247A4A]" />
              <span>Recommended Farm Management Action</span>
            </div>
            <p className="text-xs text-[#154D2F] font-semibold leading-relaxed">
              {detail.recommendedAction}
            </p>
          </div>
          <div className="shrink-0">
            <DataSourceBadge source="OUAT / KVK Koraput Protocol" type="survey" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
