import React, { useState, useMemo } from 'react';
import { DataSourcesService } from '../services/dataSourcesService';
import { SectionHeader, DataSourceBadge } from '../components/design-system';
import { TelemetryHealthSummary } from '../components/data-sources/TelemetryHealthSummary';
import { DataTransparencyGuide } from '../components/data-sources/DataTransparencyGuide';
import { DataSourcesTable } from '../components/data-sources/DataSourcesTable';
import { ShieldCheck } from 'lucide-react';

export function DataSourcesPage() {
  // Load datasets
  const sources = useMemo(() => DataSourcesService.getAllDataSources(), []);
  const [healthStats, setHealthStats] = useState(() => DataSourcesService.getTelemetryHealth());

  const handleRefresh = () => {
    setHealthStats(DataSourcesService.getTelemetryHealth());
  };

  return (
    <div className="space-y-6">
      {/* 1. SECTION HEADER */}
      <SectionHeader
        title="Data Sources, Telemetry & Provenance Register"
        subtitle="Cataloging every observational, satellite, numerical weather prediction, and agro-pedological dataset assimilated into the Koraput decision support pipeline."
        accentColor="navy"
        badge={
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] uppercase flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#247A4A]" />
            22 DATASETS ASSIMILATED
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <DataSourceBadge source="IMD / ISRO / NOAA / ECMWF" type="radar" size="sm" />
          </div>
        }
      />

      {/* 2. TELEMETRY HEALTH & INGESTION STATUS OVERVIEW */}
      <TelemetryHealthSummary stats={healthStats} onRefresh={handleRefresh} />

      {/* 3. EPISTEMIC TRANSPARENCY & DATA TIERS GUIDE */}
      <DataTransparencyGuide />

      {/* 4. MASTER DATA FEED REGISTER & CROSS-CATEGORY FILTER */}
      <DataSourcesTable sources={sources} />
    </div>
  );
}

export default DataSourcesPage;
