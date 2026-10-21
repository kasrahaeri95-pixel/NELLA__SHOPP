import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="mt-auto bg-white/90 backdrop-blur">
      <div className="h-1 w-full bg-gradient-to-l from-nella-400 via-nella-300 to-sky-300" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative block h-12 w-12 overflow-hidden rounded-full ring-2 ring-nella-200">
              <img src="/images/logo.png" alt="لوگو NELLA_SHOPP" className="h-full w-full object-cover" />
            </span>
            <span className="text-xl font-extrabold">
              <span className="text-nella-600">NELLA</span>
              <span className="text-sky-600">_SHOPP</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            نلا شاپ، فروشگاه اینترنتی مطمئن با ضمانت اصالت کالا، ارسال سریع و پرداخت در محل. خرید آسان، تحویل ایمن.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-lg bg-nella-50 px-2.5 py-1 text-xs font-bold text-nella-700 ring-1 ring-nella-100">
              ۷ روز ضمانت بازگشت
            </span>
            <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-100">
              پرداخت در محل
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800">دسترسی سریع</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/" className="hover:text-nella-600">
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link href="/search?sort=bestselling" className="hover:text-nella-600">
                پرفروش‌ترین‌ها
              </Link>
            </li>
            <li>
              <Link href="/search?inStock=1" className="hover:text-nella-600">
                کالاهای موجود
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-nella-600">
                سبد خرید
              </Link>
            </li>
            <li>
              <Link href="/seller/login" className="hover:text-nella-600">
                ورود فروشنده (پنل مدیریت)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800">دسته‌بندی‌ها</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/search?category=${c.id}`} className="hover:text-nella-600">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800">پشتیبانی مشتریان</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>📞 تلفن: ۰۲۱-۹۱۰۰۲۲۳۳</li>
            <li>✉️ ایمیل: support@nella-shopp.ir</li>
            <li>🕘 همه روزه ۲۴ ساعته (بجز تعطیلات)</li>
          </ul>
          <Link
            href="/support"
            className="mt-4 inline-block rounded-xl bg-gradient-to-l from-nella-500 to-sky-500 px-4 py-2 text-sm font-bold text-white shadow-card hover:opacity-90"
          >
            تماس با پشتیبانی
          </Link>
        </div>
      </div>
      <div className="border-t border-nella-100 py-4 text-center text-xs text-slate-500">
        © ۱۴۰۵ NELLA_SHOPP — تمامی حقوق این سایت محفوظ است. 💗
      </div>
    </footer>
  );
}
