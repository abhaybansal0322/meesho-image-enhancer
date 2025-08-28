/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Let sharp be resolved at runtime on the server (native module)
    config.externals = config.externals || [];
    config.externals.push({ sharp: 'commonjs sharp' });
    return config;
  },
};

module.exports = nextConfig;
