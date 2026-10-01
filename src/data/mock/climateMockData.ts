import type { ClimateSignalDashboardData } from '../../types/climate';

export const mockClimateDashboardData: ClimateSignalDashboardData = {
  enso: {
    nino34: -0.38,
    phase: 'ENSO-Neutral',
    trend: 'Gradual cooling trend across central equatorial Pacific with thermocline shallowing',
    source: 'NOAA Climate Prediction Center (CPC) / OISSTv2.1',
    observationDate: '28 Sep 2026',
    thresholds: {
      elNinoThreshold: 0.5,
      laNinaThreshold: -0.5,
    },
    modelInputRole:
      'Model input: Serves as low-frequency lower boundary forcing condition for sub-seasonal to seasonal priors in the 30-day ensemble.',
    potentialInfluenceKoraput:
      'Statistical relationship: Neutral-to-cool Niño 3.4 anomalies correlate with delayed monsoon withdrawal and sustained late-season moisture advection over South Odisha.',
    analogYears: ['2016', '2020', '2022'],
  },

  iod: {
    dmi: 0.32,
    phase: 'Positive IOD',
    trend: 'Weakening positive gradient; eastern equatorial Indian Ocean cooling slowly waning',
    source: 'Bureau of Meteorology (BoM) Australia / ACCESS-S2',
    observationDate: '27 Sep 2026',
    westernPoleSst: 0.52,
    easternPoleSst: 0.20,
    modelInputRole:
      'Model input: Modulates cross-equatorial zonal moisture transport vectors into the southern Bay of Bengal.',
    potentialInfluenceKoraput:
      'Potential influence: Positive IOD exhibits a statistical relationship with diminished dry spell frequency during the mid-to-late Kharif window.',
  },

  mjo: {
    phase: 'Phase 3 (East Indian Ocean)',
    phaseNumber: 3,
    amplitude: 1.34,
    movement: 'Eastward propagating at ~5.2 m/s toward the Maritime Continent (Phase 4)',
    source: 'Wheeler-Hendon Real-time Multivariate MJO (RMM) / BoM & IMD Pune',
    observationDate: '29 Sep 2026',
    convectiveState: 'Convectively Active',
    modelInputRole:
      'Model input: Sub-seasonal intra-seasonal convective pulse driver, modulating 1–15 day ensemble precipitation priors.',
    potentialInfluenceKoraput:
      'Potential influence: MJO in Phase 3–4 has a statistical relationship with enhanced probability of low-pressure cyclogenesis over the Bay of Bengal.',
  },

  cascadeStages: [
    {
      stageId: 'GLOBAL_CLIMATE',
      order: 1,
      levelName: 'GLOBAL CLIMATE',
      headline: 'Planetary Coupled Ocean-Atmosphere Oscillations',
      activePhenomenon: 'ENSO-Neutral (-0.38°C) · Positive IOD (+0.32°C) · MJO Phase 3 (Amp 1.34)',
      physicalProcess:
        'Large-scale sea surface temperature anomalies across the equatorial Pacific and Indian oceans modulate global Walker and Hadley circulation cells.',
      statisticalLink:
        'Statistical relationship: Pacific and Indian Ocean SST boundary forcing explains approximately 30–35% of interannual Indian Summer Monsoon rainfall variance.',
      koraputImpact:
        'Potential influence: Modulates the seasonal baseline and moisture transport potential across peninsular India.',
      statusBadge: 'Planetary Boundary Forcing',
    },
    {
      stageId: 'REGIONAL_ATMOSPHERE',
      order: 2,
      levelName: 'REGIONAL ATMOSPHERE',
      headline: 'Monsoon Trough Dynamics & Bay of Bengal Synoptic Systems',
      activePhenomenon: '850 hPa Low-Level Jet (28–32 kts) · Synoptic Shear Line at 18°N–20°N',
      physicalProcess:
        'Planetary waves steer the latitudinal positioning of the monsoon trough, modulating the frequency of depressions emerging from the Bay of Bengal.',
      statisticalLink:
        'Statistical relationship: MJO Phase 3 eastward migration exhibits an empirical correlation with convective shear line formation along the Odisha coast.',
      koraputImpact:
        'Potential influence: Determines the recurrence of multi-day active monsoon pulses vs dry spell intervals.',
      statusBadge: 'Synoptic Driver',
    },
    {
      stageId: 'LOCAL_RAINFALL',
      order: 3,
      levelName: 'LOCAL RAINFALL',
      headline: 'Topographically Downscaled Orographic Precipitation',
      activePhenomenon: 'Orographic Ascent along Deomali Ridge (1,672m) & Pottangi Escarpment',
      physicalProcess:
        'South-westerly maritime airflow encounters the steep Eastern Ghats topography, triggering forced mechanical ascent, adiabatic cooling, and intense convective cells.',
      statisticalLink:
        'Model input: Global NWP forecasts are topographically corrected via 1.2 km² SRTM digital elevation grids and empirical elevation lapse rates (+4.2% rain / 100m rise).',
      koraputImpact:
        'Potential influence: Creates stark microclimatic divergence between high-altitude ridgelines (Pottangi: 142mm) and lowland valleys (Jeypore: 88mm).',
      statusBadge: 'Hyperlocal Topographic Response',
    },
    {
      stageId: 'AGRICULTURAL_RISK',
      order: 4,
      levelName: 'AGRICULTURAL RISK',
      headline: 'Root-Zone Soil Moisture, Crop Operations & Hydrological Hazard',
      activePhenomenon: 'Adequate Root-Zone Moisture (0–30 cm) · High Slope Runoff in Highland Zones',
      physicalProcess:
        'Local rainfall accumulation interacts with soil texture (red sandy loams in uplands, clayey alluvium in lowlands) determining infiltration vs surface runoff.',
      statisticalLink:
        'Model input: Hydrological soil moisture models translate precipitation anomalies into agricultural readiness indicators and flood/dry spell hazard alerts.',
      koraputImpact:
        'Direct Farm Decisions: Informs paddy nursery management, fertilizer scheduling, water harvesting, and Kharif harvesting timelines.',
      statusBadge: 'Decisional Agromet Output',
    },
  ],

  timeline: [
    {
      month: 'May 2026',
      displayMonth: 'May',
      year: 2026,
      nino34Anomaly: 0.22,
      iodDmiAnomaly: 0.12,
      mjoPhase: 'Phase 1',
      isForecastProjection: false,
      koraputRainfallDeparturePercent: -4.2,
      dominantInfluence: 'Pre-monsoon neutral transition',
    },
    {
      month: 'Jun 2026',
      displayMonth: 'Jun',
      year: 2026,
      nino34Anomaly: 0.08,
      iodDmiAnomaly: 0.24,
      mjoPhase: 'Phase 2',
      isForecastProjection: false,
      koraputRainfallDeparturePercent: -6.2,
      dominantInfluence: 'Monsoon onset pacing',
    },
    {
      month: 'Jul 2026',
      displayMonth: 'Jul',
      year: 2026,
      nino34Anomaly: -0.12,
      iodDmiAnomaly: 0.38,
      mjoPhase: 'Phase 3',
      isForecastProjection: false,
      koraputRainfallDeparturePercent: 6.1,
      dominantInfluence: 'Active surge with positive IOD',
    },
    {
      month: 'Aug 2026',
      displayMonth: 'Aug',
      year: 2026,
      nino34Anomaly: -0.28,
      iodDmiAnomaly: 0.42,
      mjoPhase: 'Phase 2',
      isForecastProjection: false,
      koraputRainfallDeparturePercent: 5.8,
      dominantInfluence: 'Persistent low-level jet',
    },
    {
      month: 'Sep 2026',
      displayMonth: 'Sep',
      year: 2026,
      nino34Anomaly: -0.38,
      iodDmiAnomaly: 0.32,
      mjoPhase: 'Phase 3',
      isForecastProjection: false,
      koraputRainfallDeparturePercent: 8.9,
      dominantInfluence: 'Bay of Bengal low pressure pulses',
    },
    {
      month: 'Oct 2026',
      displayMonth: 'Oct (Proj)',
      year: 2026,
      nino34Anomaly: -0.45,
      iodDmiAnomaly: 0.18,
      mjoPhase: 'Phase 4',
      isForecastProjection: true,
      koraputRainfallDeparturePercent: -4.5,
      dominantInfluence: 'Model projection: IOD decay, sustained La Niña tendency',
    },
    {
      month: 'Nov 2026',
      displayMonth: 'Nov (Proj)',
      year: 2026,
      nino34Anomaly: -0.52,
      iodDmiAnomaly: 0.05,
      mjoPhase: 'Phase 5',
      isForecastProjection: true,
      koraputRainfallDeparturePercent: -8.0,
      dominantInfluence: 'Model projection: Post-monsoon transition',
    },
    {
      month: 'Dec 2026',
      displayMonth: 'Dec (Proj)',
      year: 2026,
      nino34Anomaly: -0.56,
      iodDmiAnomaly: -0.02,
      mjoPhase: 'Phase 6',
      isForecastProjection: true,
      koraputRainfallDeparturePercent: -2.0,
      dominantInfluence: 'Model projection: Winter boundary conditions',
    },
  ],

  explanatoryGuidance: {
    panelTitle: 'How Climate Signals Influence the Forecast',
    nonDeterministicDisclaimer:
      'IMPORTANT SCIENTIFIC GOVERNANCE: Planetary climate signals (ENSO, IOD, MJO) do NOT exert deterministic causation over daily rainfall in Koraput. The chaotic nature of the atmosphere means that an identical Niño 3.4 value can yield widely differing regional outcomes in different years. Instead, climate indices serve as probabilistic model inputs and boundary conditions that alter the background odds of heavy precipitation or dry spells.',
    principles: [
      {
        principleTitle: 'Boundary Condition Modulation vs Initial Value Weather',
        keyTerminology: 'Model input',
        scientificExplanation:
          'While short-range weather forecasts (Day 1–5) are initial-value problems dominated by current atmospheric states, sub-seasonal to monthly outlooks (Day 10–30) are boundary-value problems. Ocean heat content and SST anomalies evolve slowly, providing memory to the climate system. These indices serve as vital model inputs into multi-model numerical ensembles.',
        operationalApplication:
          'Used by the prediction engine to calibrate ensemble member weighting and bias-correction algorithms rather than dictating specific rain events.',
      },
      {
        principleTitle: 'Probabilistic Risk Shift, Not Guaranteed Outcomes',
        keyTerminology: 'Potential influence',
        scientificExplanation:
          'A given climate phase alters the probability distribution of regional weather regimes. For example, a Positive IOD does not "cause" rainfall on any specific day; rather, it exerts a potential influence by statistically increasing the frequency of moisture-bearing easterly waves and lowering the probability of protracted dry spells.',
        operationalApplication:
          'Enables agricultural decision-makers to evaluate risk tilts (e.g. higher likelihood of extended wet spells vs dry breaks) weeks in advance.',
      },
      {
        principleTitle: 'Empirical Historical Analogs & Teleconnection Lags',
        keyTerminology: 'Statistical relationship',
        scientificExplanation:
          'Meteorological models identify statistical relationships derived from 50+ years of gridded climatological observations. Lagged teleconnection correlations show that Pacific SST anomalies typically take 2–4 weeks to fully manifest in the Indian monsoon trough placement.',
        operationalApplication:
          'Informs the Bayesian priors used in the Koraput Monsoon Intelligence engine to generate confidence bands for onset and break predictions.',
      },
    ],
  },

  metadata: {
    cycleTimestamp: '2026-09-29T00:00:00Z',
    modelCoupling: 'NCMRWF Unified Model + ECMWF Seasonal S2S Coupling',
    isDemoModelOutput: true,
  },
};
