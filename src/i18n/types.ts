export type SupportedLanguage = 'en' | 'or' | 'hi';

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export interface CropInfoTranslation {
  name: string;
  localName: string;
  category: string;
}

export interface CropAdvisoryTranslation {
  rainfallOutlook: string;
  rainfallOutlookLevel: 'low' | 'moderate' | 'high';
  drySpellRisk: string;
  drySpellRiskLevel: 'low' | 'moderate' | 'high';
  heavyRainRisk: string;
  heavyRainRiskLevel: 'low' | 'moderate' | 'high';
  actionHeadline: string;
  steps: string[];
  avoidAction: string;
  whenToAct: string;
  urgencyText: string;
  urgencyLevel: 'immediate' | 'soon' | 'monitor';
}

export interface FarmerTranslations {
  meta: {
    appTitle: string;
    subTitle: string;
    farmerModeTag: string;
    switchToOfficerMode: string;
    sihProblem: string;
  };
  navigation: {
    language: string;
    changeLanguage: string;
    english: string;
    odia: string;
    hindi: string;
  };
  sections: {
    myLocation: {
      title: string;
      subtitle: string;
      allKoraput: string;
      selectBlock: string;
      blockNames: Record<string, string>;
      selectedNotice: string;
    };
    myCrop: {
      title: string;
      subtitle: string;
      crops: Record<string, CropInfoTranslation>;
    };
    whatIsComing: {
      title: string;
      subtitle: string;
      rainfallOutlookLabel: string;
      drySpellRiskLabel: string;
      heavyRainRiskLabel: string;
      summaryNote: string;
      riskLevels: {
        low: string;
        moderate: string;
        high: string;
      };
    };
    whatShouldIDo: {
      title: string;
      subtitle: string;
      doThisLabel: string;
      avoidThisLabel: string;
    };
    whenShouldIAct: {
      title: string;
      subtitle: string;
      targetWindowLabel: string;
      urgencyLabels: {
        immediate: string;
        soon: string;
        monitor: string;
      };
    };
  };
  cropAdvisories: Record<string, CropAdvisoryTranslation>;
  audio: {
    listenButton: string;
    playingAudio: string;
    stopAudio: string;
    speechNotSupported: string;
  };
  helpline: {
    title: string;
    tollFreeNumber: string;
    callNow: string;
    kvkKoraput: string;
    kvkPhone: string;
  };
  common: {
    districtName: string;
    stateName: string;
    updatedToday: string;
    simulationNotice: string;
    tapToSelect: string;
  };
}
