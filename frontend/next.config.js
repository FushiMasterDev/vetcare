/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com'],
  },
};

module.exports = nextConfig;
