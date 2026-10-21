"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "جشنواره کالای دیجیتال",
    subtitle: "تا ۵۰٪ تخفیف روی هدفون، ساعت هوشمند و گوشی",
    emoji: "📱",
    cta: "مشاهده کالای دیجیتال",
    href: "/search?category=digital",
    bg: "from-nella-200 via-nella-100 to-white",
    accent: "text-nella-700",
  },
  {
    id: 2,
    title: "کالکشن جدید بهاره",
    subtitle: "کیف، کفش و اکسسوری با ارسال رایگان",
    emoji: "👜",
    cta: "مد و پوشاک",
    href: "/search?category=fashion",
    bg: "from-sky-200 via-sky-100 to-white",
    accent: "text-sky-700",
  },
  {
    id: 3,
    title: "زیبایی‌ات رو بساز!",
    subtitle: "آرایشی و بهداشتی اورجینال، تضمین اصالت کالا",
    emoji: "💄",
    cta: "آرایشی و بهداشتی",
    href: "/search?category=beauty",
    bg: "from-nella-100 via-sky-100 to-white",
    accent: "text-nella-600",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-white">
      <div className="grid gap-6 p-6 sm:p-10 md:grid-cols-2 md:items-center">
        <div className="animate-fade-up" key={slide.id}>
          <span className="inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-nella-600 shadow-sm ring-1 ring-nella-200">
            فروش ویژه NELLA_SHOPP
          </span>
          <h1 className={`mt-4 text-3xl font-extrabold leading-tight sm:text-4xl ${slide.accent}`}>{slide.title}</h1>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-600 sm:text-base">{slide.subtitle}</p>
          <Link
            href={slide.href}
            className="mt-6 inline-block rounded-2xl bg-gradient-to-l from-nella-500 to-sky-500 px-6 py-3 text-sm font-bold text-white shadow-card transition hover:scale-[1.02]"
          >
            {slide.cta} ←
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <div className={`animate-float grid h-52 w-52 place-items-center rounded-full bg-gradient-to-br ${slide.bg} text-[86px] shadow-inner ring-8 ring-white/70 sm:h-64 sm:w-64 sm:text-[110px]`}>
            {slide.emoji}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pb-4">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`اسلاید ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-7 bg-nella-500" : "w-2.5 bg-nella-200"}`}
          />
        ))}
      </div>
    </section>
  );
}
