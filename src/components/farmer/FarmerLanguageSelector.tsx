import React from 'react';
import { useI18n, type SupportedLanguage } from '../../i18n';
import { Languages, Check } from 'lucide-react';

interface FarmerLanguageSelectorProps {
  className?: string;
}

export function FarmerLanguageSelector({ className = '' }: FarmerLanguageSelectorProps) {
  const { language, setLanguage, availableLanguages, t } = useI18n();

  return (
    <div className={`bg-[#0A192F]/90 backdrop-blur-md rounded-xl border border-[#1E354D] p-3 shadow-command-panel ${className}`}>
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          <Languages className="w-4 h-4 text-[#38BDF8]" />
          <span>{t.navigation.changeLanguage}</span>
        </span>
        <span className="text-[11px] font-mono text-[#38BDF8] bg-[#071324] px-2 py-0.5 rounded border border-[#1E354D]">
          {language === 'or' ? 'ଓଡ଼ିଆ ସକ୍ରିୟ' : language === 'hi' ? 'हिंदी सक्रिय' : 'English Active'}
        </span>
      </div>

      {/* Large Touch Target Buttons (min-h-[50px] for thumb tapping) */}
      <div className="grid grid-cols-3 gap-2">
        {availableLanguages.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code as SupportedLanguage)}
              className={`min-h-[50px] py-2 px-2 rounded-lg text-center font-bold transition-all flex flex-col items-center justify-center relative touch-manipulation select-none active:scale-95 focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-hidden cursor-pointer ${
                isActive
                  ? 'bg-[#0284C7] text-white shadow-md border-2 border-[#38BDF8] ring-2 ring-[#38BDF8]/30 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                  : 'bg-[#071324] text-slate-300 hover:bg-[#0D2038] hover:text-white border border-[#1E354D]'
              }`}
              aria-pressed={isActive}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm md:text-base leading-tight font-extrabold">
                  {lang.nativeLabel}
                </span>
                {isActive && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
              </div>
              <span
                className={`text-[10px] uppercase font-mono tracking-wider ${
                  isActive ? 'text-white/90' : 'text-slate-400'
                }`}
              >
                {lang.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default FarmerLanguageSelector;
