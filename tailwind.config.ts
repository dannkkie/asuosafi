import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        material: {
          blue: '#1a73e8',
          blueHover: '#1557b0',
          bg: '#f8f9fa',
          surface: '#ffffff',
          text: '#1f2124',
          muted: '#5f6368',
          border: '#e0e2e6',
          green: '#1e8e3e',
          amber: '#f9ab00',
          red: '#d93025',
        },
        netflix: {
          red: '#e50914',
          redHover: '#b80710',
          bg: '#141414',
          surface: '#1f1f1f',
          surfaceAlt: '#221f1f',
          text: '#f5f5f1',
          muted: '#a3a3a3',
          border: '#2a2a2a',
          borderLight: '#333333',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          700: '#15803d',
        },
        ochre: {
          50: '#fffbeb',
          100: '#fef3c7',
          600: '#d97706',
          700: '#b45309',
        },
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Plus Jakarta Sans"', '"Geist Sans"', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', '"Bebas Neue"', '"Geist Mono"', 'Impact', 'sans-serif'],
        mono: ['"SF Mono"', '"Geist Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'material': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'material-hover': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
      }
    },
  },
  plugins: [],
};

export default config;
