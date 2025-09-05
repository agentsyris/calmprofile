/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static exports for better SEO
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['calmprofile.vercel.app'],
  },