import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  resolve: {
    dedupe: ['three', 'react', 'react-dom'],
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },

  build: {
    target: 'esnext',
    // The three.js + react-three-fiber vendor chunk is ~920 KB minified
    // (~250 KB gzipped). That's the floor for a WebGL site, not a mistake.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Vendor code changes far less often than the site's own code. Separate
        // chunks let returning visitors keep them cached across deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](three|three-stdlib|@react-three|maath)[\\/]/.test(id)) return 'three';
          if (/[\\/]node_modules[\\/](gsap|@gsap|lenis)[\\/]/.test(id)) return 'motion';
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
});
