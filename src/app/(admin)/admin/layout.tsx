// src/app/(admin)/admin/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminNav from "./AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="admin-shell min-h-screen bg-[#050B18] text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050B18]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            SOS24ORE · Admin
          </Link>

          {/* prima era <a href="/">…</a> */}
          <Button asChild variant="secondary">
            <Link href="/">← Torna al sito</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6">
        <aside className="col-span-12 lg:col-span-3">
          <Card className="bg-white/5">
            <CardContent className="p-3">
              <AdminNav />
            </CardContent>
          </Card>
        </aside>

        <section className="col-span-12 lg:col-span-9">{children}</section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-neutral-400">
        SOS24ORE Admin · {year}
      </footer>
    </div>
  );
}

