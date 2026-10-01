import { useContext } from 'react';
import { LanguageContext, type LanguageContextType } from './context';

export function useI18n(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
}
