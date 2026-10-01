import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useBlockSelection } from '../hooks/useBlockSelection';
import { FarmerLanguageSelector } from '../components/farmer/FarmerLanguageSelector';
import { FarmerLocationCard } from '../components/farmer/FarmerLocationCard';
import { FarmerCropSelector, type FarmerCropKey } from '../components/farmer/FarmerCropSelector';
import { FarmerForecastCard } from '../components/farmer/FarmerForecastCard';
import { FarmerActionCard } from '../components/farmer/FarmerActionCard';
import { FarmerAudioHelper } from '../components/farmer/FarmerAudioHelper';
import { FarmerHelplineCard } from '../components/farmer/FarmerHelplineCard';
import { Sprout, LayoutDashboard, ArrowLeft, Shield } from 'lucide-react';

export function FarmerPage() {
  const { t } = useI18n();
  const { selectedBlockId } = useBlockSelection();
  const [selectedCrop, setSelectedCrop] = useState<FarmerCropKey>('paddy');

  // Active crop advisory from type-safe i18n dictionary
  const currentAdvisory = t.cropAdvisories[selectedCrop] || t.cropAdvisories.paddy;
  const currentCropInfo = t.sections.myCrop.crops[selectedCrop] || {
    name: selectedCrop,
    localName: selectedCrop,
    category: '',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-16 px-1">
      {/* 1. TOP HEADER & OFFICER MODE SWITCH */}
      <div className="bg-[#0B1F33] text-white rounded-xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#247A4A] flex items-center justify-center text-white shrink-0 shadow-sm border border-[#3CA76B]">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                  {t.meta.appTitle}
                </h1>
                <span className="text-[10px] font-mono font-bold bg-[#247A4A] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t.meta.farmerModeTag}
                </span>
              </div>
              <p className="text-[11px] text-[#A4BCDA]">
                {t.meta.subTitle}
              </p>
            </div>
          </div>

          <Link
            to="/officer"
            className="min-h-[44px] px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#D2DEEB] text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 touch-manipulation active:scale-95 shrink-0"
            title="Switch to Agriculture Officer Operations Command"
          >
            <LayoutDashboard className="w-4 h-4 text-[#1479C9]" />
            <span className="hidden sm:inline">{t.meta.switchToOfficerMode}</span>
            <span className="sm:hidden">Officer Mode</span>
          </Link>
        </div>

        {/* SIH Tagline */}
        <div className="pt-2 border-t border-[#1E354D] flex items-center justify-between text-[11px] text-[#A4BCDA]">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#1479C9]" />
            <span>{t.meta.sihProblem}</span>
          </span>
          <span className="font-mono text-[#439EE0]">
            {t.common.districtName}, {t.common.stateName}
          </span>
        </div>
      </div>

      {/* 2. LANGUAGE SELECTOR (Top Touch Target) */}
      <FarmerLanguageSelector />

      {/* 3. MY LOCATION */}
      <FarmerLocationCard />

      {/* 4. MY CROP */}
      <FarmerCropSelector
        selectedCrop={selectedCrop}
        onSelectCrop={setSelectedCrop}
      />

      {/* 5. AUDIO HELPER (READ ALOUD IN SELECTED REGIONAL LANGUAGE) */}
      <FarmerAudioHelper
        advisory={currentAdvisory}
        cropName={currentCropInfo.name}
      />

      {/* 6. WHAT IS COMING? (Plain language, zero meteorological jargon) */}
      <FarmerForecastCard advisory={currentAdvisory} />

      {/* 7. WHAT SHOULD I DO? & WHEN SHOULD I ACT? */}
      <FarmerActionCard
        advisory={currentAdvisory}
        cropName={currentCropInfo.name}
      />

      {/* 8. AGROMET & KISAN HELPLINE */}
      <FarmerHelplineCard />

      {/* 9. INSTITUTIONAL SIMULATION NOTICE & SWITCH */}
      <div className="p-3 rounded-lg bg-[#F5F7FA] border border-[#CBD5E1] text-center space-y-2">
        <p className="text-[11px] text-[#6E7F94] font-mono">
          {t.common.simulationNotice} · Block: {selectedBlockId.toUpperCase()}
        </p>
        <Link
          to="/officer"
          className="inline-flex items-center gap-1.5 text-xs text-[#1479C9] hover:underline font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.meta.switchToOfficerMode}</span>
        </Link>
      </div>
    </div>
  );
}

export default FarmerPage;
