import React, { useState } from 'react';
import { useI18n, type CropAdvisoryTranslation } from '../../i18n';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface FarmerAudioHelperProps {
  advisory: CropAdvisoryTranslation;
  cropName: string;
  className?: string;
}

export function FarmerAudioHelper({ advisory, cropName, className = '' }: FarmerAudioHelperProps) {
  const { language, t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handleToggleSpeech = () => {
    if (!isSupported) {
      alert(t.audio.speechNotSupported);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare speech text
    const textToSpeak = `${cropName}. ${advisory.actionHeadline}. ${advisory.steps.join('. ')}. ${advisory.whenToAct}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Map language code to BCP 47 language tag
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'or') {
      utterance.lang = 'or-IN'; // If device has Odia voice installed, it uses it; otherwise falls back gracefully
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`rounded-xl p-3.5 border ${
        isPlaying
          ? 'bg-[#0284C7]/20 border-[#38BDF8] text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
          : 'bg-[#0A192F]/90 backdrop-blur-md border-[#1E354D] text-slate-200'
      } flex flex-col sm:flex-row items-center justify-between gap-3 shadow-command-panel ${className}`}
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isPlaying ? 'bg-[#38BDF8] text-slate-950 animate-pulse' : 'bg-[#071324] text-[#38BDF8] border border-[#1E354D]'
          }`}
        >
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold block leading-tight text-white">
              {isPlaying ? t.audio.playingAudio : t.audio.listenButton}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#071324] text-[#38BDF8] font-bold border border-[#1E354D] inline-flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Audio
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {language === 'or' ? 'ସ୍ୱରରେ ସମ୍ପୂର୍ଣ୍ଣ ପରାମର୍ଶ ଶୁଣନ୍ତୁ' : language === 'hi' ? 'आवाज़ में पूरी सलाह सुनें' : 'Listen to advisory read aloud'}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleToggleSpeech}
        className={`min-h-[46px] w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all touch-manipulation active:scale-95 shadow-sm cursor-pointer ${
          isPlaying
            ? 'bg-rose-600 text-white hover:bg-rose-700'
            : 'bg-[#0284C7] text-white hover:bg-[#0369A1] border border-[#38BDF8]/50'
        }`}
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span>{t.audio.stopAudio}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>{t.audio.listenButton}</span>
          </>
        )}
      </button>
    </div>
  );
}
export default FarmerAudioHelper;
