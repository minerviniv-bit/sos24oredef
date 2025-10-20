import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/server"; // o client se hai già wrapper

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service");
  const city = searchParams.get("city");

  if (!service || !city) {
    return NextResponse.json(
      { error: "service and city are required" },
      { status: 400 }
    );
  }

  const supabase = supabaseAnon();
  const { data, error } = await supabase
    .from("v_assignments_grouped")
    .select("*")
    .eq("service", service)
    .eq("city", city);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ service, city, data });
}
