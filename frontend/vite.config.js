import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nampackMockApiPlugin } from './mock-api.js'

export default defineConfig({
  plugins: [
    react(),
    nampackMockApiPlugin(),
  ],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/uploads': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
