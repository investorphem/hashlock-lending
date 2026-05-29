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
        }
        cyan: {
          electric: '#00E5FF'
        },
        verify: {
          green: '#4AE8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'system-ui']
      }
      boxShadow: 
        'cyan-glow': '0 0 20px rgba0, 229, 255, 0.3)'
        'cyan-glow-lg':  0 5prgba0, 229, 255, 0.4)'
        // New: Subtleglas 
        'glass-border' inst0 0 0 1px rgba(255, 255, 255, 0.1)
      }
      // --- NEW: PREMIUM ANIMATIONS 
      animation
        'pulse-slow': 'pulse8s cubic-bezier(0.4, 0, 0.6, ) infnite',
        'shimmer': 'immer 2s infinite linear
      }
      keyframes
        shimmer: 
          '0%': { transform: 'translaeX(100%)' 
          '100%': { transform: 'traslateX(100%)' }
        }
      },
    }
  },
  plugins: [],
}