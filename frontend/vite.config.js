import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion', 'lottie-react'],
          icons: ['react-icons', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
