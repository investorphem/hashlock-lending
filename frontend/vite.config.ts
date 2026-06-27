import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path
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