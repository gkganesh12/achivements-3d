import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'scheduler', 'react-reconciler'],
    conditions: ['import', 'module', 'browser', 'default']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'scheduler',
      'react-reconciler',
      '@react-three/fiber',
      '@react-three/drei'
    ],
    force: true
  },
  build: {
    commonjsOptions: {
      include: [/react-reconciler/, /node_modules/]
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // CRITICAL: Keep ALL React code in ONE chunk to prevent multiple instances
          if (id.includes('node_modules')) {
            // Keep @react-three packages with React to ensure reconciler works
            if (id.includes('@react-three')) {
              return 'vendor';
            }
            // Separate three.js into its own chunk (large library)
            if (id.includes('three') && !id.includes('@react-three')) {
              return 'three-vendor';
            }
            // Everything else (including all React code) goes into one vendor chunk
            // This ensures React loads first and all dependencies are available
            return 'vendor';
          }
        },
        // Ensure proper chunk loading order
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Preserve R3F reconciler - don't tree-shake it
      treeshake: {
        preset: 'smallest',
        moduleSideEffects: (id) => {
          // Preserve R3F and reconciler modules
          return id.includes('@react-three/fiber') || 
                 id.includes('react-reconciler') ||
                 id.includes('@react-three/drei');
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    // Ensure source maps are disabled for production (can cause issues)
    sourcemap: false,
    // Minify for production
    minify: 'esbuild',
    // Preserve module structure for R3F
    target: 'esnext',
    modulePreload: false
  }
})
