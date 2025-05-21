import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static-00.iconduck.com", // ganti sesuai domain gambar kamu
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
