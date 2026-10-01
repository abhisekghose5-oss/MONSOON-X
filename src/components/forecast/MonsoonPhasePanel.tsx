import React from 'react';
import type { MonsoonPhaseInfo, MonsoonPhaseState } from '../../types/forecast';
import {
  Compass,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { DataSourceBadge } from '../design-system/DataSourceBadge';

export interface MonsoonPhasePanelProps {
  phaseInfo: MonsoonPhaseInfo | null;
  isDemoModelOutput?: boolean;
}

const ALL_PHASES: MonsoonPhaseState[] = [
  'Pre-Onset',
  'Onset Watch',
  'Onset',
  'Active',
  'Break Watch',
  'Break',
  'Revival',
];

export function MonsoonPhasePanel({
  phaseInfo,
  isDemoModelOutput = false,
}: MonsoonPhasePanelProps) {
  // CRITICAL REQUIREMENT: Do not claim a phase unless provided by the backend.
  if (!phaseInfo || !phaseInfo.currentPhase) {
    return (
      <div className="rounded-md border border-[#E2E8F0] bg-white p-5 shadow-gov-card space-y-3">
        <div className="flex items-center justify-between border-b border-[#F0F3F7] pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#6E7F94]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Monsoon Phase Classification
            </h3>
          </div>
          {isDemoModelOutput && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] font-semibold">
              DEMO MODEL OUTPUT
            </span>
          )}
        </div>
        <div className="p-6 text-center text-[#6E7F94] space-y-1 font-mono text-xs">
          <HelpCircle className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
          <p className="font-bold text-[#4B5B6D] uppercase">
            Monsoon phase classification is not provided by the active model run
          </p>
          <p className="text-[11px] max-w-md mx-auto">
            The numerical weather prediction ingestion pipeline has not published an authoritative synoptic phase designation for the current cycle.
          </p>
        </div>
      </div>
    );
  }

  const current = phaseInfo.currentPhase;
  const currentIndex = ALL_PHASES.indexOf(current);

  const getPhaseStyles = (phase: MonsoonPhaseState, isActive: boolean, isPast: boolean) => {
    if (isActive) {
      switch (phase) {
        case 'Active':
        case 'Onset':
          return {
            bg: 'bg-[#1479C9]',
            text: 'text-white',
            border: 'border-[#1479C9]',
            ring: 'ring-4 ring-[#1479C9]/20',
          };
        case 'Break Watch':
        case 'Onset Watch':
          return {
            bg: 'bg-[#D99000]',
            text: 'text-white',
            border: 'border-[#D99000]',
            ring: 'ring-4 ring-[#D99000]/20',
          };
        case 'Break':
          return {
            bg: 'bg-[#C43D3D]',
            text: 'text-white',
            border: 'border-[#C43D3D]',
            ring: 'ring-4 ring-[#C43D3D]/20',
          };
        case 'Revival':
          return {
            bg: 'bg-[#247A4A]',
            text: 'text-white',
            border: 'border-[#247A4A]',
            ring: 'ring-4 ring-[#247A4A]/20',
          };
        case 'Pre-Onset':
        default:
          return {
            bg: 'bg-[#0B1F33]',
            text: 'text-white',
            border: 'border-[#0B1F33]',
            ring: 'ring-4 ring-[#0B1F33]/20',
          };
      }
    }

    if (isPast) {
      return {
        bg: 'bg-[#EAF0F6]',
        text: 'text-[#4B5B6D]',
        border: 'border-[#CBD5E1]',
        ring: '',
      };
    }

    return {
      bg: 'bg-white',
      text: 'text-[#6E7F94]',
      border: 'border-[#E2E8F0]',
      ring: '',
    };
  };

  return (
    <div className="rounded-md border border-[#E2E8F0] bg-white shadow-gov-card overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F5F7FA]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#1479C9]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
              Monsoon Phase
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#6E7F94]">
            [Official Synoptic Phase Designation]
          </span>
          {isDemoModelOutput && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#FDF7EB] border border-[#F4D79C] text-[#8C5D00] font-mono text-[10px] font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3 text-[#D99000]" />
              <span>DEMO MODEL OUTPUT</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#6E7F94]">Phase Code:</span>
          <span className="font-mono text-xs font-bold text-[#0B1F33] bg-[#EAF0F6] px-2 py-0.5 rounded-sm border border-[#CBD5E1]">
            {phaseInfo.phaseCode}
          </span>
          <DataSourceBadge source="IMD Synoptic Charts" type="station" size="sm" />
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Phase Stepper Flow */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E7F94] mb-2 flex items-center justify-between">
            <span>Synoptic Monsoon Lifecycle:</span>
            <span>Current: <strong className="text-[#0B1F33]">{current}</strong> ({phaseInfo.confidenceScore}% Model Confidence)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {ALL_PHASES.map((phase, idx) => {
              const isActive = phase === current;
              const isPast = idx < currentIndex;
              const style = getPhaseStyles(phase, isActive, isPast);

              return (
                <div
                  key={phase}
                  className={`p-2.5 rounded-sm border text-center font-mono transition-all flex flex-col justify-between ${style.bg} ${style.border} ${style.ring}`}
                >
                  <div className="flex items-center justify-between text-[10px] text-opacity-80 pb-1">
                    <span className="opacity-75">#{idx + 1}</span>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    ) : isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-[#247A4A]" />
                    ) : null}
                  </div>
                  <div className={`text-xs font-bold truncate ${style.text}`}>
                    {phase}
                  </div>
                  <div className={`text-[9px] uppercase tracking-wider mt-1 ${isActive ? 'text-white/90' : 'text-[#6E7F94]'}`}>
                    {isActive ? 'Current Phase' : isPast ? 'Completed' : 'Upcoming'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          {/* 1. Synoptic Basis */}
          <div className="p-3.5 rounded-sm bg-[#F5F7FA] border border-[#CBD5E1] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F33]">
              <Sparkles className="w-3.5 h-3.5 text-[#1479C9]" />
              <span>Synoptic Diagnosis</span>
            </div>
            <p className="text-xs text-[#16202A] leading-relaxed">
              {phaseInfo.synopticBasis}
            </p>
          </div>

          {/* 2. Transition Risk */}
          <div className="p-3.5 rounded-sm bg-[#FDF7EB] border border-[#F4D79C] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#8C5D00]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D99000]" />
              <span>Phase Transition Risk</span>
            </div>
            <p className="text-xs text-[#8C5D00] leading-relaxed">
              {phaseInfo.transitionRisk}
            </p>
            {phaseInfo.expectedNextPhase && (
              <div className="pt-1 text-[11px] font-mono text-[#664400] flex items-center gap-1">
                <span>Expected Next:</span>
                <span className="font-bold underline">{phaseInfo.expectedNextPhase}</span>
              </div>
            )}
          </div>

          {/* 3. Agricultural Advisory */}
          <div className="p-3.5 rounded-sm bg-[#EDF7F1] border border-[#ABD7C0] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#154D2F]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#247A4A]" />
              <span>Agro-Decision Directive</span>
            </div>
            <p className="text-xs text-[#154D2F] leading-relaxed">
              {phaseInfo.agriculturalAdvisory}
            </p>
          </div>
        </div>

        {/* Transition Probability Trajectory */}
        {phaseInfo.phaseTrajectory && phaseInfo.phaseTrajectory.length > 0 && (
          <div className="pt-2 border-t border-[#F0F3F7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="text-[11px] text-[#6E7F94] uppercase tracking-wider">
              Multi-Lead Phase Transition Trajectory:
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {phaseInfo.phaseTrajectory.map((traj, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-[#F0F3F7] px-2.5 py-1 rounded-sm border border-[#CBD5E1]">
                  <span className="text-[#6E7F94]">+{traj.horizonDays}d:</span>
                  <span className="font-bold text-[#0B1F33]">{traj.phase}</span>
                  <span className="text-[#1479C9] font-semibold">({traj.probability}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
