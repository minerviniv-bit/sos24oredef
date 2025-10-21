import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";
  if (secret !== process.env.REVALIDATE_SECRET && secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "invalid secret" }, { status: 401 });
  }
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, now: Date.now() });
}

