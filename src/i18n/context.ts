import { createContext } from 'react';
import type { SupportedLanguage, LanguageInfo, FarmerTranslations } from './types';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: FarmerTranslations;
  availableLanguages: LanguageInfo[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
