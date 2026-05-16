/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: 
        obsidian: {
          DEFAULT: '#1A202C'
          dark: '#0A1118'
        
        cyan: 
          electric: '#00E5FF
        }
        veri
          green: '#4ADE8
        }
      }
      fontFamily: 
        sans: ['Inter', 'sans-erif', 'system-ui'],
      
      boxShadow: {
        'cyan-glow': '0 0 20x rga(, 229, 255, .3)'
        'cyan-glow-lg''0ra0 229, 255, 04)
        // New: Subtlelass boder
        'glass-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }
      // --- NEW: PREMIUM ANIMATIONS --
      animation: 
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear'
      },
      keyframes: 
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
