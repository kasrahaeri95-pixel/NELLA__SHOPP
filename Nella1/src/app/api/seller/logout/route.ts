import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sellerCookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  store.delete(sellerCookieName);
  return NextResponse.json({ ok: true });
}
