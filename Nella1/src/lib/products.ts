import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export type SortKey = "newest" | "cheapest" | "expensive" | "bestselling";

export type ListParams = {
  q?: string;
  category?: string;
  sort?: SortKey;
  onlyInStock?: boolean;
  limit?: number;
};

export function orderBy(sort: SortKey = "newest") {
  switch (sort) {
    case "cheapest":
      return products.price;
    case "expensive":
      return desc(products.price);
    case "bestselling":
      return desc(products.sold);
    default:
      return desc(products.createdAt);
  }
}

export async function listProducts(params: ListParams = {}): Promise<Product[]> {
  const { q, category, sort = "newest", onlyInStock, limit } = params;

  const conditions = [];
  if (q && q.trim()) {
    const pattern = `%${q.trim()}%`;
    conditions.push(or(ilike(products.title, pattern), ilike(products.description, pattern)));
  }
  if (category && category !== "all") {
    conditions.push(eq(products.category, category));
  }
  if (onlyInStock) {
    conditions.push(sql`${products.stock} > 0`);
  }

  const query = db
    .select()
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy(sort))
    .$dynamic();

  return limit ? await query.limit(limit) : await query;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function relatedProducts(category: string, excludeId: number, limit = 4): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(and(eq(products.category, category), sql`${products.id} <> ${excludeId}`))
    .orderBy(desc(products.sold))
    .limit(limit);
}

export async function productStats() {
  const rows = await db
    .select({
      total: sql<number>`count(*)::int`,
      inStock: sql<number>`count(*) filter (where ${products.stock} > 0)::int`,
      sold: sql<number>`coalesce(sum(${products.sold}), 0)::int`,
      avgDiscount: sql<number>`coalesce(round(avg(${products.discountPercent})), 0)::int`,
    })
    .from(products);
  return rows[0];
}
