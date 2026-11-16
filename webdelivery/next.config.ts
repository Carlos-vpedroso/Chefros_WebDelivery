import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // Adicione Cloudinary se for usar
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // 🔽🔽🔽 ADICIONE ESTAS CONFIGURAÇÕES 🔽🔽🔽
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3333/api/:path*", // Seu backend na porta 3333
      },
    ];
  },

  // Opcional: Para evitar problemas de CORS em desenvolvimento
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
