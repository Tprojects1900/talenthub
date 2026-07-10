import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['ios >= 11', 'safari >= 11', 'defaults', 'not IE 11'],
      modernPolyfills: true,
      renderLegacyChunks: true
    }),
  ],
  resolve: {
    alias: [
      { find: /^@apollo\/client\/link$/, replacement: '@apollo/client' },
    ],
  },
  optimizeDeps: {
    exclude: ['apollo-upload-client'],
  },
  build: {
    // 1. Force la compilation en ES2015 (ES6 standard), supporté par les anciens iPads
    target: 'es2015',
    cssTarget: ['ios11', 'safari11'],
    
    // 2. Désactive les préchargements de modules natifs de Vite qui font planter WebKit
    polyfillModulePreload: false,
    
    minify: 'terser', // Plus robuste pour le code legacy
    rollupOptions: {
      output: {
        // Format standard hautement compatible
        format: 'es',
      }
    }
  }
})