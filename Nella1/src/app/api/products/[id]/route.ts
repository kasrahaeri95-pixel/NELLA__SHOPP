import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isSellerRequest } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { categories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSellerRequest(req)) {
    return NextResponse.json({ error: "دسترسی مجاز نیست. ابتدا وارد پنل فروشنده شوید." }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "شناسه محصول نامعتبر است." }, { status: 400 });
  }

  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "داده ارسالی نامعتبر است." }, { status: 400 });
  }

  const updates: Partial<typeof products.$inferInsert> = {};

  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (title.length < 3) {
      return NextResponse.json({ error: "نام محصول باید حداقل ۳ حرف باشد." }, { status: 400 });
    }
    updates.title = title;
  }
  if (body.description !== undefined) updates.description = String(body.description).trim();
  if (body.image !== undefined) {
    const image = String(body.image).trim();
    if (!image) return NextResponse.json({ error: "تصویر محصول نمی‌تواند خالی باشد." }, { status: 400 });
    updates.image = image;
  }
  if (body.category !== undefined) {
    const category = String(body.category).trim();
    if (!categories.some((c) => c.id === category)) {
      return NextResponse.json({ error: "دسته‌بندی نامعتبر است." }, { status: 400 });
    }
    updates.category = category;
  }
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "قیمت باید یک عدد بزرگ‌تر از صفر باشد." }, { status: 400 });
    }
    updates.price = Math.round(price);
  }
  if (body.discountPercent !== undefined) {
    const discountPercent = Number(body.discountPercent);
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 90) {
      return NextResponse.json({ error: "درصد تخفیف باید بین ۰ تا ۹۰ باشد." }, { status: 400 });
    }
    updates.discountPercent = Math.round(discountPercent);
  }
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json({ error: "موجودی نمی‌تواند منفی باشد." }, { status: 400 });
    }
    updates.stock = Math.floor(stock);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "هیچ فیلدی برای به‌روزرسانی ارسال نشده است." }, { status: 400 });
  }

  const updated = await db.update(products).set(updates).where(eq(products.id, id)).returning();
  return NextResponse.json({ product: updated[0] });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSellerRequest(req)) {
    return NextResponse.json({ error: "دسترسی مجاز نیست. ابتدا وارد پنل فروشنده شوید." }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "شناسه محصول نامعتبر است." }, { status: 400 });
  }

  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
  }

  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}
