/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['redis'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Configuración para páginas dinámicas
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig