import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  cacheDir: '../vite-cache',  // ← ye line important — OneDrive ke bahar cache banega
  server: {
    watch: {
      usePolling: true   // ← ye bhi rakho for extra safety
    }
  }
})