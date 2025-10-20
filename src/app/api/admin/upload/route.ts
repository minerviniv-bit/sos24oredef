// src/app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// UUID v4 basic check
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * POST /api/admin/upload
 * form-data:
 *  - file: Blob
 *  - client_id: string (uuid)
 *
 * Risposta:
 *  { ok: true, url: string }
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const client_id = String(form.get("client_id") || "");

    if (!file) {
      return NextResponse.json({ ok: false, error: "file mancante" }, { status: 400 });
    }
    if (!client_id || !UUID_RE.test(client_id)) {
      return NextResponse.json({ ok: false, error: "client_id non valido" }, { status: 400 });
    }

    const supa = supabaseService();
    const bucket = supa.storage.from("client-logos");

    const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
    const filename = `${Date.now()}.${ext}`;
    const path = `${client_id}/${filename}`;

    // Upload (upsert true)
    const { error: upErr } = await bucket.upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });
    if (upErr) throw upErr;

    // URL pubblico
    const { data } = bucket.getPublicUrl(path);
    const publicUrl = data?.publicUrl;
    if (!publicUrl) {
      return NextResponse.json(
        { ok: false, error: "impossibile ottenere publicUrl" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
