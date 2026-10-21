"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SellerLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/seller/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/seller/dashboard");
        router.refresh();
        return;
      }
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "ورود ناموفق بود.");
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-nella-100/60">
        <div className="bg-gradient-to-l from-nella-500 to-sky-500 px-6 py-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/90 text-2xl">🔐</div>
          <h1 className="mt-3 text-xl font-extrabold text-white">ورود فروشنده</h1>
          <p className="mt-1 text-xs text-white/80">برای مدیریت قیمت‌ها و محصولات، رمز فروشنده را وارد کنید</p>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <div>
            <label htmlFor="seller-password" className="mb-1.5 block text-sm font-bold text-slate-700">
              رمز فروشنده
            </label>
            <input
              id="seller-password"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full rounded-2xl bg-nella-50 px-4 py-3 text-center text-lg tracking-[0.5em] outline-none ring-1 ring-nella-100 focus:ring-2 focus:ring-nella-300"
            />
          </div>

          {error && (
            <p className="animate-fade-up rounded-xl bg-rose-50 px-3 py-2 text-center text-xs font-bold text-rose-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-2xl bg-gradient-to-l from-nella-500 to-sky-500 py-3 text-sm font-extrabold text-white shadow-card transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "در حال بررسی…" : "ورود به پنل"}
          </button>

          <p className="text-center text-[11px] leading-6 text-slate-400">
            این بخش فقط برای فروشنده NELLA_SHOPP است. رمز را فقط در اختیار فروشنده قرار دهید.
          </p>
        </form>
      </div>

      <div className="mt-4 text-center">
        <Link href="/" className="text-sm font-bold text-sky-600 hover:text-nella-600">
          ← بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
