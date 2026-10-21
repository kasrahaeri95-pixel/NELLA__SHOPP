"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { categories } from "@/lib/categories";
import { presetImages } from "@/lib/productImages";
import { finalPrice, formatPrice, toPersianDigits } from "@/lib/format";
import type { Product } from "@/db/schema";

type EditState = {
  price: string;
  discountPercent: string;
  stock: string;
  title: string;
};

type Toast = { kind: "success" | "error"; message: string };

export default function SellerDashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [edits, setEdits] = useState<Record<number, EditState>>({});
  const [filter, setFilter] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  // فرم افزودن محصول
  const [form, setForm] = useState({
    title: "",
    category: "digital",
    price: "",
    discountPercent: "0",
    stock: "10",
    description: "",
    image: presetImages[0].src,
  });
  const [customImage, setCustomImage] = useState("");
  const [adding, setAdding] = useState(false);

  const notify = useCallback((message: string, kind: Toast["kind"] = "success") => {
    setToast({ message, kind });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    const res = await fetch("/api/products");
    if (!res.ok) {
      router.push("/seller/login");
      return;
    }
    const data = (await res.json()) as { items: Product[] };
    setProducts(data.items);
  }, [router]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/seller/me");
      const data = (await res.json()) as { ok: boolean };
      if (!data.ok) {
        router.push("/seller/login");
        return;
      }
      await load();
      setChecking(false);
    })();
  }, [load, router]);

  async function saveProduct(p: Product) {
    const edit = edits[p.id];
    if (!edit) return;
    setSavingId(p.id);
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: edit.title,
          price: Number(edit.price),
          discountPercent: Number(edit.discountPercent),
          stock: Number(edit.stock),
        }),
      });
      const data = (await res.json()) as { product?: Product; error?: string };
      if (res.ok && data.product) {
        setProducts((prev) => prev.map((x) => (x.id === p.id ? data.product! : x)));
        notify(`تغییرات «${data.product.title}» ذخیره شد.`);
      } else {
        notify(data.error ?? "ذخیره تغییرات ناموفق بود.", "error");
      }
    } catch {
      notify("ارتباط با سرور برقرار نشد.", "error");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteProduct(p: Product) {
    if (!window.confirm(`آیا از حذف «${p.title}» مطمئن هستید؟`)) return;
    try {
      const res = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((x) => x.id !== p.id));
        notify("محصول حذف شد.");
      } else {
        notify("حذف محصول ناموفق بود.", "error");
      }
    } catch {
      notify("ارتباط با سرور برقرار نشد.", "error");
    }
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          description: form.description,
          price: Number(form.price),
          discountPercent: Number(form.discountPercent),
          stock: Number(form.stock),
          image: customImage.trim() || form.image,
        }),
      });
      const data = (await res.json()) as { product?: Product; error?: string };
      if (res.ok && data.product) {
        setProducts((prev) => [data.product!, ...prev]);
        setForm({ title: "", category: form.category, price: "", discountPercent: "0", stock: "10", description: "", image: form.image });
        setCustomImage("");
        notify("محصول جدید اضافه شد.");
      } else {
        notify(data.error ?? "افزودن محصول ناموفق بود.", "error");
      }
    } catch {
      notify("ارتباط با سرور برقرار نشد.", "error");
    } finally {
      setAdding(false);
    }
  }

  async function logout() {
    await fetch("/api/seller/logout", { method: "POST" });
    router.push("/seller/login");
  }

  if (checking) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-nella-200 border-t-nella-500" />
      </div>
    );
  }

  const totalSold = products.reduce((s, p) => s + p.sold, 0);
  const inStock = products.filter((p) => p.stock > 0).length;
  const filtered = products.filter((p) => p.title.includes(filter.trim()) || filter.trim() === "");
  const stockValue = products.reduce((s, p) => s + p.stock * finalPrice(p.price, p.discountPercent), 0);

  return (
    <div className="space-y-6">
      {/* هدر پنل */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-gradient-to-l from-nella-500 to-sky-500 p-5 text-white shadow-card">
        <div>
          <h1 className="text-xl font-extrabold">پنل مدیریت فروشنده 🛠️</h1>
          <p className="mt-1 text-xs text-white/85">ویرایش قیمت، موجودی و افزودن محصول جدید</p>
        </div>
        <div className="flex gap-2">
          <Linkish />
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-white/20 px-4 py-2 text-xs font-bold ring-1 ring-white/40 hover:bg-white/30"
          >
            خروج از حساب
          </button>
        </div>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon="📦" label="تعداد محصولات" value={toPersianDigits(products.length)} />
        <Stat icon="✅" label="موجود در انبار" value={toPersianDigits(inStock)} />
        <Stat icon="🔥" label="فروش کل" value={toPersianDigits(totalSold)} />
        <Stat icon="💰" label="ارزش انبار" value={`${formatPrice(Math.round(stockValue))} تومان`} />
      </div>

      {/* فرم افزودن محصول */}
      <section className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nella-100/60">
        <h2 className="text-lg font-extrabold text-slate-800">➕ افزودن محصول جدید</h2>
        <form onSubmit={addProduct} className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-bold text-slate-600">نام محصول</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="مثلاً: هدفون بلوتوثی مدل X"
              className="w-full rounded-xl bg-nella-50 px-3 py-2.5 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">دسته‌بندی</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl bg-nella-50 px-3 py-2.5 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">قیمت (تومان)</label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              type="number"
              min={1}
              placeholder="0"
              className="w-full rounded-xl bg-nella-50 px-3 py-2.5 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">درصد تخفیف</label>
            <input
              value={form.discountPercent}
              onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
              type="number"
              min={0}
              max={90}
              className="w-full rounded-xl bg-nella-50 px-3 py-2.5 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">موجودی انبار</label>
            <input
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              type="number"
              min={0}
              className="w-full rounded-xl bg-nella-50 px-3 py-2.5 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-bold text-slate-600">توضیحات محصول</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="ویژگی‌های محصول را بنویسید…"
              className="w-full rounded-xl bg-nella-50 px-3 py-2.5 text-sm leading-7 outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-slate-600">تصویر محصول</label>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {presetImages.map((img) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setForm({ ...form, image: img.src })}
                  title={img.label}
                  className={`relative aspect-square overflow-hidden rounded-xl ring-2 transition ${
                    form.image === img.src && !customImage ? "ring-nella-500 scale-105" : "ring-transparent hover:ring-nella-200"
                  }`}
                >
                  <Image src={img.src} alt={img.label} fill sizes="70px" className="object-cover" />
                </button>
              ))}
            </div>
            <input
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
              placeholder="یا آدرس تصویر دلخواه (URL) را وارد کنید"
              className="mt-2 w-full rounded-xl bg-nella-50 px-3 py-2 text-xs outline-none ring-1 ring-nella-100 focus:ring-nella-300"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={adding}
              className="w-full rounded-2xl bg-gradient-to-l from-nella-500 to-sky-500 py-3 text-sm font-extrabold text-white shadow-card transition hover:opacity-90 disabled:opacity-60"
            >
              {adding ? "در حال افزودن…" : "افزودن محصول به فروشگاه"}
            </button>
          </div>
        </form>
      </section>

      {/* جدول محصولات */}
      <section className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nella-100/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-slate-800">📋 مدیریت محصولات و قیمت‌ها</h2>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="جست‌وجو در محصولات پنل…"
            className="rounded-xl bg-nella-50 px-3 py-2 text-sm outline-none ring-1 ring-nella-100 focus:ring-nella-300"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-right text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="pb-2 font-medium">محصول</th>
                <th className="pb-2 font-medium">دسته</th>
                <th className="pb-2 font-medium">قیمت (تومان)</th>
                <th className="pb-2 font-medium">تخفیف٪</th>
                <th className="pb-2 font-medium">موجودی</th>
                <th className="pb-2 font-medium">قیمت نهایی</th>
                <th className="pb-2 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nella-50">
              {filtered.map((p) => {
                const edit: EditState =
                  edits[p.id] ?? {
                    price: String(p.price),
                    discountPercent: String(p.discountPercent),
                    stock: String(p.stock),
                    title: p.title,
                  };
                const setEdit = (patch: Partial<EditState>) =>
                  setEdits((prev) => ({ ...prev, [p.id]: { ...edit, ...patch } }));

                return (
                  <tr key={p.id} className="align-middle">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-nella-50">
                          <Image src={p.image} alt={p.title} fill sizes="44px" className="object-cover" />
                        </span>
                        <input
                          value={edit.title}
                          onChange={(e) => setEdit({ title: e.target.value })}
                          className="w-full min-w-[140px] rounded-lg bg-nella-50/60 px-2 py-1.5 text-xs font-bold outline-none ring-1 ring-nella-100 focus:ring-nella-300"
                        />
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[11px] font-medium text-sky-700">
                        {categories.find((c) => c.id === p.category)?.label ?? p.category}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <input
                        value={edit.price}
                        onChange={(e) => setEdit({ price: e.target.value })}
                        type="number"
                        min={1}
                        className="w-28 rounded-lg bg-nella-50 px-2 py-1.5 text-xs outline-none ring-1 ring-nella-100 focus:ring-nella-300"
                      />
                    </td>
                    <td className="py-2.5">
                      <input
                        value={edit.discountPercent}
                        onChange={(e) => setEdit({ discountPercent: e.target.value })}
                        type="number"
                        min={0}
                        max={90}
                        className="w-16 rounded-lg bg-nella-50 px-2 py-1.5 text-xs outline-none ring-1 ring-nella-100 focus:ring-nella-300"
                      />
                    </td>
                    <td className="py-2.5">
                      <input
                        value={edit.stock}
                        onChange={(e) => setEdit({ stock: e.target.value })}
                        type="number"
                        min={0}
                        className={`w-16 rounded-lg px-2 py-1.5 text-xs outline-none ring-1 focus:ring-nella-300 ${
                          Number(edit.stock) > 0 ? "bg-nella-50 ring-nella-100" : "bg-rose-50 text-rose-600 ring-rose-200"
                        }`}
                      />
                    </td>
                    <td className="py-2.5 text-xs font-extrabold text-nella-700">
                      {formatPrice(finalPrice(Number(edit.price) || 0, Number(edit.discountPercent) || 0))}
                    </td>
                    <td className="py-2.5">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => saveProduct(p)}
                          disabled={savingId === p.id}
                          className="rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
                        >
                          {savingId === p.id ? "…" : "ذخیره"}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p)}
                          className="rounded-lg bg-rose-100 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-200"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-slate-400">
                    محصولی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* نوتیفیکیشن */}
      {toast && (
        <div
          className={`fixed bottom-5 left-5 z-50 animate-fade-up rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg ${
            toast.kind === "success" ? "bg-emerald-500" : "bg-rose-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Linkish() {
  return (
    <a href="/" className="rounded-xl bg-white/20 px-4 py-2 text-xs font-bold ring-1 ring-white/40 hover:bg-white/30">
      مشاهده فروشگاه
    </a>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-nella-100/60">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-nella-100 text-lg">{icon}</span>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className="mt-2 text-base font-extrabold text-nella-700">{value}</div>
    </div>
  );
}
