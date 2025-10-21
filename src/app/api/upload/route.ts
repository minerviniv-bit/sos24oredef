// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = process.env.CHAT_BUCKET || "chat-uploads";
const PREFIX = process.env.CHAT_PREFIX || "chat";
const MAX_MB = Number(process.env.CHAT_MAX_MB || 10);
const MAX_BYTES = MAX_MB * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File mancante" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File troppo grande (max ${MAX_MB} MB)` },
        { status: 413 }
      );
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const key = `${PREFIX}/${new Date().getFullYear()}/${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const supabase = supabaseService();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(key, Buffer.from(await file.arrayBuffer()), {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const pub = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    const url = pub?.data?.publicUrl;
    if (!url) throw new Error("Public URL non disponibile");

    return NextResponse.json({ ok: true, url }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Errore upload";
    console.error("❌ Upload errore:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

