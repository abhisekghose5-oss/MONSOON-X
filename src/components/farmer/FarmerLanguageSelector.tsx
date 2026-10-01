import React from 'react';
import { useI18n, type SupportedLanguage } from '../../i18n';
import { Languages, Check } from 'lucide-react';

interface FarmerLanguageSelectorProps {
  className?: string;
}

export function FarmerLanguageSelector({ className = '' }: FarmerLanguageSelectorProps) {
  const { language, setLanguage, availableLanguages, t } = useI18n();

  return (
    <div className={`bg-white rounded-xl border-2 border-[#CBD5E1] p-3 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#4B5B6D] uppercase tracking-wider">
          <Languages className="w-4 h-4 text-[#1479C9]" />
          <span>{t.navigation.changeLanguage}</span>
        </span>
        <span className="text-[11px] font-mono text-[#6E7F94]">
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
              className={`min-h-[50px] py-2 px-2 rounded-lg text-center font-bold transition-all flex flex-col items-center justify-center relative touch-manipulation select-none active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1479C9] focus-visible:outline-hidden ${
                isActive
                  ? 'bg-[#1479C9] text-white shadow-md border-2 border-[#0E63A8] ring-2 ring-[#1479C9]/20'
                  : 'bg-[#F5F7FA] text-[#0B1F33] hover:bg-[#EAF0F6] border-2 border-[#E2E8F0]'
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
                  isActive ? 'text-white/80' : 'text-[#6E7F94]'
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
