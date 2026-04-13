import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/:clinicSlug',
        has: [
          {
            type: 'host',
            value: 'demos.agentminds.io',
          },
        ],
        destination: '/demo/:clinicSlug',
      },
    ];
  },
};

export default nextConfig;
