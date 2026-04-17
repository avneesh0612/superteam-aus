/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.lumacdn.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
    ]
  }
};

export default nextConfig;
