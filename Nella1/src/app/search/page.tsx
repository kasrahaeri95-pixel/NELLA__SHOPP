"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/categories";
import type { Product } from "@/db/schema";
import { toPersianDigits } from "@/lib/format";

const sortOptions: { id: string; label: string }[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "bestselling", label: "پرفروش‌ترین" },
  { id: "expensive", label: "گران‌ترین" },
  { id: "cheapest", label: "ارزان‌ترین" },
];

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[40vh] place-items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-nella-200 border-t-nella-500" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "all";
  const sort = params.get("sort") ?? "newest";
  const inStock = params.get("inStock") === "1";

  const [input, setInput] = useState(q);
  const [items, setItems] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => setInput(q), [q]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (category && category !== "all") search.set("category", category);
    search.set("sort", sort);
    if (inStock) search.set("inStock", "1");

    fetch(`/api/products?${search.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { items: Product[] }) => setItems(data.items))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [q, category, sort, inStock]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items ?? []) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    return counts;
  }, [items]);

  function buildLink(overrides: Record<string, string>) {
    const next = new URLSearchParams();
    const merged = { q, category, sort, ...overrides };
    for (const [key, value] of Object.entries(merged)) {
      if (value && value !== "all") next.set(key, value);
    }
    if (overrides.inStock) next.set("inStock", "1");
    else if (inStock && !("inStock" in overrides)) next.set("inStock", "1");
    const qs = next.toString();
    return qs ? `/search?${qs}` : "/search";
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      {/* فیلترها */}
      <aside className="h-fit space-y-4 rounded-3xl bg-white p-4 shadow-card ring-1 ring-nella-100/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const term = input.trim();
            window.location.href = term ? `/search?q=${encodeURIComponent(term)}` : "/search";
          }}
          className="flex items-center gap-2 rounded-xl bg-nella-50 px-2 py-1.5 ring-1 ring-nella-100"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="جست‌وجوی محصول…"
            className="w-full bg-transparent px-1 text-sm outline-none placeholder:text-nella-400"
          />
          <button type="submit" className="rounded-lg bg-nella-500 px-2 py-1 text-[11px] font-bold text-white">
            برو
          </button>
        </form>

        <div>
          <h3 className="mb-2 text-sm font-extrabold text-slate-800">دسته‌بندی</h3>
          <div className="space-y-1">
            <Link
              href={buildLink({ category: "all" })}
              className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-sm ${
                category === "all" ? "bg-nella-100 font-bold text-nella-700" : "text-slate-600 hover:bg-nella-50"
              }`}
            >
              <span>همه دسته‌ها</span>
              <span className="text-xs text-slate-400">{toPersianDigits(items?.length ?? 0)}</span>
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={buildLink({ category: c.id })}
                className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-sm ${
                  category === c.id ? "bg-nella-100 font-bold text-nella-700" : "text-slate-600 hover:bg-nella-50"
                }`}
              >
                <span>
                  {c.emoji} {c.label}
                </span>
                <span className="text-xs text-slate-400">{toPersianDigits(categoryCounts.get(c.id) ?? 0)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-extrabold text-slate-800">مرتب‌سازی</h3>
          <select
            value={sort}
            onChange={(e) => {
              window.location.href = buildLink({ sort: e.target.value });
            }}
            className="w-full rounded-xl bg-nella-50 px-3 py-2 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-xl bg-nella-50 px-3 py-2 text-sm">
          <span className="font-bold text-slate-700">فقط کالاهای موجود</span>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => {
              window.location.href = buildLink({ inStock: e.target.checked ? "1" : "" });
            }}
            className="h-4 w-4 accent-nella-500"
          />
        </label>
      </aside>

      {/* نتایج */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-nella-100/60">
          <div className="text-sm text-slate-600">
            {q ? (
              <>
                نتایج جست‌وجو برای «<span className="font-bold text-nella-700">{q}</span>»
              </>
            ) : (
              <>
                دسته: <span className="font-bold text-nella-700">{categories.find((c) => c.id === category)?.label ?? "همه محصولات"}</span>
              </>
            )}
          </div>
          {items && (
            <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-bold text-sky-700">
              {toPersianDigits(items.length)} کالا
            </span>
          )}
        </div>

        {loading || items === null ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/70 shadow-card" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-nella-100/60">
            <div className="text-5xl">🔍</div>
            <h2 className="mt-3 text-lg font-extrabold text-slate-800">محصولی پیدا نشد!</h2>
            <p className="mt-2 text-sm text-slate-500">
              برای عبارت «{q}» نتیجه‌ای نداشتیم. املای جست‌وجو را بررسی کنید یا از دسته‌بندی‌ها استفاده کنید.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-gradient-to-l from-nella-500 to-sky-500 px-5 py-2 text-sm font-bold text-white"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
