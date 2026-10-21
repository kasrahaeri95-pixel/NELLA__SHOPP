"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/db/schema";
import { useCart } from "./CartProvider";
import { finalPrice, formatPrice, toPersianDigits } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const price = finalPrice(product.price, product.discountPercent);
  const soldOut = product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white p-2 shadow-card ring-1 ring-nella-100/70 transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(190,24,93,0.16)]">
      <Link href={`/product/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-nella-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        {product.discountPercent > 0 && (
          <span className="absolute right-3 top-3 rounded-xl bg-nella-600 px-2 py-0.5 text-xs font-extrabold text-white shadow">
            {toPersianDigits(product.discountPercent)}٪ تخفیف
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-x-3 bottom-3 rounded-lg bg-slate-900/70 py-1 text-center text-xs font-bold text-white">
            فعلاً ناموجود
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1.5 pt-2.5 pb-1">
        <Link href={`/product/${product.slug}`} className="text-sm font-bold leading-6 text-slate-800 line-clamp-2 hover:text-nella-600">
          {product.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
          <span className="rounded-md bg-sky-50 px-1.5 py-0.5 font-medium text-sky-700">{categoryLabel(product.category)}</span>
          <span className="flex items-center gap-0.5 text-amber-500">
            ★ <span className="text-slate-600">{toPersianDigits(product.rating.toFixed(1))}</span>
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {product.discountPercent > 0 && (
              <span className="block text-xs text-slate-400 line-through">{formatPrice(product.price)}</span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-nella-700">{formatPrice(price)}</span>
              <span className="text-[11px] text-slate-500">تومان</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={soldOut}
          onClick={() =>
            add({
              id: product.id,
              slug: product.slug,
              title: product.title,
              price,
              image: product.image,
            })
          }
          className="mt-3 w-full rounded-xl bg-gradient-to-l from-nella-500 to-sky-500 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400"
        >
          {soldOut ? "ناموجود" : "🛒 افزودن به سبد خرید"}
        </button>
      </div>
    </div>
  );
}
