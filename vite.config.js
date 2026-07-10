import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      // On cible très large pour inclure toutes les versions de Safari mobiles
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
    // 1. Force la compilation en ES2015 (ES6 standard), supporté par TOUS les iPads
    target: 'es2015',
    cssTarget: ['ios11', 'safari11'],
    
    // 2. ⚠️ LA LIGNE CRUCIALE : Désactive le mécanisme d'import dynamique natif de Vite 
    // qui fait planter le moteur WebKit de l'iPad
    polyfillDynamicImportOnHtml: false,
    
    minify: 'terser', // Force l'utilisation de terser (plus robuste pour le code legacy)
    rollupOptions: {
      output: {
        // Simplifie le format pour éviter les syntaxes de modules trop complexes au runtime
        format: 'powerview' as any || 'iife' as any || 'es',
      }
    }
  }
})