import { KORAPUT_BLOCKS } from '../data/koraputBlocks';
import type {
  OfficerHorizon,
  BlockRiskEntry,
  CropRiskSummary,
  DistrictOfficerOverview,
  HistoricalClimComparison,
  ForecastConfidenceMetrics,
  AdvisoryDistributionStats,
} from '../types/officer';

// Block-specific baseline agronomic and risk weighting for Koraput
const BLOCK_CONFIGS: Record<
  string,
  {
    kharifHa: number;
    panchayats: number;
    primaryCrop: string;
    directive: string;
    baseDrySpellRisk: number;
    isFalseOnset: boolean;
    baseDeficit: number;
  }
> = {
  semiliguda: {
    kharifHa: 24500,
    panchayats: 16,
    primaryCrop: 'Upland Rice / Off-season Vegetables',
    directive: 'Halt upland direct broadcast. Prime community borewells for nursery preservation.',
    baseDrySpellRisk: 68,
    isFalseOnset: true,
    baseDeficit: 58,
  },
  pottangi: {
    kharifHa: 21800,
    panchayats: 14,
    primaryCrop: 'Ginger / Coffee / Mandia (Ragi)',
    directive: 'Apply mulch on ginger ridges; delay upland finger millet transplanting by 7 days.',
    baseDrySpellRisk: 65,
    isFalseOnset: true,
    baseDeficit: 54,
  },
  nandapur: {
    kharifHa: 26200,
    panchayats: 18,
    primaryCrop: 'Upland Paddy / Niger',
    directive: 'Store farm-pond water; prepare ridge-and-furrow planting on undulating slopes.',
    baseDrySpellRisk: 62,
    isFalseOnset: true,
    baseDeficit: 52,
  },
  dasamantapur: {
    kharifHa: 19400,
    panchayats: 16,
    primaryCrop: 'Ragi / Small Millets / Maize',
    directive: 'Distribute drought-tolerant ragi seed varieties (Bhairabi/Chilika) to vulnerable GPs.',
    baseDrySpellRisk: 64,
    isFalseOnset: true,
    baseDeficit: 56,
  },
  koraput: {
    kharifHa: 22100,
    panchayats: 15,
    primaryCrop: 'Vegetables / Medium Paddy',
    directive: 'Enforce nocturnal nursery sprinkler usage to reduce evapotranspiration losses.',
    baseDrySpellRisk: 58,
    isFalseOnset: false,
    baseDeficit: 46,
  },
  laxmipur: {
    kharifHa: 18700,
    panchayats: 14,
    primaryCrop: 'Finger Millet / Pulses',
    directive: 'Encourage intercropping with pigeonpea; hold back post-emergence fertilizer.',
    baseDrySpellRisk: 60,
    isFalseOnset: true,
    baseDeficit: 49,
  },
  jeypore: {
    kharifHa: 34200,
    panchayats: 22,
    primaryCrop: 'Lowland Transplanted Paddy',
    directive: 'Coordinate with Water Resources Dept to release Upper Kolab canal rotational supply.',
    baseDrySpellRisk: 42,
    isFalseOnset: false,
    baseDeficit: 32,
  },
  borigumma: {
    kharifHa: 31500,
    panchayats: 29,
    primaryCrop: 'Medium Land Paddy / Maize',
    directive: 'Prepare furrow irrigation in maize; inspect nursery water levels daily.',
    baseDrySpellRisk: 46,
    isFalseOnset: false,
    baseDeficit: 35,
  },
  kotpad: {
    kharifHa: 27800,
    panchayats: 20,
    primaryCrop: 'Paddy / Sugarcane',
    directive: 'Maintain field bunds to conserve incoming light rain; monitor stem borer incidence.',
    baseDrySpellRisk: 44,
    isFalseOnset: false,
    baseDeficit: 34,
  },
  kundura: {
    kharifHa: 16300,
    panchayats: 12,
    primaryCrop: 'Paddy / Blackgram',
    directive: 'Prepare community nursery shading; delay basal urea till moisture stabilizes.',
    baseDrySpellRisk: 48,
    isFalseOnset: false,
    baseDeficit: 38,
  },
  lamtaput: {
    kharifHa: 20400,
    panchayats: 15,
    primaryCrop: 'Millets / Upland Rice',
    directive: 'Adopt dry nursery raising method with straw covering for quick germination.',
    baseDrySpellRisk: 56,
    isFalseOnset: false,
    baseDeficit: 44,
  },
  narayanpatna: {
    kharifHa: 15900,
    panchayats: 11,
    primaryCrop: 'Cotton / Millets',
    directive: 'Clear field channels; watch for early sucking pests during dry spell surge.',
    baseDrySpellRisk: 52,
    isFalseOnset: false,
    baseDeficit: 42,
  },
  bandhugaon: {
    kharifHa: 14100,
    panchayats: 10,
    primaryCrop: 'Hill Millets / Cotton',
    directive: 'Provide supplemental irrigation to cotton seedlings via mobile pump tankers.',
    baseDrySpellRisk: 55,
    isFalseOnset: false,
    baseDeficit: 45,
  },
  boipariguda: {
    kharifHa: 23600,
    panchayats: 17,
    primaryCrop: 'Paddy / Groundnut',
    directive: 'Delay groundnut sowing by 5 days until deep soil moisture reaches minimum 75mm.',
    baseDrySpellRisk: 50,
    isFalseOnset: false,
    baseDeficit: 40,
  },
};

export class OfficerService {
  /**
   * High level district operational synthesis
   */
  static getDistrictOverview(horizon: OfficerHorizon): DistrictOfficerOverview {
    const horizonMultiplier = horizon === '7d' ? 0.8 : horizon === '14d' ? 1.0 : horizon === '21d' ? 1.15 : 1.25;

    return {
      totalKharifAreaHa: 316700,
      blocksMonitored: 14,
      highRiskBlocksCount: horizon === '7d' ? 3 : horizon === '14d' ? 5 : 6,
      criticalAlertsActive: Math.round(4 * horizonMultiplier),
      farmerSmsReach: 148250,
      panchayatCoverage: 240,
      lastModelRun: 'Operational 03Z Run (NCUM + ERA5 Assimilation)',
      monsoonPhase: 'False-Onset Surge · Break Spell Imminent',
    };
  }

  /**
   * Block × Risk Matrix across all 14 Koraput blocks
   */
  static getBlockRiskMatrix(horizon: OfficerHorizon): BlockRiskEntry[] {
    const horizonFactor = horizon === '7d' ? 0.9 : horizon === '14d' ? 1.0 : horizon === '21d' ? 1.12 : 1.2;

    return KORAPUT_BLOCKS.map((block) => {
      const cfg = BLOCK_CONFIGS[block.id] || {
        kharifHa: 20000,
        panchayats: 15,
        primaryCrop: 'Paddy / Millets',
        directive: 'Monitor soil moisture and prepare contingency seeds.',
        baseDrySpellRisk: 50,
        isFalseOnset: false,
        baseDeficit: 40,
      };

      const drySpellProb = Math.min(95, Math.round(cfg.baseDrySpellRisk * horizonFactor));
      const soilDeficit = Math.min(90, Math.round(cfg.baseDeficit * horizonFactor));
      const heavyRainProb = Math.max(12, Math.round((75 - drySpellProb) * 0.4));
      const onsetAnomalyDays = cfg.isFalseOnset ? +4 : +1;

      // Grade risk level
      let overallRiskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'moderate';
      if (drySpellProb >= 62 || (cfg.isFalseOnset && drySpellProb >= 58)) {
        overallRiskLevel = drySpellProb >= 65 ? 'critical' : 'high';
      } else if (drySpellProb < 45) {
        overallRiskLevel = 'low';
      }

      // Dry spell severity grade
      let drySpellSeverity: 'mild' | 'moderate' | 'severe' | 'extreme' = 'moderate';
      if (drySpellProb >= 65) drySpellSeverity = 'extreme';
      else if (drySpellProb >= 55) drySpellSeverity = 'severe';
      else if (drySpellProb <= 42) drySpellSeverity = 'mild';

      return {
        blockId: block.id,
        blockName: block.name,
        headquarters: block.headquarters,
        elevationMeters: block.elevationMeters,
        agroEcologicalZone: block.agroEcologicalZone,
        kharifAcreageHa: cfg.kharifHa,
        onsetAnomalyDays,
        isFalseOnsetAlert: cfg.isFalseOnset,
        drySpellProbability: drySpellProb,
        drySpellSeverity,
        heavyRainProbability: heavyRainProb,
        soilMoistureDeficitPercent: soilDeficit,
        overallRiskLevel,
        primaryCropVulnerable: cfg.primaryCrop,
        recommendedDirective: cfg.directive,
        panchayatCount: cfg.panchayats,
        panchayatsWithAlert: cfg.isFalseOnset ? Math.round(cfg.panchayats * 0.75) : Math.round(cfg.panchayats * 0.2),
      };
    }).sort((a, b) => {
      // Sort critical and high blocks first
      const weight = { critical: 4, high: 3, moderate: 2, low: 1 };
      return weight[b.overallRiskLevel] - weight[a.overallRiskLevel] || b.drySpellProbability - a.drySpellProbability;
    });
  }

  /**
   * Crop-wise risk breakdown
   */
  static getCropRiskSummaries(_horizon: OfficerHorizon): CropRiskSummary[] {
    return [
      {
        cropKey: 'paddy',
        cropName: 'Paddy (Dhana)',
        districtAcreageHa: 135000,
        shareOfKharifPercent: 42.6,
        riskLevel: 'critical',
        vulnerabilityFactors: [
          'High water demand in upland broadcast rice',
          'Nursery drying hazard due to dry spell',
          'Yellowing of seedlings from high evapotranspiration',
        ],
        drySpellToleranceDays: 4,
        criticalWindow: 'Next 3 to 5 days (Nursery establishment)',
        actionDirective: 'Hold back upland broadcasting; prioritize canal release to Jeypore/Kotpad and mobile pump sets.',
      },
      {
        cropKey: 'ragi',
        cropName: 'Ragi / Mandia (Finger Millet)',
        districtAcreageHa: 68000,
        shareOfKharifPercent: 21.5,
        riskLevel: 'moderate',
        vulnerabilityFactors: [
          'High drought tolerance once established',
          'Vulnerable during initial 10-day germination window',
        ],
        drySpellToleranceDays: 10,
        criticalWindow: 'Week 2 (Transplanting phase)',
        actionDirective: 'Promote raised bed nursery sowing; distribute Odisha Millet Mission drought-hardy seed kits.',
      },
      {
        cropKey: 'maize',
        cropName: 'Maize (Maka)',
        districtAcreageHa: 42000,
        shareOfKharifPercent: 13.3,
        riskLevel: 'high',
        vulnerabilityFactors: [
          'Susceptible to moisture stress during seedling emergence',
          'Shallow root system in light gravelly soils',
        ],
        drySpellToleranceDays: 6,
        criticalWindow: 'Next 48 to 72 hours',
        actionDirective: 'Advise broadbed and furrow land configuration; apply straw mulch to conserve furrow moisture.',
      },
      {
        cropKey: 'vegetables',
        cropName: 'Off-Season Vegetables (Tomato/Brinjal/Beans)',
        districtAcreageHa: 28500,
        shareOfKharifPercent: 9.0,
        riskLevel: 'critical',
        vulnerabilityFactors: [
          'High financial investment per hectare',
          'Tender seedlings prone to heat desiccation and sunscald',
        ],
        drySpellToleranceDays: 3,
        criticalWindow: 'Immediate (Today - Next 48h)',
        actionDirective: 'Mandate shaded nursery covers and evening micro-sprinkler irrigation.',
      },
      {
        cropKey: 'groundnut',
        cropName: 'Groundnut (Chinabadam)',
        districtAcreageHa: 19500,
        shareOfKharifPercent: 6.2,
        riskLevel: 'high',
        vulnerabilityFactors: [
          'Poor pegging and germination in dry topsoil',
          'Seed rot if sown in sub-optimal moisture',
        ],
        drySpellToleranceDays: 7,
        criticalWindow: 'Delay window: 4 to 6 days',
        actionDirective: 'Issue radio advisory to delay sowing until deep soil moisture exceeds 75mm.',
      },
      {
        cropKey: 'pulses',
        cropName: 'Pulses (Arhar / Kandula / Blackgram)',
        districtAcreageHa: 15200,
        shareOfKharifPercent: 4.8,
        riskLevel: 'moderate',
        vulnerabilityFactors: [
          'Deep taproot provides resilience to short breaks',
          'Poor drainage risk if sudden heavy downpour strikes dry soil',
        ],
        drySpellToleranceDays: 12,
        criticalWindow: 'Standard Kharif window',
        actionDirective: 'Encourage pigeonpea intercropping in ragi and maize terraces.',
      },
      {
        cropKey: 'cotton',
        cropName: 'Cotton (Kapa)',
        districtAcreageHa: 8500,
        shareOfKharifPercent: 2.7,
        riskLevel: 'moderate',
        vulnerabilityFactors: [
          'Deep black soil retains moisture but sucking pests surge during warm dry breaks',
        ],
        drySpellToleranceDays: 9,
        criticalWindow: 'Next 5 days',
        actionDirective: 'Monitor yellow sticky traps for jassids and whiteflies in Narayanpatna and Bandhugaon.',
      },
    ];
  }

  /**
   * Historical Climatological baseline comparison
   */
  static getHistoricalComparison(): HistoricalClimComparison {
    return {
      climatologicalNormalOnsetDate: '10 June (± 4 days)',
      predictedOnsetDate: '14 June (Delayed Surge)',
      onsetAnomalyDays: +4,
      historicalDrySpellFreqJuly: '2.4 events > 5 days (1970–2025 IMD baseline)',
      analogousClimYears: ['2012 (Delayed onset with break spell)', '2016 (Weak monsoon trough)', '2023 (El Niño onset lag)'],
      groundwaterRechargeIndex: '-18% relative to 10-year mean',
      decadalTrendOnsetShift: '+3.2 days later onset per decade over Koraput district',
    };
  }

  /**
   * Forecast confidence and model ensemble performance metrics
   */
  static getForecastConfidence(horizon: OfficerHorizon): ForecastConfidenceMetrics {
    const score = horizon === '7d' ? 91 : horizon === '14d' ? 84 : horizon === '21d' ? 73 : 64;
    const agreement = horizon === '7d' ? 89 : horizon === '14d' ? 82 : horizon === '21d' ? 70 : 61;
    const brier = horizon === '7d' ? 0.14 : horizon === '14d' ? 0.19 : horizon === '21d' ? 0.27 : 0.34;

    return {
      modelConfidenceScore: score,
      ensembleAgreementPercent: agreement,
      brierSkillScore: brier,
      leadTimeReliabilityTier: horizon === '7d' ? 'Tier-A (Operational)' : horizon === '14d' ? 'Tier-B (High Confidence)' : 'Tier-C (Experimental)',
      uncertaintySpreadDays: horizon === '7d' ? 1.5 : horizon === '14d' ? 3.0 : 5.0,
      dataFeedLatency: '34 mins (AWS Doppler Sync)',
    };
  }

  /**
   * Advisory distribution and communication tracking
   */
  static getAdvisoryDistribution(): AdvisoryDistributionStats {
    return {
      biweeklyBulletinNumber: 'OUAT/GKMS/2026/044',
      issuingAuthority: 'GKMS Agromet Advisory Service, RRTTS Semiliguda & KVK Koraput',
      smsDispatchedCount: 148250,
      smsDeliveredPercent: 96.4,
      whatsAppAgrometGroups: 84,
      kvkHelplineTickets: 312,
      extensionStaffAlerted: 142,
    };
  }

  /**
   * Export Block Risk Matrix to CSV
   */
  static exportBlockRiskCsv(data: BlockRiskEntry[]): void {
    const headers = [
      'Block Name',
      'Headquarters',
      'Elevation (m)',
      'Agro-Ecological Zone',
      'Kharif Acreage (ha)',
      'Onset Anomaly (days)',
      'False Onset Alert',
      'Dry Spell Probability (%)',
      'Dry Spell Severity',
      'Heavy Rain Probability (%)',
      'Soil Moisture Deficit (%)',
      'Overall Risk Level',
      'Primary Vulnerable Crop',
      'Recommended Administrative Directive',
      'Total Panchayats',
      'Panchayats Alerted',
    ];

    const rows = data.map((b) => [
      `"${b.blockName}"`,
      `"${b.headquarters}"`,
      b.elevationMeters,
      `"${b.agroEcologicalZone}"`,
      b.kharifAcreageHa,
      b.onsetAnomalyDays,
      b.isFalseOnsetAlert ? 'YES' : 'NO',
      b.drySpellProbability,
      `"${b.drySpellSeverity}"`,
      b.heavyRainProbability,
      b.soilMoistureDeficitPercent,
      `"${b.overallRiskLevel.toUpperCase()}"`,
      `"${b.primaryCropVulnerable}"`,
      `"${b.recommendedDirective.replace(/"/g, '""')}"`,
      b.panchayatCount,
      b.panchayatsWithAlert,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KORAPUT_AGRI_OFFICER_RISK_MATRIX_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Generate Official Government Agromet Bulletin Markdown
   */
  static generateOfficialBulletin(horizon: OfficerHorizon, blockName?: string): string {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return `
GOVERNMENT OF ODISHA · DEPARTMENT OF AGRICULTURE & FARMERS' EMPOWERMENT
DISTRICT AGROMET ADVISORY SERVICE (GKMS) · PILOT NODE: KORAPUT
In Technical Collaboration with IMD Bhubaneswar & OUAT RRTTS Semiliguda

BULLETIN NO: OUAT/GKMS/2026/044 | ISSUE DATE: ${dateStr}
HORIZON: ${horizon.toUpperCase()} OUTLOOK | COVERAGE: ${blockName || 'ALL 14 BLOCKS OF KORAPUT DISTRICT'}

1. SYNOPTIC ASSESSMENT:
Initial monsoon surges have triggered onset-like convective activity over Southern Odisha. 
However, high-resolution coupled simulations indicate 850 hPa zonal wind reversal and an 
advancing break-spell regime with 58-68% probability over the undulating highlands.

2. PRIORITY ACTION DIRECTIVES FOR EXTENSION OFFICERS (DAOs / BAOs):
- Semiliguda & Pottangi: Halt direct dry broadcast of paddy in uplands. Enforce nursery water preservation.
- Jeypore & Kotpad: Issue coordinated canal release schedules with Upper Kolab Project engineers.
- Dasamantapur & Laxmipur: Distribute seed buffer stocks of drought-resilient ragi (Bhairabi/Chilika).
- Horticulture Staff: Inspect commercial tomato, brinjal, and chili nurseries for heat stress & mulching.

3. FARMER ADVISORY BROADCAST DISPATCH:
- Broadcast SMS count: 148,250 registered farmers via mKisan portal.
- Audio Bulletin: Dispatched to 84 Community Agromet WhatsApp groups and All India Radio Jeypore.

Prepared by: District Agriculture Officer, Koraput | Joint Director of Agriculture, Southern Range
Validation Status: DEMO MODEL OPERATIONAL SIMULATION (SIH26086)
`.trim();
  }
}
