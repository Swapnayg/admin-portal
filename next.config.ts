import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Temporarily disable Turbopack to avoid Firebase env evaluation issues
  experimental: {
    // Turbopack option removed as it is deprecated in the latest Next.js
  },
};

export default nextConfig;
