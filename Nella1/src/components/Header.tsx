"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { categories } from "@/lib/categories";
import { toPersianDigits } from "@/lib/format";

export default function Header() {
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  }

  return (
    <header className="sticky top-0 z-50 shadow-[0_2px_14px_rgba(190,24,93,0.10)]">
      {/* ردیف بالایی */}
      <div className="bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-3 py-3 sm:px-5">
          {/* لوگو */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="relative block h-12 w-12 overflow-hidden rounded-full ring-2 ring-nella-200">
              <Image src="/images/logo.png" alt="لوگو NELLA_SHOPP" fill sizes="48px" className="object-cover" priority />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-nella-600">NELLA</span>
                <span className="text-sky-600">_SHOPP</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500">فروشگاه اینترنتی نلا</span>
            </span>
          </Link>

          {/* جست‌وجو */}
          <form onSubmit={onSubmit} className="order-3 w-full sm:order-2 sm:mx-auto sm:w-auto sm:flex-1 sm:max-w-xl">
            <label className="flex items-center gap-2 rounded-2xl bg-nella-50 px-3 py-2 ring-1 ring-nella-100 focus-within:ring-2 focus-within:ring-nella-300">
              <svg className="h-5 w-5 text-nella-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="جست‌وجو در NELLA_SHOPP…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-nella-400"
                aria-label="جست‌وجوی محصول"
              />
              <button type="submit" className="rounded-xl bg-gradient-to-l from-nella-500 to-sky-500 px-3 py-1 text-xs font-bold text-white">
                جست‌وجو
              </button>
            </label>
          </form>

          {/* سبد خرید و پنل فروشنده */}
          <div className="order-2 ml-auto flex items-center gap-2 sm:order-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-1 rounded-xl bg-nella-50 px-3 py-2 text-nella-700 ring-1 ring-nella-100 hover:bg-nella-100"
              aria-label="سبد خرید"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 5h2l2.2 10.4a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.5L21 8H7" />
                <circle cx="10.5" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
              </svg>
              <span className="hidden text-xs font-bold sm:inline">سبد خرید</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -left-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-nella-600 px-1 text-[11px] font-bold text-white">
                  {toPersianDigits(count)}
                </span>
              )}
            </Link>
            <Link
              href="/seller/login"
              className="flex items-center gap-1 rounded-xl bg-sky-100 px-3 py-2 text-xs font-bold text-sky-700 ring-1 ring-sky-200 hover:bg-sky-200"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
              </svg>
              پنل فروشنده
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl bg-nella-50 p-2 text-nella-700 ring-1 ring-nella-100 lg:hidden"
              aria-label="منو"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* نوار دسته‌بندی‌ها */}
      <nav className="hidden bg-gradient-to-l from-nella-100 via-white to-sky-100 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-2 no-scrollbar sm:px-5">
          <Link href="/" className="shrink-0 rounded-xl px-3 py-1.5 text-sm font-bold text-nella-700 hover:bg-white">
            صفحه اصلی
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/search?category=${c.id}`}
              className="shrink-0 rounded-xl px-3 py-1.5 text-sm text-slate-600 hover:bg-white hover:text-nella-700"
            >
              {c.label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <Link href="/support" className="shrink-0 rounded-xl px-3 py-1.5 text-sm text-slate-600 hover:bg-white hover:text-nella-700">
            پشتیبانی
          </Link>
          <Link href="/support#faq" className="shrink-0 rounded-xl px-3 py-1.5 text-sm text-slate-600 hover:bg-white hover:text-nella-700">
            سوالات متداول
          </Link>
        </div>
      </nav>

      {/* منوی موبایل */}
      {menuOpen && (
        <div className="border-t border-nella-100 bg-white lg:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-3 py-3 sm:px-5">
            <Link href="/" className="rounded-xl px-3 py-2 text-sm font-bold text-nella-700 hover:bg-nella-50">
              صفحه اصلی
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/search?category=${c.id}`}
                className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-nella-50"
              >
                {c.emoji} {c.label}
              </Link>
            ))}
            <Link href="/support" className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-nella-50">
              پشتیبانی
            </Link>
            <Link href="/cart" className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-nella-50">
              سبد خرید
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
