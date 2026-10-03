import {
  LayoutDashboard,
  MapPin,
  CloudRain,
  Compass,
  Droplets,
  Globe2,
  Sprout,
  ShieldAlert,
  History,
  Activity,
  Database,
  Building,
} from 'lucide-react';
import type { NavItem } from '../types/navigation';

export const NAVIGATION_ITEMS: NavItem[] = [
  // 1. OVERVIEW
  {
    id: 'overview',
    name: 'Overview',
    href: '/overview',
    icon: LayoutDashboard,
    description: 'High-level synthesis of monsoon onset, rainfall distribution, and agricultural vulnerability.',
    category: 'overview',
  },

  // 2. MONSOON & CLIMATE
  {
    id: 'monsoon',
    name: 'Monsoon Dynamics',
    href: '/monsoon',
    icon: Compass,
    description: 'Onset tracking, break-monsoon spell detection, and ITCZ/BoB depression tracks.',
    category: 'monsoon-climate',
  },
  {
    id: 'climate',
    name: 'Climate Signals',
    href: '/climate',
    icon: Globe2,
    description: 'ENSO, IOD, MJO planetary oscillations and their teleconnection impacts on Koraput monsoon.',
    category: 'monsoon-climate',
  },
  {
    id: 'forecast',
    name: 'Forecast',
    href: '/forecast',
    icon: CloudRain,
    description: 'Downscaled 1-15 day ensemble precipitation, convection, and temperature forecasts per block.',
    category: 'monsoon-climate',
  },

  // 3. PRECIPITATION
  {
    id: 'rainfall',
    name: 'Rainfall',
    href: '/rainfall',
    icon: Droplets,
    description: 'Observed vs normal rainfall, cumulative deficits, and extreme precipitation risk.',
    category: 'precipitation',
  },
  {
    id: 'risk-map',
    name: 'Risk Map',
    href: '/risk-map',
    icon: MapPin,
    description: 'Interactive geospatial visualization of Koraput blocks, topography, and active warning zones.',
    category: 'precipitation',
  },

  // 4. AGRICULTURE
  {
    id: 'agriculture',
    name: 'Agriculture',
    href: '/agriculture',
    icon: Sprout,
    description: 'Soil moisture dynamics, Kharif sowing windows, and crop-specific moisture stress.',
    category: 'agriculture',
  },
  {
    id: 'advisories',
    name: 'Advisories',
    href: '/advisories',
    icon: ShieldAlert,
    description: 'Targeted farm-level advisories for paddy, mandia (ragi), maize, and highland pulses.',
    category: 'agriculture',
  },
  {
    id: 'farmer',
    name: 'Farmer Mode',
    href: '/farmer',
    icon: Sprout,
    description: 'Simplified advisory for farmers on low-end smartphones in Odia, Hindi, and English.',
    category: 'agriculture',
  },

  // 5. OPERATIONS
  {
    id: 'officer',
    name: 'Officer Command',
    href: '/officer',
    icon: Building,
    description: 'Information-dense decision support portal for District & Block Agriculture Officers.',
    category: 'operations',
  },
  {
    id: 'historical',
    name: 'Historical',
    href: '/historical',
    icon: History,
    description: 'Decadal onset dates, break spell frequencies, and IMD climatology (1970-2025).',
    category: 'operations',
  },
  {
    id: 'model-performance',
    name: 'Model Performance',
    href: '/model-performance',
    icon: Activity,
    description: 'Validation metrics, Brier scores, ROC curves, and lead-time accuracy validation.',
    category: 'operations',
  },

  // 6. DATA
  {
    id: 'data-sources',
    name: 'Data Sources',
    href: '/data-sources',
    icon: Database,
    description: 'Metadata on AWS stations, IMD Doppler, INSAT-3DR, ERA5, and GFS assimilation feeds.',
    category: 'data',
  },
  {
    id: 'data-explorer',
    name: 'Data Explorer',
    href: '/data-explorer',
    icon: Database,
    description: 'Inspect real datasets, IMD normals, data provenance, and quality statuses.',
    category: 'data',
  },
];

