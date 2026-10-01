export type RiskSeverity = 'normal' | 'low' | 'moderate' | 'high' | 'critical';

export interface SeverityConfig {
  label: string;
  badgeClass: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
}

export function getSeverityConfig(severity: RiskSeverity): SeverityConfig {
  switch (severity) {
    case 'critical':
      return {
        label: 'Critical Warning',
        badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        textClass: 'text-rose-400',
        borderClass: 'border-rose-500/40',
        bgClass: 'bg-rose-500/10',
      };
    case 'high':
      return {
        label: 'High Advisory',
        badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        textClass: 'text-amber-400',
        borderClass: 'border-amber-500/40',
        bgClass: 'bg-amber-500/10',
      };
    case 'moderate':
      return {
        label: 'Watch / Moderate',
        badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        textClass: 'text-cyan-400',
        borderClass: 'border-cyan-500/40',
        bgClass: 'bg-cyan-500/10',
      };
    case 'low':
      return {
        label: 'Low Impact',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        textClass: 'text-emerald-400',
        borderClass: 'border-emerald-500/40',
        bgClass: 'bg-emerald-500/10',
      };
    case 'normal':
    default:
      return {
        label: 'Nominal Conditions',
        badgeClass: 'bg-slate-700/30 text-slate-300 border-slate-700/50',
        textClass: 'text-slate-300',
        borderClass: 'border-slate-700/50',
        bgClass: 'bg-slate-800/40',
      };
  }
}
