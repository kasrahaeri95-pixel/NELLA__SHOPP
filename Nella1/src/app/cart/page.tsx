"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice, toPersianDigits } from "@/lib/format";

export default function CartPage() {
  const { items, count, total, setQuantity, remove, clear } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const shipping = total >= 5_000_000 || total === 0 ? 0 : 89_000;
  const payable = total + shipping;

  if (ordered) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-nella-100/60">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 text-xl font-extrabold text-nella-700">سفارش شما ثبت شد!</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          همکاران ما به‌زودی برای تأیید نهایی و هماهنگی ارسال با شما تماس می‌گیرند. شماره پیگیری سفارش:{" "}
          <span className="font-bold text-sky-600">{toPersianDigits(Math.floor(Math.random() * 900000) + 100000)}</span>
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-2xl bg-gradient-to-l from-nella-500 to-sky-500 px-6 py-3 text-sm font-bold text-white"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-nella-100/60">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-xl font-extrabold text-slate-800">سبد خرید شما خالی است</h1>
        <p className="mt-3 text-sm text-slate-500">می‌توانید از صفحه اصلی فروشگاه، محصولات مورد علاقه‌تان را انتخاب کنید.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-2xl bg-gradient-to-l from-nella-500 to-sky-500 px-6 py-3 text-sm font-bold text-white"
        >
          شروع خرید
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-nella-100/60">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-slate-800">
            سبد خرید <span className="text-sm font-medium text-slate-500">({toPersianDigits(count)} کالا)</span>
          </h1>
          <button type="button" onClick={clear} className="text-xs font-bold text-nella-600 hover:underline">
            خالی کردن سبد
          </button>
        </div>

        <ul className="mt-4 divide-y divide-nella-50">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-3 py-4 sm:flex-nowrap">
              <Link href={`/product/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-nella-50">
                <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-bold text-slate-800 hover:text-nella-600">
                  {item.title}
                </Link>
                <div className="mt-1 text-xs text-slate-500">قیمت واحد: {formatPrice(item.price)} تومان</div>
              </div>

              <div className="flex items-center gap-1 rounded-xl bg-nella-50 p-1 ring-1 ring-nella-100">
                <button
                  type="button"
                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white font-bold text-nella-600"
                  aria-label="کاهش"
                >
                  −
                </button>
                <span className="w-9 text-center text-sm font-bold text-slate-700">{toPersianDigits(item.quantity)}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white font-bold text-nella-600"
                  aria-label="افزایش"
                >
                  +
                </button>
              </div>

              <div className="w-28 text-left text-sm font-extrabold text-nella-700">{formatPrice(item.price * item.quantity)} تومان</div>

              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded-lg bg-rose-50 px-2 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                aria-label="حذف"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="h-fit space-y-4 rounded-3xl bg-white p-4 shadow-card ring-1 ring-nella-100/60">
        <h2 className="text-base font-extrabold text-slate-800">خلاصه سفارش</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>جمع کالاها</span>
            <span className="font-bold text-slate-800">{formatPrice(total)} تومان</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>هزینه ارسال</span>
            <span className="font-bold text-slate-800">{shipping === 0 ? "رایگان 🎉" : `${formatPrice(shipping)} تومان`}</span>
          </div>
          <div className="border-t border-nella-50 pt-2">
            <div className="flex justify-between">
              <span className="font-bold text-slate-700">مبلغ قابل پرداخت</span>
              <span className="text-base font-extrabold text-nella-700">{formatPrice(payable)} تومان</span>
            </div>
          </div>
        </div>

        {shipping === 0 && total > 0 && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">ارسال این سفارش رایگان است ✅</p>
        )}

        <div className="space-y-2">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="نام و نام خانوادگی تحویل‌گیرنده"
            className="w-full rounded-xl bg-nella-50 px-3 py-2 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="شماره تماس (۰۹xxxxxxxxx)"
            inputMode="tel"
            className="w-full rounded-xl bg-nella-50 px-3 py-2 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
          />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="آدرس کامل پستی"
            rows={3}
            className="w-full rounded-xl bg-nella-50 px-3 py-2 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
          />
        </div>

        <button
          type="button"
          disabled={!fullName.trim() || !phone.trim() || !address.trim()}
          onClick={() => setOrdered(true)}
          className="w-full rounded-2xl bg-gradient-to-l from-nella-500 to-sky-500 py-3 text-sm font-extrabold text-white shadow-card transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300"
        >
          ثبت نهایی سفارش
        </button>
        <p className="text-center text-[11px] text-slate-400">پرداخت در محل هنگام تحویل کالا انجام می‌شود.</p>
      </aside>
    </div>
  );
}
