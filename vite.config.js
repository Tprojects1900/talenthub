import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['ios >= 12', 'safari >= 12', 'defaults', 'not IE 11'],
      // 👈 FORCE l'injection des polyfills indispensables (comme globalThis, Symbol, etc.)
      modernPolyfills: true, 
      renderLegacyChunks: true
    }),
  ],
  resolve: {
    alias: [
      { find: /^@apollo\/client\/link$/, replacement: '@apollo/client' },
    ],
  },
  server: {
    // Évite les bugs de cache agressif pendant vos tests sur iPad
    fs: { strict: false }
  },
  build: {
    target: 'es2015', // 👈 On descend la cible générale à ES2015 pour maximiser la compatibilité
    cssTarget: ['ios12', 'safari12'],
    commonjsOptions: {
      // Force la conversion des syntaxes modules même dans les dépendances récalcitrantes
      transformMixedEsModules: true, 
    }
  }
})