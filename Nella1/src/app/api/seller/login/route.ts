import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SELLER_PASSWORD, createToken, sellerCookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "داده ارسالی نامعتبر است." }, { status: 400 });
  }

  const password = (body.password ?? "").trim();
  if (password !== SELLER_PASSWORD) {
    return NextResponse.json({ error: "رمز فروشنده اشتباه است!" }, { status: 401 });
  }

  const store = await cookies();
  store.set(sellerCookieName, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
