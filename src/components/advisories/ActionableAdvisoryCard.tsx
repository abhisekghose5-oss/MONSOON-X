import React from 'react';
import { AlertOctagon, AlertTriangle, Info, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export interface ActionableAdvisoryItem {
  id: string;
  riskTitle: string;
  severity: 'CRITICAL' | 'HIGH' | 'ADVISORY';
  affectedCrops: string[];
  whyItMatters: string;
  whatToDo: string[];
  whenToAct: string;
  targetBlocks: string;
}

interface ActionableAdvisoryCardProps {
  advisories?: ActionableAdvisoryItem[];
  className?: string;
}

const DEFAULT_ADVISORIES: ActionableAdvisoryItem[] = [
  {
    id: 'adv-01',
    riskTitle: 'EXCESS CONVECTIVE RAINFALL & WATERLOGGING RISK',
    severity: 'CRITICAL',
    affectedCrops: ['Upland Maize', 'Valley Bottom Paddy', 'Highland Pulses'],
    whyItMatters:
      'A Bay of Bengal low-pressure remnant will bring 45–75 mm localized rain within 48 hours. Maize roots die within 18 hours of saturation, and pulses face immediate Phytophthora stem blight in stagnant water.',
    whatToDo: [
      'Open field drainage furrows (25 cm depth) between paired rows immediately',
      'Keep standing water capped below 5 cm in valley bottom paddy fields',
      'Withhold all nitrogen (urea) top-dressing until 04 October to prevent leaching losses',
    ],
    whenToAct: 'Act within the next 24 hours (before Friday night 20:00 IST)',
    targetBlocks: 'Koraput, Jeypore, Pottangi, Semiliguda, Nandapur',
  },
  {
    id: 'adv-02',
    riskTitle: 'DRY SPELL & EVAPORATIVE DEFICIT RISK',
    severity: 'HIGH',
    affectedCrops: ['Late-Sown Finger Millet (Mandia)', 'Suan', 'Groundnut'],
    whyItMatters:
      'Weakening low-level jet flow post-05 October will reduce rainfall to < 2.5 mm/day for 6 consecutive days. Sandy loam soils on hill slopes will rapidly lose root-zone moisture.',
    whatToDo: [
      'Delay late sowing until the next revival surge',
      'Apply light organic straw mulch across nursery beds to retain soil moisture',
      'Monitor root-zone tensiometer / soil moisture daily and plan supplemental life-saving irrigation',
    ],
    whenToAct: 'Prepare moisture conservation measures from 03 October onwards',
    targetBlocks: 'Boipariguda, Kundra, Kotpad, Borigumma',
  },
];

export function ActionableAdvisoryCard({
  advisories = DEFAULT_ADVISORIES,
  className = '',
}: ActionableAdvisoryCardProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
            STRUCTURED OPERATIONAL FIELD DIRECTIVES
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#6E7F94]">
          Severity Hierarchy · ICAR-CRIDA Validated
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {advisories.map((adv) => {
          const isCritical = adv.severity === 'CRITICAL';
          const isHigh = adv.severity === 'HIGH';

          const borderClass = isCritical
            ? 'border-l-4 border-l-[#DC2626] border-[#CBD5E1]'
            : isHigh
              ? 'border-l-4 border-l-[#D97706] border-[#CBD5E1]'
              : 'border-l-4 border-l-[#15803D] border-[#CBD5E1]';

          const badgeBg = isCritical
            ? 'bg-[#FCEDEC] text-[#802626] border-[#EEA9A7]'
            : isHigh
              ? 'bg-[#FDF7EB] text-[#8C5D00] border-[#F4D79C]'
              : 'bg-[#EDF7F1] text-[#154D2F] border-[#ABD7C0]';

          return (
            <div
              key={adv.id}
              className={`rounded-md bg-white border shadow-gov-card p-4 space-y-3.5 ${borderClass}`}
            >
              {/* 1. RISK HEADER */}
              <div className="flex items-start justify-between gap-3 border-b border-[#F0F3F7] pb-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${badgeBg}`}>
                      {adv.severity} RISK
                    </span>
                    <span className="text-[10px] font-mono text-[#6E7F94]">
                      Blocks: {adv.targetBlocks}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0B1F33] font-sans">
                    {adv.riskTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-[#6E7F94] font-semibold">Crops:</span>
                    {adv.affectedCrops.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-1.5 py-0.2 bg-[#F1F5F9] text-[#334155] rounded-xs border border-[#CBD5E1]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. WHY IT MATTERS */}
              <div className="p-2.5 rounded-sm bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-[#475569] flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#1479C9]" />
                  WHY IT MATTERS:
                </span>
                <p className="text-xs text-[#334155] leading-relaxed pl-4">
                  {adv.whyItMatters}
                </p>
              </div>

              {/* 3. WHAT TO DO */}
              <div className="p-2.5 rounded-sm bg-[#EDF7F1] border border-[#ABD7C0] space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-[#154D2F] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  WHAT TO DO (ACTIONABLE DIRECTIVE):
                </span>
                <ul className="space-y-1.5 pl-4 text-xs text-[#0F3922]">
                  {adv.whatToDo.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <ArrowRight className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                      <span className="font-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. WHEN TO ACT */}
              <div className="p-2.5 rounded-sm bg-[#FDF7EB] border border-[#F4D79C] flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#8C5D00] font-bold">
                  <Clock className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>WHEN TO ACT:</span>
                  <span className="font-sans font-medium text-[#78350F]">{adv.whenToAct}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
