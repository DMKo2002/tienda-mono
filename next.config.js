/** @type {import('next').NextConfig} */
const { withBotId } = require('botid/next/config')

const securityHeaders = [
  // X-Frame-Options omitido intencionalmente: estos storefronts se embeben
  // en el onboarding del Panel Admin como previews. El Panel Admin sí tiene SAMEORIGIN.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig = {
  transpilePackages: ['@creart/tienda-core'],
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  images: {
    // Next 16 solo permite los quality listados acá (default [75]); sin esto quality={90} se ignora.
    qualities: [75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: '*' },
    ],
  },
}

module.exports = withBotId(nextConfig)
