import React, { useState } from 'react';
import {
  SectionHeader,
  DataSourceBadge,
  AlertBanner,
  LoadingSkeleton,
} from '../components/design-system';
import {
  CropSelector,
  CropDetailCard,
  CropRiskMatrixTable,
  StructuredAdvisoryCard,
} from '../components/agriculture';
import { useAgricultureData } from '../hooks/useAgricultureData';
import { useBlockSelection } from '../hooks/useBlockSelection';
import { RefreshCw } from 'lucide-react';

export function AgriculturePage() {
  const { selectedBlock, isDistrictWide } = useBlockSelection();
  const { agroData, isLoading, isError, error, refetch, isFetching } =
    useAgricultureData();

  const [selectedCropId, setSelectedCropId] = useState<string>('paddy');

  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <AlertBanner
          level="critical"
          title="Failed to Load Agricultural Decision Telemetry"
          message={error instanceof Error ? error.message : 'Unknown agromet network failure'}
          action={
            <button
              onClick={() => refetch()}
              className="text-xs font-mono font-semibold bg-[#C43D3D] text-white px-3 py-1 rounded-sm"
            >
              Retry Agromet Ingestion
            </button>
          }
        />
      </div>
    );
  }

  // Active crop detail & advisory
  const activeCropDef = agroData?.availableCrops.find((c) => c.id === selectedCropId) ||
    agroData?.availableCrops[0];

  const activeCropDetail = activeCropDef ? agroData?.cropDetails[activeCropDef.id] : null;
  const activeAdvisory = activeCropDef ? agroData?.advisories[activeCropDef.id] : null;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <SectionHeader
        title="Agricultural Decision Centre"
        subtitle={`Translating downscaled precipitation forecasts, root-zone soil moisture balances, and microclimatic risks into actionable crop directives for ${
          isDistrictWide
            ? 'all 14 Koraput administrative blocks'
            : `${selectedBlock?.name} Block (${selectedBlock?.elevationMeters}m MSL)`
        }.`}
        accentColor="agri"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <DataSourceBadge source="OUAT / KVK Koraput" type="survey" size="sm" />
            <DataSourceBadge source="ICAR-CRIDA Agromet DSS" type="model" size="sm" />
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1.5 rounded-sm border border-[#1E354D] bg-[#0A192F] hover:bg-[#132844] text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:outline-hidden"
              title="Refresh Agricultural Telemetry"
              aria-label="Refresh Agricultural Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      {/* 2. Agro Bulletin Alert Banner */}
      {agroData?.blockAgroContext && (
        <AlertBanner
          level="advisory"
          title={`Agromet Advisory Notice · ${agroData.blockAgroContext.blockName}`}
          message={agroData.blockAgroContext.generalBulletinNotice}
        />
      )}

      {/* 3. DYNAMIC CROP SELECTOR (Backend Configured) */}
      {isLoading || !agroData ? (
        <LoadingSkeleton variant="card" className="h-28" />
      ) : (
        <CropSelector
          crops={agroData.availableCrops}
          selectedCropId={selectedCropId}
          onSelectCrop={setSelectedCropId}
        />
      )}

      {/* 4. INDIVIDUAL CROP DETAIL CARD (8 Required Attributes) */}
      {isLoading || !activeCropDef || !activeCropDetail ? (
        <LoadingSkeleton variant="card" className="h-72" />
      ) : (
        <CropDetailCard
          cropDef={activeCropDef}
          detail={activeCropDetail}
          targetBlock={agroData?.blockAgroContext.blockName || 'Koraput'}
        />
      )}

      {/* 5. STRUCTURED ADVISORY CARD (WHAT IS HAPPENING?, WHY?, WHAT SHOULD I DO?, WHEN?, CONFIDENCE?) */}
      {isLoading || !activeAdvisory ? (
        <LoadingSkeleton variant="card" className="h-80" />
      ) : (
        <StructuredAdvisoryCard advisory={activeAdvisory} />
      )}

      {/* 6. CROP RISK MATRIX (Comparative Table) */}
      {isLoading || !agroData ? (
        <LoadingSkeleton variant="card" className="h-64" />
      ) : (
        <CropRiskMatrixTable
          matrix={agroData.riskMatrix}
          selectedCropId={selectedCropId}
          onSelectCrop={setSelectedCropId}
        />
      )}
    </div>
  );
}
