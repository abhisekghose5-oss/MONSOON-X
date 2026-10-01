import React, { useState, useMemo } from 'react';
import type { OfficerHorizon, BlockRiskEntry } from '../types/officer';
import { OfficerService } from '../services/officerService';
import { OfficerToolbar } from '../components/officer/OfficerToolbar';
import { DistrictOverviewHeader } from '../components/officer/DistrictOverviewHeader';
import { BlockRiskMatrixTable } from '../components/officer/BlockRiskMatrixTable';
import { TopHighRiskBlocks } from '../components/officer/TopHighRiskBlocks';
import { CropWiseRiskPanel } from '../components/officer/CropWiseRiskPanel';
import { FalseOnsetAlertsPanel } from '../components/officer/FalseOnsetAlertsPanel';
import { HistoricalAndConfidencePanel } from '../components/officer/HistoricalAndConfidencePanel';
import { AdvisoryDistributionPanel } from '../components/officer/AdvisoryDistributionPanel';
import { BlockDetailModal } from '../components/officer/BlockDetailModal';
import { PanchayatViewModal } from '../components/officer/PanchayatViewModal';
import { GenerateAdvisoryModal } from '../components/officer/GenerateAdvisoryModal';

export function OfficerPage() {
  const [horizon, setHorizon] = useState<OfficerHorizon>('14d');
  const [selectedBlockForDetail, setSelectedBlockForDetail] = useState<BlockRiskEntry | null>(null);
  const [selectedBlockForPanchayat, setSelectedBlockForPanchayat] = useState<BlockRiskEntry | null>(null);
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);

  // Load operational datasets according to active horizon
  const overview = useMemo(() => OfficerService.getDistrictOverview(horizon), [horizon]);
  const blockMatrix = useMemo(() => OfficerService.getBlockRiskMatrix(horizon), [horizon]);
  const crops = useMemo(() => OfficerService.getCropRiskSummaries(horizon), [horizon]);
  const historical = useMemo(() => OfficerService.getHistoricalComparison(), []);
  const confidence = useMemo(() => OfficerService.getForecastConfidence(horizon), [horizon]);
  const distribution = useMemo(() => OfficerService.getAdvisoryDistribution(), []);

  const handleExportCsv = () => {
    OfficerService.exportBlockRiskCsv(blockMatrix);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP OPERATIONAL TOOLBAR */}
      <OfficerToolbar
        horizon={horizon}
        onSelectHorizon={setHorizon}
        onOpenAdvisoryModal={() => setIsAdvisoryModalOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* 2. DISTRICT EXECUTIVE SYNTHESIS */}
      <DistrictOverviewHeader overview={overview} />

      {/* 3. PRIORITY HIGH-RISK BLOCKS (DAO DIRECTIVE WATCHLIST) */}
      <TopHighRiskBlocks
        blocks={blockMatrix}
        onSelectBlock={(b) => setSelectedBlockForDetail(b)}
      />

      {/* 4. BLOCK × RISK MATRIX CROSS-TABULATION */}
      <BlockRiskMatrixTable
        blocks={blockMatrix}
        onViewBlock={(b) => setSelectedBlockForDetail(b)}
        onViewPanchayat={(b) => setSelectedBlockForPanchayat(b)}
      />

      {/* 5. CROP-WISE RISK BREAKDOWN */}
      <CropWiseRiskPanel crops={crops} />

      {/* 6. FALSE-ONSET ACTIVE ALERT REGISTRY */}
      <FalseOnsetAlertsPanel
        blocks={blockMatrix}
        onInspectBlock={(b) => setSelectedBlockForDetail(b)}
      />

      {/* 7. HISTORICAL BASELINE & FORECAST CONFIDENCE METRICS */}
      <HistoricalAndConfidencePanel
        historical={historical}
        confidence={confidence}
      />

      {/* 8. ADVISORY DISTRIBUTION & TELEMETRY STATUS */}
      <AdvisoryDistributionPanel
        stats={distribution}
        onGenerateAdvisory={() => setIsAdvisoryModalOpen(true)}
      />

      {/* 9. MODALS */}
      <BlockDetailModal
        block={selectedBlockForDetail}
        onClose={() => setSelectedBlockForDetail(null)}
        onViewPanchayats={(b) => setSelectedBlockForPanchayat(b)}
      />

      <PanchayatViewModal
        block={selectedBlockForPanchayat}
        onClose={() => setSelectedBlockForPanchayat(null)}
      />

      <GenerateAdvisoryModal
        isOpen={isAdvisoryModalOpen}
        onClose={() => setIsAdvisoryModalOpen(false)}
        horizon={horizon}
      />
    </div>
  );
}

export default OfficerPage;
