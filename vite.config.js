import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be sent to Spring Boot
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})