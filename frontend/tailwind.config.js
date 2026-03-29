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
        obsidian: {
          DEFAULT: '#1A202C',
          dark: '#0A1118',
        },
        cyan: {
          electric: '#00E5FF',
        },
        verify: {
          green: '#4ADE80',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'system-ui'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 229, 255, 0.3)',
        'cyan-glow-lg': '0 0 35px rgba(0, 229, 255, 0.4)',
        // New: Subtle glass border glow
        'glass-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      // --- NEW: PREMIUM ANIMATIONS ---
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
