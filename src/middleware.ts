// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="SOS24ORE Admin"' },
  });
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // 0) Escludi asset, API e file statici (non toccare niente lì)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(?:ico|svg|png|jpg|jpeg|webp|gif|css|js|map|txt|xml)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 1) BASIC AUTH per /admin (prima di qualsiasi redirect SEO)
  if (pathname.startsWith("/admin")) {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Basic ")) return unauthorized();

    try {
      // Edge runtime: usa atob, non Buffer
      const base64 = auth.split(" ")[1] || "";
      const decoded = globalThis.atob ? globalThis.atob(base64) : "";
      const [user, pass] = decoded.split(":");
      const ok =
        user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD;

      // niente normalizzazioni SEO sulle route admin: evitiamo redirect fastidiosi
      return ok ? NextResponse.next() : unauthorized();
    } catch {
      return unauthorized();
    }
  }

  // 2) NORMALIZZAZIONE SEO (solo per le pagine pubbliche)
  const original = pathname;

  // 2.1 lowercase
  let normalized = original.toLowerCase();

  // 2.2 rimuovi trailing slash (tranne root)
  if (normalized !== "/" && normalized.endsWith("/")) {
    normalized = normalized.replace(/\/+$/, "");
  }

  // 2.3 comprimi doppie slash
  normalized = normalized.replace(/\/{2,}/g, "/");

  if (normalized !== original) {
    url.pathname = normalized; // querystring/hash intatti
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Applica a tutte le pagine (escludendo asset/api/file)
export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
