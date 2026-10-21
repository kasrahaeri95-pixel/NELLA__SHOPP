import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { isSellerRequest } from "@/lib/auth";
import { listProducts, type SortKey } from "@/lib/products";
import { slugify } from "@/lib/format";
import { categories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sortParam = searchParams.get("sort");
  const sort: SortKey =
    sortParam === "cheapest" || sortParam === "expensive" || sortParam === "bestselling" ? sortParam : "newest";

  const items = await listProducts({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort,
    onlyInStock: searchParams.get("inStock") === "1",
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!isSellerRequest(req)) {
    return NextResponse.json({ error: "دسترسی مجاز نیست. ابتدا وارد پنل فروشنده شوید." }, { status: 401 });
  }

  let body: {
    title?: string;
    category?: string;
    description?: string;
    price?: number;
    discountPercent?: number;
    image?: string;
    stock?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "داده ارسالی نامعتبر است." }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const category = (body.category ?? "").trim();
  const image = (body.image ?? "").trim();
  const price = Number(body.price);
  const discountPercent = Math.max(0, Math.min(90, Number(body.discountPercent ?? 0)));
  const stock = Math.max(0, Math.floor(Number(body.stock ?? 0)));

  if (!title || title.length < 3) {
    return NextResponse.json({ error: "نام محصول باید حداقل ۳ حرف باشد." }, { status: 400 });
  }
  if (!categories.some((c) => c.id === category)) {
    return NextResponse.json({ error: "دسته‌بندی نامعتبر است." }, { status: 400 });
  }
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "قیمت باید یک عدد بزرگ‌تر از صفر باشد." }, { status: 400 });
  }
  if (!image) {
    return NextResponse.json({ error: "تصویر محصول را انتخاب کنید." }, { status: 400 });
  }

  let baseSlug = slugify(title);
  if (!baseSlug) baseSlug = `product-${Date.now()}`;

  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, baseSlug))
    .limit(1);
  const slug = existing.length ? `${baseSlug}-${Date.now().toString().slice(-5)}` : baseSlug;

  const inserted = await db
    .insert(products)
    .values({
      title,
      slug,
      category,
      description: (body.description ?? "").trim(),
      price: Math.round(price),
      discountPercent,
      image,
      stock,
      sold: 0,
      rating: 4.5,
    })
    .returning();

  return NextResponse.json({ product: inserted[0] }, { status: 201 });
}
