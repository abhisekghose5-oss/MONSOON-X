/**
 * MONSOON-X - DESIGN SYSTEM TOKENS
 * 
 * Aesthetic: Indian Meteorological Operations Centre + Government Agro-DSS + GIS Platform
 * High clarity, WCAG AA/AAA compliant contrast, authoritative institutional palette.
 */

export const tokens = {
  colors: {
    // Primary Brand & Operational Tiers
    deepNavy: '#0B1F33',
    monsoonBlue: '#1479C9',
    agricultureGreen: '#247A4A',
    warningAmber: '#D99000',
    riskRed: '#C43D3D',

    // Surfaces & Backgrounds
    background: '#F5F7FA',
    surfaceCard: '#FFFFFF',
    surfaceSubtle: '#F0F3F7',
    surfaceElevated: '#FFFFFF',
    surfaceDark: '#0B1F33',

    // Text & Hierarchy
    textPrimary: '#16202A',
    textSecondary: '#4B5B6D',
    textMuted: '#6E7F94',
    textInverse: '#FFFFFF',
    textInverseMuted: '#A3B4C8',

    // Structural Borders
    borderSubtle: '#E2E8F0',
    borderDefault: '#CBD5E1',
    borderStrong: '#94A3B8',
    borderDark: '#1E354D',

    // Extended Semantic Palettes
    navy: {
      50: '#EAF0F6',
      100: '#D2DEEB',
      200: '#A4BCDA',
      300: '#7599C8',
      400: '#4777B7',
      500: '#0B1F33', // Primary Deep Navy
      600: '#091A2B',
      700: '#071523',
      800: '#050F1A',
      900: '#030A12',
    },
    monsoon: {
      50: '#EDF6FC',
      100: '#D5EBF8',
      200: '#ACD5F2',
      300: '#7BBAE9',
      400: '#439EE0',
      500: '#1479C9', // Primary Monsoon Blue
      600: '#1063A6',
      700: '#0C4E83',
      800: '#08385E',
      900: '#04223A',
    },
    agriculture: {
      50: '#EDF7F1',
      100: '#D5ECE0',
      200: '#ABD7C0',
      300: '#79BF9B',
      400: '#4BA676',
      500: '#247A4A', // Primary Agriculture Green
      600: '#1C633C',
      700: '#154D2F',
      800: '#0E3621',
      900: '#072014',
    },
    warning: {
      50: '#FDF7EB',
      100: '#FAECD0',
      200: '#F4D79C',
      300: '#EEC164',
      400: '#E5A92E',
      500: '#D99000', // Primary Warning Amber
      600: '#B37700',
      700: '#8C5D00',
      800: '#664400',
      900: '#402B00',
    },
    risk: {
      50: '#FCEDEC',
      100: '#F7D6D5',
      200: '#EEA9A7',
      300: '#E27673',
      400: '#D54F4B',
      500: '#C43D3D', // Primary Risk Red
      600: '#A33131',
      700: '#802626',
      800: '#5C1B1B',
      900: '#381010',
    },
  },

  chartColors: {
    rainfallObserved: '#1479C9',
    rainfallNormal: '#7599C8',
    rainfallDeficit: '#D99000',
    rainfallExcess: '#08385E',
    soilMoistureOptimal: '#247A4A',
    soilMoistureStress: '#D99000',
    soilMoistureDeficit: '#C43D3D',
    ensembleMean: '#0B1F33',
    ensemblePercentile: '#ACD5F2',
    temperatureMax: '#C43D3D',
    temperatureMin: '#1479C9',
    gridLines: '#E2E8F0',
  },

  riskLevels: {
    nominal: {
      label: 'Nominal Conditions',
      shortLabel: 'Nominal',
      color: '#247A4A',
      bgColor: '#EDF7F1',
      borderColor: '#ABD7C0',
      textColor: '#154D2F',
    },
    watch: {
      label: 'Meteorological Watch',
      shortLabel: 'Watch',
      color: '#1479C9',
      bgColor: '#EDF6FC',
      borderColor: '#ACD5F2',
      textColor: '#0C4E83',
    },
    alert: {
      label: 'Agro-Climate Advisory',
      shortLabel: 'Advisory',
      color: '#D99000',
      bgColor: '#FDF7EB',
      borderColor: '#F4D79C',
      textColor: '#8C5D00',
    },
    warning: {
      label: 'Severe Warning',
      shortLabel: 'Warning',
      color: '#C43D3D',
      bgColor: '#FCEDEC',
      borderColor: '#EEA9A7',
      textColor: '#802626',
    },
  },

  typography: {
    fontSans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontDisplay: 'Inter, sans-serif',
  },

  spacing: {
    cardPadding: '1.25rem', // 20px
    sectionGap: '1.5rem',   // 24px
    itemGap: '0.75rem',     // 12px
    inlineGap: '0.5rem',    // 8px
  },

  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    pill: '9999px',
  },

  shadows: {
    card: '0 1px 3px 0 rgba(11, 31, 51, 0.06), 0 1px 2px 0 rgba(11, 31, 51, 0.04)',
    elevated: '0 4px 6px -1px rgba(11, 31, 51, 0.08), 0 2px 4px -1px rgba(11, 31, 51, 0.04)',
    nav: '0 2px 4px 0 rgba(11, 31, 51, 0.04)',
  },
} as const;

export type DesignTokens = typeof tokens;
export type RiskLevelKey = keyof typeof tokens.riskLevels;
