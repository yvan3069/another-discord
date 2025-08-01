/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uy22brlajc.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
