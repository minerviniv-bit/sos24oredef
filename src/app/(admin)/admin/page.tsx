// app/(admin)/admin/page.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Tre funzioni: Assegnazioni → Amministrazione → SEO.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-white/5">
          <CardHeader>
            <CardTitle>Assegnazioni</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-neutral-300">
              Collega clienti a servizio → città → area. Ricerca zone, vedi assegnazioni.
            </p>
            <Button asChild><Link href="/admin/assignments">Apri</Link></Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5">
          <CardHeader>
            <CardTitle>Clienti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-neutral-300">
              Crea/modifica cliente, logo, descrizione (≤ 800 battute).
            </p>
            <Button asChild><Link href="/admin/clients">Apri</Link></Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5">
          <CardHeader>
            <CardTitle>Amministrazione</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-neutral-300">
              Pacchetti zone/telefonate con anteprima importi.
            </p>
            <Button asChild><Link href="/admin/administration">Apri</Link></Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 md:col-span-3">
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-neutral-300">
              GPT-4o-mini per locali, GPT-4o per città. Genera → salva → pubblica.
            </p>
            <Button asChild><Link href="/admin/seo">Apri</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

