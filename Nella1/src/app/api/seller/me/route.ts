import { NextResponse, type NextRequest } from "next/server";
import { isSellerRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: isSellerRequest(req) });
}
