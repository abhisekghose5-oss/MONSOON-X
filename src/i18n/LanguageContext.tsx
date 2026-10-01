import React, { useState, useEffect, useMemo, type ReactNode } from 'react';
import type { SupportedLanguage, FarmerTranslations } from './types';
import { enTranslations } from './locales/en';
import { orTranslations } from './locales/or';
import { hiTranslations } from './locales/hi';
import { SUPPORTED_LANGUAGES } from './constants';
import { LanguageContext, type LanguageContextType } from './context';

const TRANSLATION_MAP: Record<SupportedLanguage, FarmerTranslations> = {
  en: enTranslations,
  or: orTranslations,
  hi: hiTranslations,
};

const STORAGE_KEY = 'kmi_farmer_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'or' || saved === 'hi') {
        return saved;
      }
    } catch {
      // LocalStorage access might fail in restricted environments
    }
    // Default to Odia for Koraput, Odisha pilot
    return 'or';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage error
    }
  };

  useEffect(() => {
    // Set document lang attribute for accessibility & screen readers
    document.documentElement.lang = language === 'or' ? 'or' : language === 'hi' ? 'hi' : 'en';
  }, [language]);

  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t: TRANSLATION_MAP[language] || enTranslations,
    availableLanguages: SUPPORTED_LANGUAGES,
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
