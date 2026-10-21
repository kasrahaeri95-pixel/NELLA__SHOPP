"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    q: "چطور از وضعیت سفارشم مطلع شوم؟",
    a: "پس از ثبت سفارش، پیامک تأیید برای شما ارسال می‌شود. همچنین می‌توانید با تماس با پشتیبانی ۰۲۱-۹۱۰۰۲۲۳۳ و اعلام شماره سفارش، وضعیت دقیق مرسوله را پیگیری کنید.",
  },
  {
    q: "هزینه ارسال چقدر است؟",
    a: "برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان ارسال رایگان است. برای سایر سفارش‌ها هزینه ارسال ۸۹,۰۰۰ تومان محاسبه می‌شود. ارسال به تهران اکسپرس ۲۴ ساعته و به شهرستان‌ها ۲ تا ۳ روز کاری است.",
  },
  {
    q: "امکان بازگشت کالا وجود دارد؟",
    a: "بله، تا ۷ روز پس از تحویل می‌توانید کالا را در صورت عدم استفاده و سالم بودن بسته‌بندی، مرجوع کنید و کل مبلغ مسترد می‌شود.",
  },
  {
    q: "پرداخت در محل ممکن است؟",
    a: "بله، در تمام شهرستان‌ها و تهران امکان پرداخت در محل هنگام تحویل کالا به مامور پست وجود دارد.",
  },
  {
    q: "کالاها اورجینال هستند؟",
    a: "تمام محصولات نلا شاپ دارای ضمانت اصالت و سلامت کامل هستند و از تامین‌کنندگان رسمی تهیه می‌شوند.",
  },
];

const contactChannels = [
  { icon: "📞", title: "تماس تلفنی", lines: ["۰۲۱-۹۱۰۰۲۲۳۳", "همه روزه ۲۴ ساعته"] },
  { icon: "✉️", title: "ایمیل", lines: ["support@nella-shopp.ir", "پاسخ حداکثر تا ۴ ساعت کاری"] },
  { icon: "💬", title: "چت آنلاین", lines: ["از طریق فرم زیر", "پاسخ سریع کارشناسان"] },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("لطفاً نام، شماره تماس و متن پیام را کامل کنید.");
      return;
    }
    setError("");
    setSent(true);
    setForm({ name: "", phone: "", subject: "", message: "" });
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-l from-nella-200 via-white to-sky-100 p-6 shadow-card">
        <h1 className="text-2xl font-extrabold text-nella-700">پشتیبانی NELLA_SHOPP 💗</h1>
        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
          کارشناسان ما ۲۴ ساعته آماده پاسخگویی به شما هستند. اگر سؤالی دارید از بخش‌های زیر استفاده کنید یا فرم تماس را پر کنید.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {contactChannels.map((c) => (
          <div key={c.title} className="rounded-3xl bg-white p-5 text-center shadow-card ring-1 ring-nella-100/60">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-nella-100 text-2xl">{c.icon}</div>
            <h3 className="mt-3 text-sm font-extrabold text-slate-800">{c.title}</h3>
            {c.lines.map((l) => (
              <p key={l} className="mt-1 text-xs text-slate-500">
                {l}
              </p>
            ))}
          </div>
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* سوالات متداول */}
        <section id="faq" className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nella-100/60">
          <h2 className="text-lg font-extrabold text-slate-800">سوالات متداول</h2>
          <div className="mt-3 space-y-2">
            {faqs.map((item, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-nella-50/70">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-right"
                >
                  <span className="text-sm font-bold text-slate-700">{item.q}</span>
                  <span className="text-lg font-bold text-nella-500">{openIndex === i ? "−" : "+"}</span>
                </button>
                {openIndex === i && <p className="animate-fade-up px-4 pb-3 text-sm leading-7 text-slate-600">{item.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* فرم تماس */}
        <section className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nella-100/60">
          <h2 className="text-lg font-extrabold text-slate-800">ارسال پیام به پشتیبانی</h2>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="نام و نام خانوادگی"
                className="rounded-xl bg-nella-50 px-3 py-2.5 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="شماره تماس"
                inputMode="tel"
                className="rounded-xl bg-nella-50 px-3 py-2.5 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
              />
            </div>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="موضوع پیام (اختیاری)"
              className="w-full rounded-xl bg-nella-50 px-3 py-2.5 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="متن پیام…"
              rows={5}
              className="w-full rounded-xl bg-nella-50 px-3 py-2.5 text-sm leading-7 outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            />
            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">{error}</p>}
            {sent && (
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">
                ✅ پیام شما ثبت شد. کارشناسان ما به‌زودی تماس می‌گیرند.
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-l from-nella-500 to-sky-500 py-3 text-sm font-extrabold text-white shadow-card transition hover:opacity-90"
            >
              ارسال پیام
            </button>
          </form>
        </section>
      </div>

      <p className="text-center text-sm text-slate-500">
        می‌خواهید فروشنده ما باشید؟{" "}
        <Link href="/seller/login" className="font-bold text-sky-600 hover:text-nella-600">
          ورود به پنل فروشنده
        </Link>
      </p>
    </div>
  );
}
