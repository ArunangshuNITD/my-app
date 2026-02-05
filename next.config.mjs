/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // <--- DISABLES DOUBLE RENDERING
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;