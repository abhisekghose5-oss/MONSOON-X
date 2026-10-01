import React, { useState } from 'react';
import type { ModelInputVariable } from '../../types/modelPerformance';
import { Globe2, CloudRain, History, Mountain, Layers, Database } from 'lucide-react';

interface ModelOverviewInputsProps {
  inputs: Record<'climate' | 'regional' | 'historical' | 'spatial', ModelInputVariable[]>;
  className?: string;
}

export function ModelOverviewInputs({ inputs, className = '' }: ModelOverviewInputsProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'climate' | 'regional' | 'historical' | 'spatial'>('all');

  const categories: {
    key: 'climate' | 'regional' | 'historical' | 'spatial';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    count: number;
  }[] = [
    { key: 'climate', label: 'Climate Signals', icon: Globe2, accentColor: 'text-[#1479C9]', count: inputs.climate.length },
    { key: 'regional', label: 'Regional Weather', icon: CloudRain, accentColor: 'text-[#D99000]', count: inputs.regional.length },
    { key: 'historical', label: 'Historical Rainfall', icon: History, accentColor: 'text-[#247A4A]', count: inputs.historical.length },
    { key: 'spatial', label: 'Spatial Variables', icon: Mountain, accentColor: 'text-[#8C5D00]', count: inputs.spatial.length },
  ];

  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#EAF0F6] text-[#1479C9]">
            <Layers className="w-4 h-4 text-[#1479C9]" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33] font-mono">
              MODEL OVERVIEW & MULTI-SOURCE INPUT FEATURES
            </h2>
            <span className="text-[11px] text-[#6E7F94] font-mono">
              Coupled feature space assimilated into Bayesian ensemble and downscaled inference
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-xs border border-[#CBD5E1] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all ${
              activeCategory === 'all'
                ? 'bg-[#0B1F33] text-white shadow-xs'
                : 'text-[#4B5B6D] hover:text-[#0B1F33]'
            }`}
          >
            All (14)
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveCategory(c.key)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all whitespace-nowrap ${
                activeCategory === c.key
                  ? 'bg-[#1479C9] text-white shadow-xs'
                  : 'text-[#4B5B6D] hover:text-[#0B1F33]'
              }`}
            >
              {c.label} ({c.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Input Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          if (activeCategory !== 'all' && activeCategory !== cat.key) return null;
          const items = inputs[cat.key];
          const Icon = cat.icon;

          return (
            <div
              key={cat.key}
              className={`rounded-md border border-[#E2E8F0] p-3.5 space-y-3 bg-[#FAFCFE] ${
                activeCategory !== 'all' ? 'md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-white' : ''
              }`}
            >
              {activeCategory === 'all' && (
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0B1F33] uppercase">
                    <Icon className={`w-3.5 h-3.5 ${cat.accentColor}`} />
                    <span>{cat.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6E7F94] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                    {items.length} Features
                  </span>
                </div>
              )}

              <div className={`space-y-2.5 ${activeCategory !== 'all' ? 'col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 space-y-0' : ''}`}>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xs bg-white border border-[#CBD5E1] shadow-2xs space-y-1.5 hover:border-[#1479C9] transition-all"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-xs text-[#0B1F33] leading-snug">
                        {item.name}
                      </h3>
                      <span className="font-mono text-[10px] font-bold text-[#1479C9] bg-[#EAF5FC] px-1.5 py-0.5 rounded shrink-0">
                        {item.importanceWeight}%
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-[#6E7F94] flex items-center justify-between">
                      <span className="truncate max-w-[130px]" title={item.source}>
                        {item.source}
                      </span>
                      <span>{item.resolution}</span>
                    </div>

                    <p className="text-[11px] text-[#4B5B6D] leading-relaxed pt-1 border-t border-[#F0F3F7]">
                      {item.description}
                    </p>

                    <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-[#247A4A]">
                      <Database className="w-3 h-3" />
                      <span>{item.updateFrequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
