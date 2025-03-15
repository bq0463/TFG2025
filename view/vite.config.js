import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      auto: true, // Activa CSS Modules automáticamente en archivos `.module.css`
    },
  },
})
