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
    target: 'es2020',
    // 👈 AJOUTE CECI : Demande à Vite et LightningCSS de transpiler le CSS pour ton vieil iPad
    cssTarget: ['ios12', 'safari12']
  }
})