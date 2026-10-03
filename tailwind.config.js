/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Command Center System Colors
        'navy-deep': '#0A192F',
        'navy-cmd': '#0B1F33',
        'monsoon-blue': '#0284C7',
        'monsoon-dark': '#0369A1',
        'agri-green': '#15803D',
        'agri-dark': '#166534',
        'warning-amber': '#D97706',
        'warning-dark': '#B45309',
        'risk-red': '#DC2626',
        'risk-dark': '#B91C1C',
        'bg-app': '#F8FAFC',
        'text-app': '#0F172A',

        // Extended Institutional Palettes
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#0A192F', // Deep Navy / Midnight Blue
          600: '#091528',
          700: '#071221',
          800: '#050D19',
          900: '#030810',
        },
        monsoon: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0284C7', // Monsoon Blue
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
          900: '#082F49',
        },
        agriculture: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#15803D', // Agricultural Green
          600: '#166534',
          700: '#14532D',
          800: '#052E16',
          900: '#021F0D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706', // Warning Amber
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        risk: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#DC2626', // Risk Red
          600: '#B91C1C',
          700: '#991B1B',
          800: '#7F1D1D',
          900: '#450A0A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
          'border-strong': '#CBD5E1',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          '"Plus Jakarta Sans"',
          'Inter',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'gov-card': '0 1px 3px 0 rgba(10, 25, 47, 0.05), 0 1px 2px -1px rgba(10, 25, 47, 0.03)',
        'gov-elevated': '0 4px 12px -2px rgba(10, 25, 47, 0.08), 0 2px 6px -2px rgba(10, 25, 47, 0.05)',
        'command-panel': '0 12px 30px -6px rgba(7, 19, 36, 0.35), 0 4px 12px -3px rgba(7, 19, 36, 0.2)',
        'hud-glow': '0 0 15px rgba(2, 132, 199, 0.15)',
        'subtle-border': 'inset 0 0 0 1px rgba(226, 232, 240, 0.8)',
      },
      borderRadius: {
        'gov-xs': '3px',
        'gov-sm': '5px',
        'gov-md': '8px',
        'gov-lg': '10px',
      },
    },
  },
  plugins: [],
}

