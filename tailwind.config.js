/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        railway: {
          dark: '#080C14',
          cardDark: '#0F172A',
          cardDarkHover: '#17223B',
          borderDark: '#1E293B',
          navy: '#0B1E36',
          navyLight: '#163156',
          maroon: '#801820',
          maroonBright: '#A61E28',
          track: '#475569',
          green: '#10B981',
          greenGlow: '#059669',
          amber: '#F59E0B',
          red: '#EF4444',
          traction: '#0284C7',
          cyan: '#06B6D4',
          gold: '#FBBF24',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'train-scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
