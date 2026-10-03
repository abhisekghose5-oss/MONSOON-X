import React, { useState, useMemo } from 'react';
import type { PerformanceTask } from '../types/modelPerformance';
import { ModelPerformanceService } from '../services/modelPerformanceService';
import { SectionHeader, DataSourceBadge } from '../components/design-system';
import { ModelOverviewInputs } from '../components/model-performance/ModelOverviewInputs';
import { TaskSelectorBar } from '../components/model-performance/TaskSelectorBar';
import { PerformanceMetricsCards } from '../components/model-performance/PerformanceMetricsCards';
import { ReliabilityDiagram } from '../components/model-performance/ReliabilityDiagram';
import { ActualVsPredictedChart } from '../components/model-performance/ActualVsPredictedChart';
import { HistoricalBacktestTable } from '../components/model-performance/HistoricalBacktestTable';
import { LeadTimeDecayChart } from '../components/model-performance/LeadTimeDecayChart';
import { ShieldCheck, Info } from 'lucide-react';

export function ModelPerformancePage() {
  const [selectedTask, setSelectedTask] = useState<PerformanceTask>('onset');

  // Load datasets from ModelPerformanceService
  const inputs = useMemo(() => ModelPerformanceService.getInputVariables(), []);
  const taskMetrics = useMemo(() => ModelPerformanceService.getTaskMetrics(selectedTask), [selectedTask]);
  const reliabilityData = useMemo(() => ModelPerformanceService.getReliabilityData(selectedTask), [selectedTask]);
  const backtestData = useMemo(() => ModelPerformanceService.getHistoricalBacktest(), []);
  const actualVsPredictedData = useMemo(() => ModelPerformanceService.getActualVsPredicted(), []);
  const leadTimeDecayData = useMemo(() => ModelPerformanceService.getLeadTimeDecay(), []);

  return (
    <div className="space-y-6">
      {/* 1. SECTION HEADER */}
      <SectionHeader
        title="Forecast Model Performance & Transparency"
        subtitle="Empirical verification, probabilistic reliability calibration, and retrospective backtesting across Koraput District in compliance with WMO-No. 485."
        accentColor="navy"
        badge={
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-emerald-950/60 text-[#4ADE80] border border-emerald-500/40 uppercase flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
            WMO / IMD VALIDATED
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <DataSourceBadge source="IMD Pune 1970-2025" type="model" size="sm" />
            <DataSourceBadge source="WMO-No. 485 Protocol" type="radar" size="sm" />
          </div>
        }
      />

      {/* Institutional Transparency Banner */}
      <div className="p-3.5 rounded-md bg-[#0A192F]/85 backdrop-blur-md border border-[#1E354D] shadow-command-panel flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-xs bg-[#071324] text-[#38BDF8] border border-[#1E354D] shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">Scientific Integrity Statement:</strong> All evaluation statistics are derived from 55-year retrospective leave-one-season-out cross-validation (1970–2024). Operational predictions lacking completed ground validation strictly display <em className="text-[#38BDF8]">"Awaiting model evaluation"</em>.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#38BDF8] bg-[#071324] px-2.5 py-1 rounded border border-[#1E354D] shrink-0 font-semibold">
          SIH26086 Model Hub
        </span>
      </div>

      {/* 2. SECTION 1: MODEL OVERVIEW (Input Variables: Climate, Regional, Historical, Spatial) */}
      <ModelOverviewInputs inputs={inputs} />

      {/* 3. SECTION 2: MODEL PERFORMANCE (Task Switcher: Onset, Break, Heavy Rain) */}
      <div className="space-y-4">
        <TaskSelectorBar
          selectedTask={selectedTask}
          onSelectTask={setSelectedTask}
          title={taskMetrics.title}
          description={taskMetrics.description}
          verifiedBy={taskMetrics.verifiedBy}
        />

        {/* 6 Core Metrics (ROC-AUC, Precision, Recall, F1, Brier Score, Calibration) */}
        <PerformanceMetricsCards metrics={taskMetrics} />
      </div>

      {/* 4. SECTION 3: RELIABILITY DIAGRAMS & CALIBRATION CURVES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReliabilityDiagram data={reliabilityData} task={selectedTask} />
        <LeadTimeDecayChart data={leadTimeDecayData} />
      </div>

      {/* 5. SECTION 4: ACTUAL VS PREDICTED ONSET TIMELINE */}
      <ActualVsPredictedChart data={actualVsPredictedData} />

      {/* 6. SECTION 5: HISTORICAL BACKTESTING REGISTER */}
      <HistoricalBacktestTable data={backtestData} />
    </div>
  );
}

export default ModelPerformancePage;
