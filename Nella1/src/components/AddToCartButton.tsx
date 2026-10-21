"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { finalPrice } from "@/lib/format";
import type { Product } from "@/db/schema";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const price = finalPrice(product.price, product.discountPercent);
  const disabled = product.stock <= 0;

  function handleAdd() {
    add({ id: product.id, slug: product.slug, title: product.title, price, image: product.image }, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-1 rounded-2xl bg-nella-50 p-1 ring-1 ring-nella-100">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={disabled || qty <= 1}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white text-lg font-bold text-nella-600 shadow-sm disabled:opacity-40"
          aria-label="کاهش تعداد"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-bold text-slate-700">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(Math.max(1, product.stock), q + 1))}
          disabled={disabled || qty >= product.stock}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white text-lg font-bold text-nella-600 shadow-sm disabled:opacity-40"
          aria-label="افزایش تعداد"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className={`flex-1 rounded-2xl px-6 py-3 text-sm font-extrabold text-white shadow-card transition disabled:cursor-not-allowed disabled:bg-slate-300 ${
          added ? "bg-emerald-500" : "bg-gradient-to-l from-nella-500 to-sky-500 hover:opacity-90"
        }`}
      >
        {disabled ? "فعلاً ناموجود" : added ? "✅ به سبد خرید اضافه شد" : "🛒 افزودن به سبد خرید"}
      </button>
    </div>
  );
}
