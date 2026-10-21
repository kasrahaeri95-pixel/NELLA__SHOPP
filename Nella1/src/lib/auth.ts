import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "nella_seller_token";

export const SELLER_PASSWORD = process.env.SELLER_PASSWORD || "7788";

function secret(): string {
  return process.env.SELLER_SECRET || "nella-shopp-seller-secret";
}

export function createToken(): string {
  return crypto.createHmac("sha256", secret()).update(SELLER_PASSWORD).digest("hex");
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = createToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isSellerRequest(req: NextRequest): boolean {
  return isValidToken(req.cookies.get(COOKIE_NAME)?.value);
}

export async function isSellerSession(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(COOKIE_NAME)?.value);
}

export const sellerCookieName = COOKIE_NAME;
