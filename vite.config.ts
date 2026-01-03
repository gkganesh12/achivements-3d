import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // CRITICAL: Keep ALL React code in ONE chunk to prevent multiple instances
          if (id.includes('node_modules')) {
            // All React-related code must be in the same chunk
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('react/jsx')) {
              return 'react-vendor';
            }
            if (id.includes('three')) {
              return 'three-vendor';
            }
            if (id.includes('@react-three')) {
              return 'react-three-vendor';
            }
            if (id.includes('zustand')) {
              return 'utils-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500
  }
})
