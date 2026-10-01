import React from 'react';
import type { EpistemicClassification } from '../../types/dataSources';
import { Eye, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface EpistemicBadgeProps {
  classification: EpistemicClassification;
  size?: 'sm' | 'md';
  className?: string;
}

export function EpistemicBadge({
  classification,
  size = 'md',
  className = '',
}: EpistemicBadgeProps) {
  const getConfig = (c: EpistemicClassification) => {
    switch (c) {
      case 'observed':
        return {
          label: 'OBSERVED',
          icon: Eye,
          bg: 'bg-[#EDF7F1]',
          text: 'text-[#154D2F]',
          border: 'border-[#ABD7C0]',
          tooltip: 'Direct physical sensor measurement, ground weather station, or calibrated satellite reading.',
        };
      case 'official_forecast':
        return {
          label: 'OFFICIAL FORECAST',
          icon: ShieldAlert,
          bg: 'bg-[#EAF0F6]',
          text: 'text-[#0B1F33]',
          border: 'border-[#CBD5E1]',
          tooltip: 'Statutory IMD / Govt. of India official operational weather forecast.',
        };
      case 'model_prediction':
        return {
          label: 'MODEL PREDICTION',
          icon: Cpu,
          bg: 'bg-[#EAF5FC]',
          text: 'text-[#0E63A8]',
          border: 'border-[#B9DCF4]',
          tooltip: 'Numerical Weather Prediction (NWP) or Machine-Learning algorithmic inference.',
        };
      case 'simulation':
      default:
        return {
          label: 'SIMULATION',
          icon: Sparkles,
          bg: 'bg-[#FCEDEC]',
          text: 'text-[#802626]',
          border: 'border-[#EEA9A7]',
          tooltip: 'Synthetic benchmark scenario or prospective demonstration model output.',
        };
    }
  };

  const config = getConfig(classification);
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      title={config.tooltip}
      className={`font-mono font-bold rounded-xs border uppercase inline-flex items-center gap-1.5 shadow-2xs select-none ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
