import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = supabaseAnon(); // ✅ FACTORY

  const { data, error } = await supabase
    .from("v_assignments_grouped")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}

