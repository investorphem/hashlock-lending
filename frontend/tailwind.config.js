/** @type {import('tailwindcss').Config} */
export default {
  // Tells Tailwind exactly which files to scan for classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 'class' allows us to manually toggle dark mode via the button in App.tsx
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Your Premium Brand Palette
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
        // Custom premium glows for buttons and cards
        'cyan-glow': '0 0 20px rgba(0, 229, 255, 0.3)',
        'cyan-glow-lg': '0 0 35px rgba(0, 229, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
