import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tamara - Real Brand Colors
        tamara: {
          DEFAULT: '#8B00EF', // Purple Bright
          light: '#F933A1',   // Pink
          dark: '#370A56',    // Purple Dark
          mid: '#7121AF',     // Purple Mid
          purple: '#8B00EF',
          pink: '#F933A1',
        },
        // Tabby - Real Brand Colors
        tabby: {
          DEFAULT: '#3BFF9D',  // Primary Green (Neon)
          light: '#3EEDBF',    // Light Green (Progress Bar)
          dark: '#131C26',     // Dark Text
          gray: '#DFE5EB',     // Border Gray
          blue: '#1976d2',     // Blue Accent
          green: '#3BFF9D',
        },
      },
      fontFamily: {
        // Real Brand Fonts
        'tamara': ['IBMPlexSans', 'Ibmplexsansarabic', 'Open Sans', 'sans-serif'],
        'tabby': ['IBM Plex Mono', 'IBM Plex Sans Arabic', 'Inter', 'sans-serif'],
        // Fallback Arabic
        'arabic': ['Ibmplexsansarabic', 'Noto Kufi Arabic', 'sans-serif'],
        // Secondary fonts
        'inter': ['Inter', 'sans-serif'],
        'plex': ['IBM Plex Sans', 'sans-serif'],
      },
      backgroundImage: {
        'tamara-gradient': 'linear-gradient(104deg, #370A56 0%, #7121AF 29%, #8B00EF 59.79%, #F933A1 96.99%)',
        'tabby-gradient': 'linear-gradient(90deg, #3BFF9D 0%, #3EEDBF 100%)',
      },
      borderRadius: {
        'tabby': '24px', // Tabby pill-shaped buttons
      },
      boxShadow: {
        'tabby': '0px 0px 4px 0px #131C2620',
        'tabby-lg': '0px 4px 12px 0px #131C2633',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'neon-glow': 'neonGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        neonGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #3BFF9D' },
          '50%': { boxShadow: '0 0 20px #3BFF9D, 0 0 30px #3BFF9D' },
        },
      },
    },
  },
  plugins: [],
}
export default config
