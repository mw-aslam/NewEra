import path from 'path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // Lint is run explicitly via `npm run lint`; a lint warning must not
    // silently fail a production build.
    ignoreDuringBuilds: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
};

export default config;
