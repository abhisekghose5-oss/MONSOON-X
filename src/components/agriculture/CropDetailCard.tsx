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
    <div className="rounded-lg border border-[#1E354D] bg-[#0A192F] shadow-command-panel overflow-hidden space-y-0 text-white">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-sm bg-[#10B981]/20 border border-[#10B981]/40 text-[#4ADE80]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white font-sans">
                {detail.cropName}
              </h3>
              <span className="font-mono text-xs font-semibold text-[#4ADE80] bg-emerald-950/60 px-2 py-0.5 rounded-xs border border-emerald-500/40">
                {detail.localName}
              </span>
              <span className="font-mono text-[11px] text-slate-400 italic">
                {cropDef.scientificName}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Region: <strong className="text-white">{targetBlock}</strong> · Current Phenology: <strong className="text-[#38BDF8]">{detail.phenologyStage}</strong>
            </p>
          </div>
        </div>

        {/* 1. CURRENT RISK BADGE */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
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
          <div className="p-3.5 rounded-md bg-[#071324] border border-[#1E354D] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#38BDF8]">
                Rainfall Outlook
              </span>
              <CloudRain className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div>
              <p className="text-xs font-medium text-white leading-snug">
                {detail.rainfallOutlook}
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              14-Day Downscaled QPF
            </span>
          </div>

          {/* 3. DRY SPELL PROBABILITY */}
          <div className="p-3.5 rounded-md bg-[#1C1608]/80 border border-[#1E354D] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#FCD34D]">
                Dry Spell Probability
              </span>
              <Sun className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#FCD34D]">
                {detail.drySpellProbability}%
              </span>
              <span className="text-[11px] font-mono text-amber-300">
                {detail.drySpellProbability >= 40 ? 'High Concern' : 'Low Hazard'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Threshold: &gt; 7 Days Deficit
            </span>
          </div>

          {/* 4. HEAVY RAIN PROBABILITY */}
          <div className="p-3.5 rounded-md bg-[#200D0D]/80 border border-[#1E354D] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-[#F87171]">
                Heavy Rain Probability
              </span>
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-[#F87171]">
                {detail.heavyRainProbability}%
              </span>
              <span className="text-[11px] font-mono text-rose-300">
                {detail.heavyRainProbability >= 40 ? 'Waterlogging Risk' : 'Nominal'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Threshold: &gt; 50 mm / 24h
            </span>
          </div>

          {/* 8. CONFIDENCE */}
          <div className="p-3.5 rounded-md bg-[#071324] border border-[#1E354D] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-300">
                Ensemble Confidence
              </span>
              <Gauge className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-white">
                {detail.confidence.score}%
              </span>
              <span className="text-[11px] font-mono font-bold text-[#4ADE80]">
                [{detail.confidence.tier}]
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 truncate" title={detail.confidence.basis}>
              {detail.confidence.basis}
            </span>
          </div>
        </div>

        {/* 5. SOWING WINDOW & 6. WATER STRESS DUAL PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 5. SOWING WINDOW */}
          <div className="p-3.5 rounded-md bg-[#071324] border border-[#1E354D] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase">
                <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Sowing Window Status</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#38BDF8] bg-[#0284C7]/20 px-2 py-0.5 rounded-xs border border-[#0284C7]/40">
                {detail.sowingWindow.status}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-300">
              <span className="text-slate-400">Calibrated Window:</span>{' '}
              <strong className="text-white">{detail.sowingWindow.recommendedWindowDate}</strong>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {detail.sowingWindow.advice}
            </p>
          </div>

          {/* 6. WATER STRESS */}
          <div className="p-3.5 rounded-md bg-[#071324] border border-[#1E354D] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase">
                <Droplets className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Crop Water Stress & Root-Zone Hydrology</span>
              </div>
              <span
                className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-xs border ${
                  detail.waterStress.level === 'None'
                    ? 'bg-emerald-950/60 text-[#4ADE80] border-emerald-500/40'
                    : detail.waterStress.level === 'Low'
                    ? 'bg-sky-950/60 text-[#38BDF8] border-sky-500/40'
                    : 'bg-amber-950/60 text-[#FCD34D] border-amber-500/40'
                }`}
              >
                Stress: {detail.waterStress.level}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-300">
              <span className="text-slate-400">Root-Zone Soil Moisture (0–30 cm):</span>{' '}
              <strong className="text-white">{detail.waterStress.rootZoneMoistureVolumetricPct}% Volumetric Water Content</strong>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {detail.waterStress.description}
            </p>
          </div>
        </div>

        {/* 7. RECOMMENDED ACTION BANNER */}
        <div className="rounded-md border-l-4 border-l-[#10B981] border border-emerald-500/40 bg-emerald-950/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#4ADE80]">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
              <span>Recommended Farm Management Action</span>
            </div>
            <p className="text-xs text-emerald-200 font-semibold leading-relaxed font-sans">
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
