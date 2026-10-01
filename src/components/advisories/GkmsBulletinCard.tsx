import React, { useState } from 'react';
import { FileText, Printer, Copy, Check, Download } from 'lucide-react';

interface GkmsBulletinCardProps {
  blockName?: string;
  className?: string;
}

export function GkmsBulletinCard({
  blockName = 'Koraput District',
  className = '',
}: GkmsBulletinCardProps) {
  const [copied, setCopied] = useState(false);
  const [dateStr] = useState(() => {
    return new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  });

  const bulletinText = `
GOVERNMENT OF INDIA / GOVERNMENT OF ODISHA
GRAMIN KRISHI MAUSAM SEWA (GKMS) · DISTRICT AGROMET FIELD UNIT (DAMU)
REGIONAL RESEARCH AND TECHNOLOGY TRANSFER STATION (RRTTS), OUAT, SEMILIGUDA, KORAPUT
In Technical Collaboration with India Meteorological Department (IMD)

BULLETIN NO: GKMS/OUAT/KPT/2026/078 | ISSUE DATE: ${dateStr}
FORECAST HORIZON: BI-WEEKLY (01 OCT – 07 OCT 2026) | COVERAGE: ${blockName.toUpperCase()}

I. WEATHER FORECAST SYNOPTIC SUMMARY (NEXT 5 DAYS):
- Rainfall: Moderate to isolated heavy showers (35-70 mm) likely on 01-03 October due to a low-pressure area over North-West Bay of Bengal off Odisha coast.
- Maximum Temperature: 28.0°C to 30.5°C; Minimum Temperature: 18.5°C to 20.2°C.
- Relative Humidity: Morning 85-92%, Afternoon 62-75%. Wind: South-westerly at 12-18 km/h.

II. CROP-SPECIFIC ACTIONABLE AGROMET ADVISORIES:
1. PADDY (Dhan - Active Tillering / Panicle Initiation):
   - Clear field drainage channels in medium and lowlands to maintain standing water depth below 5 cm.
   - Postpone urea top dressing and biopesticide spraying until 04 October to prevent chemical wash-off.
   - Scout for bacterial leaf blight and stem borer egg masses under humid cloudy weather.

2. FINGER MILLET (Mandia - Upland Vegetative Growth):
   - Maintain contour bunds to intercept gentle surface runoff.
   - Undertake manual weeding and thinning to ensure optimal plant density (25 cm x 10 cm).
   - Apply 0.2% Borax foliar spray during a clear weather break to improve spikelet fertility.

3. MAIZE (Makka - Tasseling & Silking):
   - High waterlogging risk. Construct 20-25 cm deep drainage furrows between paired rows immediately.
   - Undertake earthing-up around plant bases to prevent root lodging from convective wind gusts.
   - Monitor for Fall Armyworm (Spodoptera frugiperda) in the whorl.

4. VEGETABLES (Tomato, Chilli, Brinjal, Cabbage):
   - High susceptibility to damping-off and fruit rot. Ensure 15-20 cm raised beds.
   - Stake tomato and chilli plants to prevent fruit contact with slushy soil.
   - Harvest mature market-ready vegetables before heavy rainfall on 01 October.

III. EXTENSION DIRECTIVE:
All Assistant Agriculture Officers (AAOs) and Village Agricultural Workers (VAWs) are directed to 
communicate drainage advisories to upland and valley farmers through GP WhatsApp groups and mKisan SMS.

Nodal Officer: Dr. P. K. Nayak, Senior Scientist (Agrometeorology), RRTTS Semiliguda
Issuing Authority: Gramin Krishi Mausam Sewa (GKMS) Unit, OUAT Koraput
Validation Status: DEMO MODEL OPERATIONAL SIMULATION (SIH26086)
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(bulletinText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([bulletinText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GKMS_BULLETIN_KORAPUT_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`bg-white rounded-md border border-[#CBD5E1] shadow-gov-card overflow-hidden ${className}`}>
      {/* Institutional Header */}
      <div className="p-4 bg-[#0B1F33] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xs bg-[#247A4A] flex items-center justify-center text-white shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-white">
              GRAMIN KRISHI MAUSAM SEWA (GKMS) BI-WEEKLY BULLETIN
            </h3>
            <span className="text-[10px] sm:text-[11px] text-[#A4BCDA] font-mono block">
              IMD & OUAT Regional Research and Technology Transfer Station (RRTTS), Semiliguda, Koraput
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-xs bg-[#1E354D] hover:bg-[#2A4666] text-white border border-[#3E5C7E] flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#79BF9B]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-xs bg-[#1E354D] hover:bg-[#2A4666] text-white border border-[#3E5C7E] flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>TXT</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded-xs bg-[#247A4A] hover:bg-[#1E663E] text-white border border-[#388E5C] flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT BULLETIN</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Document View */}
      <div className="p-5 font-mono text-xs text-[#0B1F33] bg-[#FCFDFE] space-y-4 border-b border-[#CBD5E1]">
        {/* Masthead */}
        <div className="text-center space-y-1 pb-3 border-b-2 border-[#0B1F33]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E7F94]">
            GOVERNMENT OF INDIA · MINISTRY OF EARTH SCIENCES / GOVT. OF ODISHA
          </div>
          <div className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-[#0B1F33]">
            GRAMIN KRISHI MAUSAM SEWA (GKMS) · DISTRICT AGROMET FIELD UNIT (DAMU)
          </div>
          <div className="text-xs font-semibold text-[#1479C9]">
            RRTTS, OUAT, SEMILIGUDA, KORAPUT - 763002
          </div>
          <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-[#4B5B6D] pt-2">
            <span>BULLETIN NO: GKMS/OUAT/KPT/2026/078</span>
            <span>ISSUE DATE: {dateStr}</span>
            <span>TARGET: {blockName.toUpperCase()}</span>
          </div>
        </div>

        {/* Section 1: Weather Outlook */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold uppercase bg-[#F1F5F9] px-2 py-1 text-[#0B1F33] border-l-3 border-[#1479C9]">
            1. SYNOPTIC WEATHER SUMMARY & 5-DAY DISTRICT OUTLOOK
          </div>
          <p className="text-xs text-[#334155] leading-relaxed pl-2">
            A low-pressure system over the North-West Bay of Bengal off the Odisha coast is expected to bring moderate to heavy showers (35–70 mm) across Koraput between 01 and 03 October. Maximum temperatures will range from 28.0°C to 30.5°C, with morning relative humidity around 85–92%. Strong south-westerly winds at 12–18 km/h will prevail.
          </p>
        </div>

        {/* Section 2: Crop Advisories */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase bg-[#F1F5F9] px-2 py-1 text-[#0B1F33] border-l-3 border-[#247A4A]">
            2. CROP-WISE SPECIFIC AGROMET ACTION DIRECTIVES
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
            {/* Paddy */}
            <div className="p-2.5 rounded-xs border border-[#CBD5E1] bg-white space-y-1">
              <span className="font-bold text-[#0B1F33] uppercase block">
                PADDY (Dhan) · Tillering Stage
              </span>
              <p className="text-[11px] text-[#4B5B6D] leading-relaxed">
                Clear field drainage channels to limit standing water to 5 cm. Postpone nitrogen top-dressing and pesticide applications until 04 October to avoid chemical runoff.
              </p>
            </div>

            {/* Finger Millet */}
            <div className="p-2.5 rounded-xs border border-[#CBD5E1] bg-white space-y-1">
              <span className="font-bold text-[#0B1F33] uppercase block">
                FINGER MILLET (Mandia) · Vegetative
              </span>
              <p className="text-[11px] text-[#4B5B6D] leading-relaxed">
                Maintain contour bunds to retain moisture while allowing slow excess runoff. Conduct thinning and weeding to ensure 25 cm x 10 cm hill spacing.
              </p>
            </div>

            {/* Maize */}
            <div className="p-2.5 rounded-xs border border-[#CBD5E1] bg-white space-y-1">
              <span className="font-bold text-[#C43D3D] uppercase block">
                MAIZE (Makka) · Tasseling (Waterlogging Alert)
              </span>
              <p className="text-[11px] text-[#4B5B6D] leading-relaxed">
                Very high vulnerability to saturation. Excavate 20-25 cm deep drainage furrows between paired rows. Earth-up plants to prevent storm lodging.
              </p>
            </div>

            {/* Vegetables */}
            <div className="p-2.5 rounded-xs border border-[#CBD5E1] bg-white space-y-1">
              <span className="font-bold text-[#D99000] uppercase block">
                VEGETABLES (Tomato, Chilli, Brinjal)
              </span>
              <p className="text-[11px] text-[#4B5B6D] leading-relaxed">
                Ensure 15-20 cm raised nursery beds. Stake tomato vines off wet soil. Harvest mature fruits immediately before the heavy rain surge on 01 October.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Signature & Authentication */}
        <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#6E7F94]">
          <div>
            <strong>Nodal Officer:</strong> Dr. P. K. Nayak, Senior Scientist (Agrometeorology), RRTTS Semiliguda
          </div>
          <div>
            <strong>Validation:</strong> DEMO MODEL OPERATIONAL SIMULATION (SIH26086)
          </div>
        </div>
      </div>
    </div>
  );
}
