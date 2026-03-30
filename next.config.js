/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/generate-pdf': ['./node_modules/pdfkit/js/data/**/*'],
    },
  },
  webpack: (config) => {
    // pdfkit + fontkit compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;
