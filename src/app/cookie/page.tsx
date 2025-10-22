// src/app/cookie/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import LegalPageShell from "@/app/_shared/legal/LegalPageShell";
import CookieClient from "./CookieClient";

export const revalidate = 86400;

/** Base URL runtime-safe (dev: http://localhost:3000, prod: https) */
async function runtimeBaseUrl() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
}

const TITLE = "Cookie Policy | SOS24ORE.it";
const DESC =
  "Uso dei cookie tecnici e, se presenti, analitici/marketing con consenso.";

export async function generateMetadata(): Promise<Metadata> {
  const SITE = await runtimeBaseUrl();
  return {
    title: TITLE,
    description: DESC,
    alternates: { canonical: `${SITE}/cookie` },
    robots: { index: true, follow: true },
    openGraph: {
      title: TITLE,
      description: DESC,
      url: `${SITE}/cookie`,
      siteName: "SOS24ORE.it",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESC,
    },
  };
}

export default function Page() {
  const lastUpdate = new Date().toISOString().slice(0, 10);
  return (
    <LegalPageShell title="Cookie Policy" lastUpdate={lastUpdate}>
      <CookieClient />
    </LegalPageShell>
  );
}
