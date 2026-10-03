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
      <div className="rounded-xl border border-[#1E354D] bg-[#0A192F]/85 p-5 shadow-2xl space-y-3 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-[#1E354D] pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Monsoon Phase Classification
            </h3>
          </div>
          {isDemoModelOutput && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30 font-bold">
              DEMO MODEL OUTPUT
            </span>
          )}
        </div>
        <div className="p-6 text-center text-slate-400 space-y-1 font-mono text-xs">
          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-bold text-slate-200 uppercase">
            Monsoon phase classification is not provided by the active model run
          </p>
          <p className="text-[11px] max-w-md mx-auto text-slate-400">
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
            bg: 'bg-[#0284C7]',
            text: 'text-white font-bold',
            border: 'border-[#38BDF8]',
            ring: 'ring-4 ring-[#0284C7]/30 shadow-glow-cyan',
          };
        case 'Break Watch':
        case 'Onset Watch':
          return {
            bg: 'bg-[#D97706]',
            text: 'text-white font-bold',
            border: 'border-[#F59E0B]',
            ring: 'ring-4 ring-[#D97706]/30',
          };
        case 'Break':
          return {
            bg: 'bg-[#DC2626]',
            text: 'text-white font-bold',
            border: 'border-[#EF4444]',
            ring: 'ring-4 ring-[#EF4444]/30',
          };
        case 'Revival':
          return {
            bg: 'bg-[#10B981]',
            text: 'text-[#062419] font-bold',
            border: 'border-[#4ADE80]',
            ring: 'ring-4 ring-[#10B981]/30',
          };
        case 'Pre-Onset':
        default:
          return {
            bg: 'bg-[#1E354D]',
            text: 'text-white font-bold',
            border: 'border-[#38BDF8]',
            ring: 'ring-4 ring-[#1E354D]/30',
          };
      }
    }

    if (isPast) {
      return {
        bg: 'bg-[#071324]',
        text: 'text-slate-400',
        border: 'border-[#1E354D]',
        ring: '',
      };
    }

    return {
      bg: 'bg-[#0A192F]/60',
      text: 'text-slate-500',
      border: 'border-[#1E354D]/50',
      ring: '',
    };
  };

  return (
    <div className="rounded-md border border-[#1E354D] bg-[#0A192F]/90 shadow-command-panel overflow-hidden backdrop-blur-md">
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-[#1E354D] bg-[#071324] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Monsoon Phase
            </h3>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            [Official Synoptic Phase Designation]
          </span>
          {isDemoModelOutput && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#FCD34D] font-mono text-[10px] font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
              <span>DEMO MODEL OUTPUT</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Phase Code:</span>
          <span className="font-mono text-xs font-bold text-white bg-[#0A192F] px-2 py-0.5 rounded-sm border border-[#1E354D]">
            {phaseInfo.phaseCode}
          </span>
          <DataSourceBadge source="IMD Synoptic Charts" type="station" size="sm" />
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Phase Stepper Flow */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Synoptic Monsoon Lifecycle:</span>
            <span>Current: <strong className="text-white">{current}</strong> ({phaseInfo.confidenceScore}% Model Confidence)</span>
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
                      <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" />
                    ) : null}
                  </div>
                  <div className={`text-xs font-bold truncate ${style.text}`}>
                    {phase}
                  </div>
                  <div className={`text-[9px] uppercase tracking-wider mt-1 ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
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
          <div className="p-3.5 rounded-sm bg-[#071324] border border-[#1E354D] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Synoptic Diagnosis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {phaseInfo.synopticBasis}
            </p>
          </div>

          {/* 2. Transition Risk */}
          <div className="p-3.5 rounded-sm bg-[#F59E0B]/10 border border-[#F59E0B]/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#FCD34D]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Phase Transition Risk</span>
            </div>
            <p className="text-xs text-amber-200 leading-relaxed">
              {phaseInfo.transitionRisk}
            </p>
            {phaseInfo.expectedNextPhase && (
              <div className="pt-1 text-[11px] font-mono text-amber-300 flex items-center gap-1">
                <span>Expected Next:</span>
                <span className="font-bold underline">{phaseInfo.expectedNextPhase}</span>
              </div>
            )}
          </div>

          {/* 3. Agricultural Advisory */}
          <div className="p-3.5 rounded-sm bg-[#10B981]/10 border border-[#10B981]/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#4ADE80]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>Agro-Decision Directive</span>
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed">
              {phaseInfo.agriculturalAdvisory}
            </p>
          </div>
        </div>

        {/* Transition Probability Trajectory */}
        {phaseInfo.phaseTrajectory && phaseInfo.phaseTrajectory.length > 0 && (
          <div className="pt-2 border-t border-[#1E354D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">
              Multi-Lead Phase Transition Trajectory:
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {phaseInfo.phaseTrajectory.map((traj, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-[#071324] px-2.5 py-1 rounded-sm border border-[#1E354D]">
                  <span className="text-slate-400">+{traj.horizonDays}d:</span>
                  <span className="font-bold text-white">{traj.phase}</span>
                  <span className="text-[#38BDF8] font-semibold">({traj.probability}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
