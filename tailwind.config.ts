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
          surfaceAlt: '#262626',
          text: '#ffffff',
          muted: '#cbd5e1',
          submuted: '#94a3b8',
          border: '#2e2e2e',
          borderLight: '#383838',
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
        sans: ['var(--font-sans)', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-sans)', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
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
