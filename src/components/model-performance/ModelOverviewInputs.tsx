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
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-md border border-[#1E354D] shadow-command-panel p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E354D] gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#071324] text-[#38BDF8] border border-[#1E354D]">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              MODEL OVERVIEW & MULTI-SOURCE INPUT FEATURES
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Coupled feature space assimilated into Bayesian ensemble and downscaled inference
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#071324] p-1 rounded-xs border border-[#1E354D] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#0284C7] text-white shadow-xs border border-[#38BDF8]/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All (14)
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveCategory(c.key)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-xs transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === c.key
                  ? 'bg-[#0284C7] text-white shadow-xs border border-[#38BDF8]/50'
                  : 'text-slate-400 hover:text-white'
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
              className={`rounded-md border border-[#1E354D] p-3.5 space-y-3 bg-[#071324]/50 ${
                activeCategory !== 'all' ? 'md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#071324]/30' : ''
              }`}
            >
              {activeCategory === 'all' && (
                <div className="flex items-center justify-between border-b border-[#1E354D] pb-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200 uppercase">
                    <Icon className={`w-3.5 h-3.5 text-[#38BDF8]`} />
                    <span>{cat.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#38BDF8] bg-[#071324] px-1.5 py-0.5 rounded border border-[#1E354D]">
                    {items.length} Features
                  </span>
                </div>
              )}

              <div className={`space-y-2.5 ${activeCategory !== 'all' ? 'col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 space-y-0' : ''}`}>
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xs bg-[#071324] border border-[#1E354D] shadow-xs space-y-1.5 hover:border-[#38BDF8]/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-xs text-white leading-snug">
                        {item.name}
                      </h3>
                      <span className="font-mono text-[10px] font-bold text-[#38BDF8] bg-[#0284C7]/20 px-1.5 py-0.5 rounded shrink-0 border border-[#0284C7]/30">
                        {item.importanceWeight}%
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span className="truncate max-w-[130px]" title={item.source}>
                        {item.source}
                      </span>
                      <span>{item.resolution}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-[#1E354D]/60">
                      {item.description}
                    </p>

                    <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-[#4ADE80]">
                      <Database className="w-3 h-3 text-[#4ADE80]" />
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
export default ModelOverviewInputs;
