// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/app/_shared/Header";
import Footer from "@/app/_shared/Footer";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: "SOS24ORE.it – Emergenze H24 in tutta Italia",
    template: "%s | SOS24ORE.it",
  },
  description:
    "SOS24ORE.it ti mette in contatto con un professionista H24 in tutta Italia. Numero Verde 800 00 24 24.",
  metadataBase: new URL("https://www.sos24ore.it"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SOS24ORE.it",
    url: "https://www.sos24ore.it",
    logo: "https://www.sos24ore.it/logos/logo.webp",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+39-800002424",
        contactType: "customer service",
        areaServed: "IT",
        availableLanguage: ["Italian"],
      },
    ],
    sameAs: [] as string[],
  };

  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0B1220] text-white antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}

