/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001", // Your backend server port in development
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "your-api-domain.com", // Your production API domain
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
