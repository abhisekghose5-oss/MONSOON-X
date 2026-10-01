import React from 'react';
import type { PerformanceTask } from '../../types/modelPerformance';
import { Compass, AlertCircle, CloudRain, ShieldCheck } from 'lucide-react';

interface TaskSelectorBarProps {
  selectedTask: PerformanceTask;
  onSelectTask: (task: PerformanceTask) => void;
  title: string;
  description: string;
  verifiedBy: string;
  className?: string;
}

export function TaskSelectorBar({
  selectedTask,
  onSelectTask,
  title,
  description,
  verifiedBy,
  className = '',
}: TaskSelectorBarProps) {
  const tasks: { id: PerformanceTask; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'onset', label: '1. Onset Prediction', icon: Compass },
    { id: 'break', label: '2. Break / Dry Spell', icon: AlertCircle },
    { id: 'heavyRain', label: '3. Heavy Rainfall', icon: CloudRain },
  ];

  return (
    <div className={`bg-[#0B1F33] text-white rounded-md p-4 border border-[#1E354D] shadow-md space-y-3 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7599C8] font-bold block">
            SELECT INFERENCE TASK FOR VERIFICATION
          </span>
          <h2 className="text-base sm:text-lg font-bold font-mono uppercase text-white mt-0.5">
            {title}
          </h2>
          <p className="text-xs text-[#A4BCDA] mt-0.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* 3 Task Buttons */}
        <div className="flex items-center gap-1.5 bg-[#071523] p-1.5 rounded-sm border border-[#1E354D] shrink-0 overflow-x-auto">
          {tasks.map((t) => {
            const isActive = selectedTask === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTask(t.id)}
                className={`px-3 py-2 rounded-xs text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1479C9] text-white shadow-xs'
                    : 'text-[#D2DEEB] hover:text-white hover:bg-[#142B44]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-[#1E354D] flex items-center justify-between text-[11px] font-mono text-[#A4BCDA]">
        <span className="flex items-center gap-1 text-[#439EE0]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#247A4A]" />
          <span>Protocol: {verifiedBy}</span>
        </span>
        <span className="text-[#7599C8]">WMO-No. 485 Compliance</span>
      </div>
    </div>
  );
}
