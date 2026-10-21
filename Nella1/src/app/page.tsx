import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/categories";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const services = [
  { icon: "🚚", title: "ارسال سریع", desc: "تحویل اکسپرس در تهران و ارسال به سراسر ایران" },
  { icon: "🛡️", title: "ضمانت اصالت", desc: "تضمین اصالت و سلامت کامل کالا" },
  { icon: "↩️", title: "۷ روز بازگشت", desc: "امکان بازگشت کالا تا ۷ روز بدون دلیل" },
  { icon: "💳", title: "پرداخت در محل", desc: "امکان پرداخت درب منزل و اقساطی" },
];

export default async function HomePage() {
  const [bestSellers, newest, offers] = await Promise.all([
    listProducts({ sort: "bestselling", limit: 8 }),
    listProducts({ sort: "newest", limit: 8 }),
    listProducts({ limit: 50 }),
  ]);

  const amazing = offers
    .filter((p) => p.discountPercent > 0)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <HeroSlider />

      {/* دسته‌بندی‌ها */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-800">
          <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-nella-500 to-sky-500" />
          خرید بر اساس دسته‌بندی
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/search?category=${c.id}`}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 shadow-card ring-1 ring-nella-100/70 transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(190,24,93,0.15)]"
            >
              <span className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br ${c.tint} text-2xl`}>
                {c.emoji}
              </span>
              <span className="text-xs font-bold text-slate-700">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* پیشنهاد شگفت‌انگیز */}
      {amazing.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-nella-700">
              <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-nella-500 to-sky-500" />
              ⚡ پیشنهاد شگفت‌انگیز
            </h2>
            <Link href="/search?sort=expensive" className="text-xs font-bold text-sky-600 hover:text-nella-600">
              مشاهده همه ←
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {amazing.map((p) => (
              <div key={p.id} className="w-[180px] shrink-0 sm:w-[200px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* خدمات */}
      <section className="grid grid-cols-2 gap-3 rounded-3xl bg-gradient-to-l from-nella-50 via-white to-sky-50 p-4 shadow-card ring-1 ring-white md:grid-cols-4">
        {services.map((s) => (
          <div key={s.title} className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-nella-100 text-xl">{s.icon}</span>
            <div>
              <div className="text-sm font-bold text-slate-800">{s.title}</div>
              <div className="text-[11px] leading-5 text-slate-500">{s.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* پرفروش‌ترین‌ها */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-800">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-nella-500 to-sky-500" />
            🔥 پرفروش‌ترین محصولات
          </h2>
          <Link href="/search?sort=bestselling" className="text-xs font-bold text-sky-600 hover:text-nella-600">
            مشاهده همه ←
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* بنر تبلیغاتی */}
      <section className="grid gap-3 md:grid-cols-2">
        <div className="flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-l from-nella-200 to-nella-100 p-6">
          <div>
            <h3 className="text-lg font-extrabold text-nella-700">کالکشن عروسک‌ها</h3>
            <p className="mt-1 text-sm text-nella-800/70">پولیشی‌های نرم و ضدحساسیت</p>
            <Link href="/search?category=toys" className="mt-3 inline-block rounded-xl bg-white px-4 py-2 text-xs font-bold text-nella-700">
              خرید کن
            </Link>
          </div>
          <span className="text-5xl">🧸</span>
        </div>
        <div className="flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-l from-sky-200 to-sky-100 p-6">
          <div>
            <h3 className="text-lg font-extrabold text-sky-700">خانه و آشپزخانه</h3>
            <p className="mt-1 text-sm text-sky-800/70">لوازم خانگی با گارانتی</p>
            <Link href="/search?category=home" className="mt-3 inline-block rounded-xl bg-white px-4 py-2 text-xs font-bold text-sky-700">
              خرید کن
            </Link>
          </div>
          <span className="text-5xl">🏠</span>
        </div>
      </section>

      {/* جدیدترین‌ها */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-800">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-nella-500 to-sky-500" />
            🆕 جدیدترین محصولات
          </h2>
          <Link href="/search?sort=newest" className="text-xs font-bold text-sky-600 hover:text-nella-600">
            مشاهده همه ←
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {newest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
