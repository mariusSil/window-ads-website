/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: 'standalone', // Disabled for Vercel deployment
  // Enable compression for better performance
  compress: true,
  poweredByHeader: false,
  
  // Additional compression and performance settings
  swcMinify: true,
  productionBrowserSourceMaps: true,
  
  // Bundle optimization and compression
  experimental: {
    gzipSize: true,
    webpackBuildWorker: false, // Disabled to prevent stack overflow
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      'react-hook-form',
      'zod'
    ],
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
  generateEtags: false,
  
  // Webpack configuration to prevent stack overflow and optimize compression
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Only apply optimizations in production to avoid dev issues
    if (!dev) {
      // Enhanced compression and optimization
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: -5,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Add compression plugin for webpack
      const CompressionPlugin = require('compression-webpack-plugin');
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8,
        })
      );
    }

    return config;
  },
  
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first for better compression
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
    // quality: 85, // Not supported in Next.js 14
  },
  
  // Add caching headers for better performance
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
