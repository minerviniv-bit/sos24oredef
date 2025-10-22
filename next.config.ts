// next.config.ts
import type { NextConfig } from "next";

// domini usati dal Maps Embed
const GOOGLE_FRAME = [
  "https://www.google.com",
  "https://www.google.it",
  "https://maps.google.com",
];
const GOOGLE_SCRIPT = [
  "https://www.google.com",
  "https://maps.googleapis.com",
];
const GOOGLE_STYLE = ["https://fonts.googleapis.com"];
const GOOGLE_CONNECT = [
  "https://www.google.com",
  "https://maps.googleapis.com",
];
const GOOGLE_IMG = [
  "https://www.google.com",
  "https://maps.gstatic.com",
  "https://lh3.googleusercontent.com",
  "https://lh4.googleusercontent.com",
  "https://lh5.googleusercontent.com",
  "https://lh6.googleusercontent.com",
  "https://*.ggpht.com",
];

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Non influisce sull'iframe che TU incorpori; lascia pure SAMEORIGIN
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },

  // !!! CSP aggiornata con frame-src e whitelist Google
  {
    key: "Content-Security-Policy",
    value: [
      // regola di base
      "default-src 'self'",

      // script (non necessario per l'iframe semplice, ma utile se un domani usi l'API JS)
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https: ${GOOGLE_SCRIPT.join(" ")}`,

      // stili (font Google)
      `style-src 'self' 'unsafe-inline' https: ${GOOGLE_STYLE.join(" ")}`,

      // immagini (larga compatibilità)
      `img-src 'self' blob: data: https: ${GOOGLE_IMG.join(" ")}`,

      // font
      "font-src 'self' data: https:",

      // richieste XHR/fetch
      `connect-src 'self' https: ${GOOGLE_CONNECT.join(" ")}`,

      // 🔴 fondamentale per permettere l'EMBED della mappa
      `frame-src 'self' ${GOOGLE_FRAME.join(" ")}`,

      // opzionali, coerenti con la tua policy
      "frame-ancestors 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "yddrbexwqyztyhqfdiej.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // (non necessario per l'iframe, ma utile se un domani usi immagini Google in <Image/>)
      { protocol: "https", hostname: "maps.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh4.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh5.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh6.googleusercontent.com", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:all*.(png|jpg|jpeg|webp|svg|gif|ico|css|js|woff|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  async redirects() {
    return [{ source: "/index.html", destination: "/", permanent: true }];
  },
};

export default nextConfig;
