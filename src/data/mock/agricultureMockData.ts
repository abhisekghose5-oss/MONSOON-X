import type {
  AgricultureDashboardData,
  CropDefinition,
  CropRiskDetail,
  CropRiskMatrixRow,
  StructuredAdvisory,
} from '../../types/agriculture';
import { AdvisoryRuleEngine } from '../../services/advisory/advisoryRules';
import { KORAPUT_BLOCKS } from '../koraputBlocks';

export const BACKEND_CONFIGURED_CROPS: CropDefinition[] = [
  {
    id: 'paddy',
    name: 'Paddy',
    localName: 'Dhan (ଧାନ)',
    category: 'cereal',
    scientificName: 'Oryza sativa',
    typicalDurationDays: 135,
    optimalSoilType: 'Clay loam to heavy alluvial in valley bottoms',
    isKharifPrimary: true,
  },
  {
    id: 'maize',
    name: 'Maize',
    localName: 'Makka (ମକା)',
    category: 'cereal',
    scientificName: 'Zea mays',
    typicalDurationDays: 105,
    optimalSoilType: 'Well-drained red sandy loam with good aeration',
    isKharifPrimary: true,
  },
  {
    id: 'ragi',
    name: 'Ragi',
    localName: 'Mandia (ମାଣ୍ଡିଆ)',
    category: 'millet',
    scientificName: 'Eleusine coracana',
    typicalDurationDays: 110,
    optimalSoilType: 'Undulating hill upland red soils, drought tolerant',
    isKharifPrimary: true,
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    localName: 'Chinabadam (ଚିନାବାଦାମ)',
    category: 'oilseed',
    scientificName: 'Arachis hypogaea',
    typicalDurationDays: 120,
    optimalSoilType: 'Light sandy loam, loose texture for peg penetration',
    isKharifPrimary: true,
  },
  {
    id: 'pulses',
    name: 'Highland Pulses',
    localName: 'Arhar & Biri (କନ୍ଦୁଳ ଓ ବିରି)',
    category: 'pulses',
    scientificName: 'Cajanus cajan / Vigna mungo',
    typicalDurationDays: 150,
    optimalSoilType: 'Medium loam with strict drainage to prevent wilt',
    isKharifPrimary: true,
  },
  {
    id: 'suan',
    name: 'Suan (Little Millet)',
    localName: 'Suan (ସୁଆଁ)',
    category: 'millet',
    scientificName: 'Panicum sumatrense',
    typicalDurationDays: 80,
    optimalSoilType: 'Highland gravelly slopes, exceptionally drought-tolerant',
    isKharifPrimary: true,
  },
  {
    id: 'cotton',
    name: 'Cotton',
    localName: 'Kapa (କପା)',
    category: 'cash_crop',
    scientificName: 'Gossypium hirsutum',
    typicalDurationDays: 165,
    optimalSoilType: 'Deep black and mixed red soils with ridge-furrow layout',
    isKharifPrimary: true,
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    localName: 'Pariba (ପନିପରିବା)',
    category: 'horticulture',
    scientificName: 'Solanum lycopersicum & Brassica oleracea',
    typicalDurationDays: 85,
    optimalSoilType: 'Raised beds with rich organic matter and furrow drainage',
    isKharifPrimary: false,
  },
];

export function generateMockAgricultureData(
  blockId: string = 'all'
): AgricultureDashboardData {
  const block =
    blockId !== 'all'
      ? KORAPUT_BLOCKS.find((b) => b.id === blockId)
      : null;

  const blockName = block ? block.name : 'Koraput District (All Blocks)';
  const elevation = block ? block.elevationMeters : 870;

  const cropDetails: Record<string, CropRiskDetail> = {
    paddy: {
      cropId: 'paddy',
      cropName: 'Paddy',
      localName: 'Dhan (ଧାନ)',
      category: 'cereal',
      currentRisk: 'watch',
      currentRiskLabel: 'Submergence Watch in Lowland Plots',
      rainfallOutlook: '78.5 mm expected over 14 days (+14% vs normal)',
      drySpellProbability: 24,
      heavyRainProbability: 44,
      sowingWindow: {
        status: 'Sowing Concluded',
        recommendedWindowDate: 'Completed (Mid-July to Early August)',
        advice: 'Transplanting complete across 92% of Koraput valley plots. Focus on tillering water depth (3–5 cm).',
      },
      waterStress: {
        level: 'None',
        description: 'Optimal root-zone ponding depth; water stress index is zero.',
        rootZoneMoistureVolumetricPct: 42,
        statusColor: 'agriculture',
      },
      recommendedAction:
        'Clear field bund spillways to prevent standing water > 5 cm depth. Defer urea top-dressing until 04 October post rain peak.',
      confidence: {
        score: 86,
        tier: 'High',
        basis: 'Soil hydrology coupled with 51-member ECMWF precipitation consensus.',
      },
      phenologyStage: 'Active Tillering & Early Panicle Initiation',
    },

    maize: {
      cropId: 'maize',
      cropName: 'Maize',
      localName: 'Makka (ମକା)',
      category: 'cereal',
      currentRisk: 'alert',
      currentRiskLabel: 'Waterlogging Vulnerability in Foot-Slopes',
      rainfallOutlook: '68.0 mm expected over 14 days; localized high-intensity bursts',
      drySpellProbability: 28,
      heavyRainProbability: 42,
      sowingWindow: {
        status: 'Sowing Concluded',
        recommendedWindowDate: 'Sowing concluded in late June / early July',
        advice: 'Late sown plots at tasseling; earthing up critical before squall winds.',
      },
      waterStress: {
        level: 'Moderate',
        description: 'Excess root saturation hazard; soil moisture near 33% VWC.',
        rootZoneMoistureVolumetricPct: 33,
        statusColor: 'warning',
      },
      recommendedAction:
        'Dig out 25 cm deep drainage furrows between paired rows to prevent root crown asphyxiation. Earth up plant bases.',
      confidence: {
        score: 84,
        tier: 'High',
        basis: 'SRTM slope hydrology and soil texture saturation curves.',
      },
      phenologyStage: 'Tasseling & Silking Stage',
    },

    ragi: {
      cropId: 'ragi',
      cropName: 'Ragi',
      localName: 'Mandia (ମାଣ୍ଡିଆ)',
      category: 'millet',
      currentRisk: 'nominal',
      currentRiskLabel: 'Optimal Growth Conditions on Upland Terraces',
      rainfallOutlook: '54.0 mm expected over 14 days; well distributed showers',
      drySpellProbability: 22,
      heavyRainProbability: 26,
      sowingWindow: {
        status: 'Sowing Concluded',
        recommendedWindowDate: 'Optimum direct-seeded and transplanted window concluded',
        advice: 'Crop stands healthy on hillside contour terraces; soil moisture adequate.',
      },
      waterStress: {
        level: 'None',
        description: 'Optimal soil moisture (24% VWC) for drought-hardy root systems.',
        rootZoneMoistureVolumetricPct: 24,
        statusColor: 'agriculture',
      },
      recommendedAction:
        'Carry out inter-cultivation with cycle hoe and manual weeding during the dry break (04–06 Oct). Maintain contour bunds.',
      confidence: {
        score: 88,
        tier: 'High',
        basis: 'Empirical CRIDA millet drought and waterlogging thresholds.',
      },
      phenologyStage: 'Vegetative Tillering to Pre-Flowering',
    },

    groundnut: {
      cropId: 'groundnut',
      cropName: 'Groundnut',
      localName: 'Chinabadam (ଚିନାବାଦାମ)',
      category: 'oilseed',
      currentRisk: 'watch',
      currentRiskLabel: 'Pegging Zone Moisture Watch',
      rainfallOutlook: '62.0 mm expected over 14 days',
      drySpellProbability: 32,
      heavyRainProbability: 38,
      sowingWindow: {
        status: 'Sowing Concluded',
        recommendedWindowDate: 'Completed',
        advice: 'Active gynophore penetration; loose topsoil essential.',
      },
      waterStress: {
        level: 'Low',
        description: 'Adequate moisture in pod zone; avoid prolonged soil saturation.',
        rootZoneMoistureVolumetricPct: 26,
        statusColor: 'normal',
      },
      recommendedAction:
        'Clear broad-bed drainage furrows. Avoid intercultural operations while soil is slushy to prevent injuring tender pegs.',
      confidence: {
        score: 82,
        tier: 'Moderate',
        basis: 'Agromet disease epidemiology model for collar rot.',
      },
      phenologyStage: 'Pegging & Early Pod Formation',
    },

    pulses: {
      cropId: 'pulses',
      cropName: 'Pulses',
      localName: 'Arhar & Biri (କନ୍ଦୁଳ ଓ ବିରି)',
      category: 'pulses',
      currentRisk: 'alert',
      currentRiskLabel: 'Phytophthora & Waterlogging Hazard',
      rainfallOutlook: '65.5 mm expected over 14 days; high convective rain bursts',
      drySpellProbability: 30,
      heavyRainProbability: 40,
      sowingWindow: {
        status: 'Sowing Concluded',
        recommendedWindowDate: 'Completed',
        advice: 'Standing pigeonpea and blackgram highly intolerant to water stagnation.',
      },
      waterStress: {
        level: 'Moderate',
        description: 'Root collar saturation risk; high humidity favors stem blight.',
        rootZoneMoistureVolumetricPct: 30,
        statusColor: 'warning',
      },
      recommendedAction:
        'Dig out field drainage trenches every 10–12 rows immediately. Drench root collars with Metalaxyl + Mancozeb (2 g/L) if waterlogged.',
      confidence: {
        score: 85,
        tier: 'High',
        basis: 'ICAR pulse contingency matrix for red soils.',
      },
      phenologyStage: 'Branching & Early Pod Setting',
    },

    suan: {
      cropId: 'suan',
      cropName: 'Suan (Little Millet)',
      localName: 'Suan (ସୁଆଁ)',
      category: 'millet',
      currentRisk: 'watch',
      currentRiskLabel: 'Favorable Maturity & Drainage Advisory',
      rainfallOutlook: '58.0 mm expected over 14 days; minimal moisture stress',
      drySpellProbability: 22,
      heavyRainProbability: 32,
      sowingWindow: {
        status: 'Sowing Concluded',
        recommendedWindowDate: 'Completed',
        advice: 'Grain maturity underway on gravelly upper slopes; ensure quick drainage.',
      },
      waterStress: {
        level: 'Low',
        description: 'Hardy root system thriving on low moisture; avoid water lodging at base.',
        rootZoneMoistureVolumetricPct: 22,
        statusColor: 'normal',
      },
      recommendedAction:
        'Keep field exit channels open to drain storm runoff. Prepare threshing floors for early crop harvesting.',
      confidence: {
        score: 88,
        tier: 'High',
        basis: 'OUAT millet contingency protocols.',
      },
      phenologyStage: 'Dough & Early Maturity Stage',
    },

    cotton: {
      cropId: 'cotton',
      cropName: 'Cotton',
      localName: 'Kapa (କପା)',
      category: 'cash_crop',
      currentRisk: 'watch',
      currentRiskLabel: 'Square Shedding & Wind Shear Warning',
      rainfallOutlook: '72.0 mm expected over 14 days with gusty thunderstorm winds',
      drySpellProbability: 34,
      heavyRainProbability: 36,
      sowingWindow: {
        status: 'Sowing Concluded',
        recommendedWindowDate: 'Completed',
        advice: 'Squaring initiated; avoid excessive vegetative surge from excess water.',
      },
      waterStress: {
        level: 'Low',
        description: 'Soil moisture adequate (28% VWC); monitor for sucking pests.',
        rootZoneMoistureVolumetricPct: 28,
        statusColor: 'normal',
      },
      recommendedAction:
        'Maintain ridge-furrow drainage. Spray Streptocycline + Copper oxychloride against bacterial blight during clear weather intervals.',
      confidence: {
        score: 80,
        tier: 'Moderate',
        basis: 'Wind shear vectors and canopy microclimate simulation.',
      },
      phenologyStage: 'Square Formation & Early Flowering',
    },

    vegetables: {
      cropId: 'vegetables',
      cropName: 'Vegetables',
      localName: 'Pariba (ପନିପରିବା)',
      category: 'horticulture',
      currentRisk: 'warning',
      currentRiskLabel: 'Damping-Off & Fruit Splitting Risk',
      rainfallOutlook: '82.0 mm expected over 14 days; intense afternoon convection',
      drySpellProbability: 20,
      heavyRainProbability: 52,
      sowingWindow: {
        status: 'Caution - Monitor Soil',
        recommendedWindowDate: 'Late Kharif / Early Rabi Nursery Window',
        advice: 'Protect seedling nurseries under polythene tunnels to prevent rain splash damage.',
      },
      waterStress: {
        level: 'High',
        description: 'Excess moisture risk; high vulnerability to bacterial wilt and damping-off.',
        rootZoneMoistureVolumetricPct: 35,
        statusColor: 'risk',
      },
      recommendedAction:
        'Harvest all ripe tomatoes and chillies immediately. Stake vines and drench nursery beds with Copper hydroxide (2 g/L).',
      confidence: {
        score: 87,
        tier: 'High',
        basis: 'Horticultural pathology models and convective thunderstorm alerts.',
      },
      phenologyStage: 'Fruiting (Solanaceous) & Early Rabi Nursery Raising',
    },
  };

  // Crop Risk Matrix
  const riskMatrix: CropRiskMatrixRow[] = [
    {
      cropId: 'paddy',
      cropName: 'Paddy',
      localName: 'Dhan',
      category: 'cereal',
      onsetRisk: { level: 'Low', detail: 'Established across all blocks' },
      drySpellRisk: { level: 'Low', probability: 24 },
      heavyRainRisk: { level: 'Moderate', probability: 44 },
      recommendation: 'Open drainage bund spillways; postpone nitrogen top-dressing.',
    },
    {
      cropId: 'maize',
      cropName: 'Maize',
      localName: 'Makka',
      category: 'cereal',
      onsetRisk: { level: 'Low', detail: 'Crop in reproductive phase' },
      drySpellRisk: { level: 'Moderate', probability: 28 },
      heavyRainRisk: { level: 'High', probability: 42 },
      recommendation: 'Dig 25 cm deep drainage furrows; earth up stalk bases.',
    },
    {
      cropId: 'ragi',
      cropName: 'Ragi',
      localName: 'Mandia',
      category: 'millet',
      onsetRisk: { level: 'Low', detail: 'Optimal vegetative stand' },
      drySpellRisk: { level: 'Low', probability: 22 },
      heavyRainRisk: { level: 'Low', probability: 26 },
      recommendation: 'Maintain contour bunds; cycle-hoe weeding on dry break.',
    },
    {
      cropId: 'groundnut',
      cropName: 'Groundnut',
      localName: 'Chinabadam',
      category: 'oilseed',
      onsetRisk: { level: 'Low', detail: 'Pegging phase ongoing' },
      drySpellRisk: { level: 'Moderate', probability: 32 },
      heavyRainRisk: { level: 'Moderate', probability: 38 },
      recommendation: 'Clear broad-bed furrows; avoid working wet soils.',
    },
    {
      cropId: 'pulses',
      cropName: 'Pulses',
      localName: 'Arhar/Biri',
      category: 'pulses',
      onsetRisk: { level: 'Low', detail: 'Vegetative growth' },
      drySpellRisk: { level: 'Moderate', probability: 30 },
      heavyRainRisk: { level: 'High', probability: 40 },
      recommendation: 'Dig drainage ditches every 10 rows; root drench if wilt appears.',
    },
    {
      cropId: 'suan',
      cropName: 'Suan (Little Millet)',
      localName: 'Suan (ସୁଆଁ)',
      category: 'millet',
      onsetRisk: { level: 'Low', detail: 'Dough maturity' },
      drySpellRisk: { level: 'Low', probability: 22 },
      heavyRainRisk: { level: 'Moderate', probability: 32 },
      recommendation: 'Open boundary furrows; harvest mature panicles before wet burst.',
    },
    {
      cropId: 'cotton',
      cropName: 'Cotton',
      localName: 'Kapa',
      category: 'cash_crop',
      onsetRisk: { level: 'Low', detail: 'Squaring started' },
      drySpellRisk: { level: 'Moderate', probability: 34 },
      heavyRainRisk: { level: 'Moderate', probability: 36 },
      recommendation: 'Maintain ridge-furrows; install pink bollworm traps.',
    },
    {
      cropId: 'vegetables',
      cropName: 'Vegetables',
      localName: 'Pariba',
      category: 'horticulture',
      onsetRisk: { level: 'Moderate', detail: 'Nursery splash hazard' },
      drySpellRisk: { level: 'Low', probability: 20 },
      heavyRainRisk: { level: 'Severe', probability: 52 },
      recommendation: 'Harvest ripe produce immediately; cover nurseries with poly-sheets.',
    },
  ];

  // Build Structured Advisories for each crop
  const advisories: Record<string, StructuredAdvisory> = {};
  for (const crop of BACKEND_CONFIGURED_CROPS) {
    const detail = cropDetails[crop.id];
    if (detail) {
      advisories[crop.id] = AdvisoryRuleEngine.buildStructuredAdvisory(
        crop,
        detail,
        blockName
      );
    }
  }

  return {
    availableCrops: BACKEND_CONFIGURED_CROPS,
    selectedCropId: 'paddy',
    cropDetails,
    riskMatrix,
    advisories,
    blockAgroContext: {
      blockId,
      blockName,
      elevationMeters: elevation,
      soilType:
        elevation > 900
          ? 'Red Laterite & Gravelly Sandy Loam (High Drainage)'
          : 'Red Loam to Clayey Alluvial in Valley Bottoms',
      agroEcologicalZone:
        elevation > 900
          ? 'Eastern Ghat High Altitude Upland Zone'
          : 'Central Undulating Plain & Lowland Valley Zone',
      generalBulletinNotice:
        'OUAT-RRTTS Semiliguda Agromet Bulletin: Moderate to heavy convective showers expected between 30 Sep and 03 Oct. Ensure effective surface drainage across pulses, maize, and vegetable plots.',
    },
    metadata: {
      sourceAgency: 'OUAT / ICAR-CRIDA / KVK Koraput Agromet Advisory Services',
      ruleEngineVersion: 'KMI-AgroRules v2.2 (Modular Backend Architecture)',
      lastUpdated: '2026-09-29T08:30:00+05:30',
      isDemoModelOutput: true,
    },
  };
}
