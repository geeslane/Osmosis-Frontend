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
    domains: [
      'i.pravatar.cc',
      'www.gstatic.com',
      'lh3.googleusercontent.com',
      'via.placeholder.com',
      'res.cloudinary.com',
    ],
  },
};

export default nextConfig;
