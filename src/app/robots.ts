// src/app/robots.ts
import type { MetadataRoute } from "next";

/**
 * Robots pro-SEO (pulito e coerente)
 * - Evita duplicati con parametri di tracking per TUTTI i bot principali
 * - Blocca aree tecniche
 * - Mantiene GPTBot/CCBot aperti sul pubblico (puoi chiuderli quando vuoi)
 */
export default function robots(): MetadataRoute.Robots {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sos24ore.it";

  const DISALLOW_COMMON = [
    "/admin",
    "/api/",
    "/_diag",
    "/chat/test",
    "/revalidate",
    "/upload",
    "/Nuova%20cartella", // eventuale cartella “accidentale”
  ];

  // Parametri sporchi / duplicazioni
  const DISALLOW_DIRTY_QUERIES = [
    "/*?*utm_*",
    "/*?*gclid=*",
    "/*?*fbclid=*",
    "/*?*ref=*",
  ];

  const ALL_DISALLOWS = [...DISALLOW_COMMON, ...DISALLOW_DIRTY_QUERIES];
  const ALLOW_ALL = ["/"];

  const sitemaps = [
    `${SITE}/sitemap.xml`,
    // aggiungi qui altre sitemap se le generi davvero
  ];

  return {
    rules: [
      // Fallback universale (copre anche Googlebot standard)
      {
        userAgent: "*",
        allow: ALLOW_ALL,
        disallow: ALL_DISALLOWS,
      },

      // Bot Google specializzati
      { userAgent: "Googlebot-Image", allow: ALLOW_ALL, disallow: ALL_DISALLOWS },
      { userAgent: "Googlebot-News",  allow: ALLOW_ALL, disallow: ALL_DISALLOWS },
      { userAgent: "Googlebot-Video", allow: ALLOW_ALL, disallow: ALL_DISALLOWS },
      { userAgent: "AdsBot-Google",   allow: ALLOW_ALL, disallow: ALL_DISALLOWS },

      // Bing
      { userAgent: "bingbot", allow: ALLOW_ALL, disallow: ALL_DISALLOWS, crawlDelay: 2 },

      // DuckDuckGo / Yandex
      { userAgent: "DuckDuckBot", allow: ALLOW_ALL, disallow: ALL_DISALLOWS },
      { userAgent: "Yandex",      allow: ALLOW_ALL, disallow: ALL_DISALLOWS, crawlDelay: 2 },

      // Bot AI (aperti sul pubblico, bloccate solo aree tecniche)
      { userAgent: "GPTBot", allow: ALLOW_ALL, disallow: DISALLOW_COMMON },
      { userAgent: "CCBot",  allow: ALLOW_ALL, disallow: DISALLOW_COMMON },
    ],
    sitemap: sitemaps,
    host: SITE,
  };
}
