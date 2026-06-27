import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 1. Premium Path Aliases for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 3. Enterprise Build Optimizations
  build: {
    target: 'esnext', // Optimizes for modern browsers
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Splits heavy Web3 and React libraries into their own cached chunks
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'stacks-vendor': ['@stacks/connect', '@stacks/transactions', '@stacks/network'],
        },
      },
    },
  },
})