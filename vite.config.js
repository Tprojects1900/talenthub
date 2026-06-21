import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  
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
  }
})



