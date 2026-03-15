import type { NextConfig } from 'next'

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.replace(/^https?:\/\//, ''))
  : ['localhost:3000', 'localhost']

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
}

export default nextConfig
