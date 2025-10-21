import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    stamp: Date.now(),
    env: {
      NODE_ENV: process.env.NODE_ENV ?? null,
    },
  });
}
