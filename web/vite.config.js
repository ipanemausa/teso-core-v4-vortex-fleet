import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Changed to absolute path for Fly.io root deployment
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
})
