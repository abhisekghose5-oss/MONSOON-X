import React from 'react';
import {
  SectionHeader,
  AlertBanner,
  MetricCard,
  RiskBadge,
  DataSourceBadge,
} from '../components/design-system';
import { useBlockSelection } from '../hooks/useBlockSelection';
import { CropActionMatrix } from '../components/advisories/CropActionMatrix';
import { GkmsBulletinCard } from '../components/advisories/GkmsBulletinCard';
import { BroadcastDispatchPreview } from '../components/advisories/BroadcastDispatchPreview';
import {
  ShieldAlert,
  Sprout,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export function AdvisoriesPage() {
  const { selectedBlock, isDistrictWide } = useBlockSelection();

  const blockDisplayName = isDistrictWide ? 'Koraput District (All Blocks)' : `${selectedBlock?.name} Block`;

  return (
    <div className="space-y-6">
      {/* 1. SECTION HEADER */}
      <SectionHeader
        title="Actionable Agro-Meteorological Advisories (GKMS)"
        subtitle={`Prescriptive farm-level recommendations bridging atmospheric predictions and agricultural practices for ${blockDisplayName}.`}
        accentColor="agri"
        badge={<RiskBadge level="alert" size="sm" />}
        action={
          <div className="flex items-center gap-2">
            <DataSourceBadge source="KVK Koraput" type="survey" size="sm" />
            <DataSourceBadge source="OUAT DAMU" type="model" size="sm" />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#FDF7EB] text-[#8C5D00] border border-[#F4D79C] font-semibold">
              DEMO MODEL OUTPUT
            </span>
          </div>
        }
      />

      {/* 2. EXECUTIVE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Critical Field Warnings"
          value="2 Urgent"
          status="risk"
          icon={ShieldAlert}
          baselineText="Paddy drainage & Maize waterlogging"
        />
        <MetricCard
          title="Active Agro Bulletins"
          value="No. 78/2026"
          status="warning"
          icon={AlertTriangle}
          baselineText="Bi-weekly cycle: 01 Oct - 07 Oct"
        />
        <MetricCard
          title="Monitored Kharif Crops"
          value="7 Priority"
          status="agriculture"
          icon={Sprout}
          baselineText="Mandia, Paddy, Maize, Groundnut, Pulses"
        />
        <MetricCard
          title="Broadcast Farmers"
          value="42,850"
          status="normal"
          icon={Radio}
          baselineText="mKisan SMS & Community Radio 90.4 MHz"
        />
      </div>

      {/* 3. HIGH-VISIBILITY ADVISORY ALERTS */}
      <div className="space-y-3">
        <AlertBanner
          level="critical"
          title="Urgent Field Drainage Warning: Upland Maize & Valley Bottom Paddy"
          targetBlock={selectedBlock ? `${selectedBlock.name} Block` : 'All 14 Koraput Blocks'}
          message="Convective showers (35-70 mm) forecast for 01-03 October. Open drainage ditches immediately to prevent root asphyxiation in maize and keep standing water below 5 cm in paddy."
        />

        <AlertBanner
          level="advisory"
          title="Agromet Directive: Withhold Urea Top-Dressing and Chemical Sprays"
          targetBlock={selectedBlock ? `${selectedBlock.name} Block` : 'All Koraput Blocks'}
          message="Postpone all nitrogen fertilizer applications and foliar biopesticide sprays until Sunday (04 October) to prevent nutrient leaching and surface runoff losses."
        />
      </div>

      {/* 4. BLOCK-WISE MULTI-CROP ACTION MATRIX */}
      <CropActionMatrix blockName={blockDisplayName} />

      {/* 5. OFFICIAL PRINTABLE GKMS BULLETIN GENERATOR */}
      <GkmsBulletinCard blockName={blockDisplayName} />

      {/* 6. FARMER BROADCAST DISPATCH & EXTENSION CHANNELS */}
      <BroadcastDispatchPreview blockName={blockDisplayName} />
    </div>
  );
}

export default AdvisoriesPage;
