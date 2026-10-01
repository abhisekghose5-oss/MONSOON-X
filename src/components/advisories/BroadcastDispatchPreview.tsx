import React, { useState } from 'react';
import { Radio, MessageSquare, Volume2, Play, Pause, CheckCircle2, Send, Users } from 'lucide-react';

interface BroadcastDispatchPreviewProps {
  blockName?: string;
  className?: string;
}

export function BroadcastDispatchPreview({
  blockName = 'Koraput District',
  className = '',
}: BroadcastDispatchPreviewProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'or'>('en');

  const englishSms = `KORAPUT KISAN (${blockName.toUpperCase()}): Heavy rain (35-70mm) likely 01-03 Oct. Clear field drains in Paddy & Maize to prevent waterlogging. Postpone urea top-dressing. - DAMU RRTTS Semiliguda`;
  const odiaSms = `କୋରାପୁଟ କିଷାନ (${blockName}): ଅକ୍ଟୋବର ୦୧-୦୩ ମଧ୍ୟରେ ପ୍ରବଳ ବର୍ଷା ସମ୍ଭାବନା। ଧାନ ଏବଂ ମକା ଜମିରୁ ଅତିରିକ୍ତ ଜଳ ନିଷ୍କାସନ ନାଳି ଖୋଲନ୍ତୁ। ୟୁରିଆ ସାର ପ୍ରୟୋଗ ସ୍ଥଗିତ ରଖନ୍ତୁ। - କେଭିକେ କୋରାପୁଟ`;

  const currentSms = selectedLanguage === 'en' ? englishSms : odiaSms;

  return (
    <div className={`bg-white rounded-md border border-[#E2E8F0] shadow-gov-card overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F5F7FA]/75 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F33] font-mono flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#1479C9]" />
              FARMER BROADCAST DISPATCH & EXTENSION CHANNELS
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#EDF7F1] text-[#154D2F] border border-[#ABD7C0] font-semibold">
              LIVE DISPATCH READY
            </span>
          </div>
          <p className="text-[11px] text-[#4B5B6D] font-mono mt-0.5">
            Automated multi-channel broadcast generator pushing to mKisan SMS gateway, Community Radio (90.4 MHz), and WhatsApp groups.
          </p>
        </div>

        {/* Recipient Count Pill */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-sm bg-white border border-[#CBD5E1] text-[#0B1F33] font-bold flex items-center gap-1.5 shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#1479C9]" />
            42,850 Farmers Registered
          </span>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel 1: mKisan SMS Portal Dispatch Preview */}
        <div className="p-4 rounded-sm border border-[#CBD5E1] bg-[#FCFDFE] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#1479C9]" />
              <span className="font-mono text-xs font-bold uppercase text-[#0B1F33]">
                mKisan Portal SMS Broadcast
              </span>
            </div>
            {/* Language Switch */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedLanguage('en')}
                className={`px-2 py-0.5 rounded-xs font-bold transition-all ${
                  selectedLanguage === 'en'
                    ? 'bg-[#0B1F33] text-white'
                    : 'bg-white text-[#4B5B6D] border border-[#CBD5E1]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('or')}
                className={`px-2 py-0.5 rounded-xs font-bold transition-all ${
                  selectedLanguage === 'or'
                    ? 'bg-[#0B1F33] text-white'
                    : 'bg-white text-[#4B5B6D] border border-[#CBD5E1]'
                }`}
              >
                ଓଡ଼ିଆ (Odia)
              </button>
            </div>
          </div>

          {/* SMS Mock Handset Bubble */}
          <div className="p-3.5 rounded-sm bg-white border border-[#E2E8F0] shadow-inner space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#6E7F94]">
              <span>SENDER: GOV-MKISAN</span>
              <span>{currentSms.length} / 160 Chars (1 SMS)</span>
            </div>
            <p className="text-xs text-[#0B1F33] leading-relaxed font-sans font-medium">
              {currentSms}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#6E7F94]">
            <span className="flex items-center gap-1 text-[#247A4A] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Automated Push Scheduled (16:30 IST)
            </span>
            <button
              type="button"
              className="px-2.5 py-1 rounded-xs bg-[#1479C9] text-white font-bold flex items-center gap-1 hover:bg-[#0E63A8] transition-colors"
            >
              <Send className="w-3 h-3" />
              TEST DISPATCH
            </button>
          </div>
        </div>

        {/* Panel 2: Community Radio & IVRS Audio Dispatch */}
        <div className="p-4 rounded-sm border border-[#CBD5E1] bg-[#FCFDFE] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#247A4A]" />
              <span className="font-mono text-xs font-bold uppercase text-[#0B1F33]">
                Community Radio & IVRS Audio Dispatch
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-xs bg-[#EDF6FC] text-[#0C4E83] border border-[#ACD5F2] font-semibold">
              AIR Jeypore & 90.4 MHz
            </span>
          </div>

          {/* Audio Player Simulator */}
          <div className="p-3 rounded-sm bg-[#0B1F33] text-white space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-8 h-8 rounded-full bg-[#1479C9] hover:bg-[#198fe8] flex items-center justify-center text-white transition-all shadow-xs"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <span className="font-bold text-white block text-[11px]">
                    GKMS_Agromet_Audio_Koraput_01Oct.mp3
                  </span>
                  <span className="text-[10px] text-[#A4BCDA]">
                    Voice: Odia Regional Dialect · Duration: 01:24
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-[#79BF9B] font-bold">
                {isPlayingAudio ? 'BROADCASTING...' : 'READY'}
              </span>
            </div>

            {/* Audio Waveform visualization bar */}
            <div className="w-full bg-[#1E354D] h-2 rounded-xs overflow-hidden">
              <div
                className={`bg-[#247A4A] h-full transition-all duration-300 ${
                  isPlayingAudio ? 'w-2/3 animate-pulse' : 'w-0'
                }`}
              />
            </div>
          </div>

          {/* Broadcast Schedule Details */}
          <div className="text-[11px] font-mono text-[#4B5B6D] space-y-1">
            <div className="flex justify-between">
              <span>Primary Station:</span>
              <strong className="text-[#0B1F33]">All India Radio (AIR) Jeypore · 101.4 MHz</strong>
            </div>
            <div className="flex justify-between">
              <span>Local FM:</span>
              <strong className="text-[#0B1F33]">Community Radio Koraput · 90.4 MHz</strong>
            </div>
            <div className="flex justify-between">
              <span>Kisan Vani Slot:</span>
              <strong className="text-[#247A4A]">Daily 18:45 – 19:00 IST</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
