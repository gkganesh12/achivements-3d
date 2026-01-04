import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    // Dedupe React packages to ensure single instance
    dedupe: ['react', 'react-dom', '@react-three/fiber', '@react-three/drei', 'three']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@react-three/fiber',
      '@react-three/drei',
      'three'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep React and R3F together
          'react-vendor': ['react', 'react-dom'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
          'three-vendor': ['three']
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext'
  }
})
