// src/app/(admin)/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const active = ready && pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`block rounded-xl px-3 py-2 text-sm transition hover:bg-white/5 ${
        active ? "bg-white/10 font-medium" : "text-neutral-300"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminNav() {
  return (
    <nav className="space-y-1">
      <NavItem href="/admin" label="Dashboard" />
      <NavItem href="/admin/assignments" label="Assegnazioni" />
      <NavItem href="/admin/clients" label="Clienti" />
      <NavItem href="/admin/administration" label="Amministrazione" />
      <NavItem href="/admin/seo" label="SEO" />
    </nav>
  );
}
