import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Proxy /instantly-proxy/* → https://api.instantly.ai/*
app.use(
  '/instantly-proxy',
  createProxyMiddleware({
    target: 'https://api.instantly.ai',
    changeOrigin: true,
    pathRewrite: { '^/instantly-proxy': '' },
  })
)

// Serve built React app
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback — all routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
