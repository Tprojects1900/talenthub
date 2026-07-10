import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy' // 👈 OBLIGATOIRE : Il manquait cette importation !

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      // ios >= 12 couvre une très large gamme d'anciens iPads (ex: iPad Air 1, iPad mini 2, etc.)
      targets: ['ios >= 12', 'safari >= 12', 'defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: [
      {
        // Intercepte uniquement l'import exact "@apollo/client/link"
        find: /^@apollo\/client\/link$/,
        replacement: '@apollo/client',
      },
    ],
  },
  optimizeDeps: {
    // Force Vite à charger Apollo directement sans le pré-bundler
    exclude: ['apollo-upload-client'],
  },
  build: {
    // Sécurise la génération du bundle de base avant l'application des polyfills legacy
    target: 'es2020',
  }
})