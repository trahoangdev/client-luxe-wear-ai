/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    DASHBOARD_BASE_URL: process.env.DASHBOARD_BASE_URL
  }
};

export default nextConfig;
