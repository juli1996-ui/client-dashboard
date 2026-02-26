import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/instantly-proxy': {
        target: 'https://api.instantly.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/instantly-proxy/, ''),
      },
    },
  },
})
