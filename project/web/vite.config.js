import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // equivalent to 0.0.0.0
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,   // important for github.dev forwarded https host
      protocol: 'wss'
    }
  }
})
