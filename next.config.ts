import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
      },
      { protocol: 'https', hostname: 'osmosis-backend.onrender.com' },
    ],
  },
  // Optimize dev server performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
  // Reduce TypeScript checking in dev mode
  typescript: {
    // Type checking is handled by ESLint in CI/CD
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
