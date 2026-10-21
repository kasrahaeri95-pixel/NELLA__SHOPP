import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import { categoryLabel } from "@/lib/categories";
import { finalPrice, formatPrice, toPersianDigits } from "@/lib/format";
import { getProductBySlug, relatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const specsByCategory: Record<string, [string, string][]> = {
  digital: [
    ["گارانتی", "۱۸ ماه شرکتی"],
    ["ارسال", "۲۴ ساعته اکسپرس"],
    ["نوع بسته‌بندی", "جعبه اورجینال"],
  ],
  fashion: [
    ["جنس", "چرم طبیعی / پارچه"],
    ["گارانتی", "۶ ماه"],
    ["سایزبندی", "استاندارد"],
  ],
  beauty: [
    ["پژوهشگاه", "دارای مجوز بهداشت"],
    ["حجم", "۵۰–۱۰۰ میلی‌لیتر"],
    ["مناسب پوست", "همه انواع پوست"],
  ],
};

const defaultSpecs: [string, string][] = [
  ["گارانتی اصالت", "دارد"],
  ["امکان بازگشت", "تا ۷ روز"],
  ["ارسال", "سراسر ایران"],
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await relatedProducts(product.category, product.id, 4);
  const price = finalPrice(product.price, product.discountPercent);
  const specs = specsByCategory[product.category] ?? defaultSpecs;

  return (
    <div className="space-y-8">
      {/* بردکرامب */}
      <nav className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
        <Link href="/" className="hover:text-nella-600">
          خانه
        </Link>
        <span>/</span>
        <Link href={`/search?category=${product.category}`} className="hover:text-nella-600">
          {categoryLabel(product.category)}
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-slate-700">{product.title}</span>
      </nav>

      <div className="grid gap-6 rounded-3xl bg-white p-4 shadow-card ring-1 ring-nella-100/60 md:grid-cols-2 md:p-6">
        {/* تصویر */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-nella-50">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
          {product.discountPercent > 0 && (
            <span className="absolute right-3 top-3 rounded-xl bg-nella-600 px-2.5 py-1 text-xs font-extrabold text-white shadow">
              {toPersianDigits(product.discountPercent)}٪ تخفیف
            </span>
          )}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-nella-50 ring-1 ring-nella-100">
                <Image src={product.image} alt={`${product.title} ${i + 1}`} fill sizes="120px" className="object-cover opacity-90" />
              </div>
            ))}
          </div>
        </div>

        {/* اطلاعات */}
        <div className="flex flex-col">
          <span className="w-fit rounded-lg bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-700">
            {categoryLabel(product.category)}
          </span>
          <h1 className="mt-2 text-xl font-extrabold leading-8 text-slate-900 sm:text-2xl">{product.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 font-bold text-amber-600">
              ★ {toPersianDigits(product.rating.toFixed(1))}
            </span>
            <span>{toPersianDigits(product.sold)} فروش موفق</span>
            <span className="text-emerald-600">{product.stock > 0 ? `موجودی: ${toPersianDigits(product.stock)} عدد` : "ناموجود"}</span>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">{product.description}</p>

          <div className="mt-5 rounded-2xl bg-gradient-to-l from-nella-50 to-sky-50 p-4">
            <div className="flex items-baseline gap-2">
              {product.discountPercent > 0 && (
                <span className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>
              )}
              <span className="text-2xl font-extrabold text-nella-700">{formatPrice(price)}</span>
              <span className="text-sm text-slate-500">تومان</span>
            </div>
            {product.discountPercent > 0 && (
              <p className="mt-1 text-xs font-bold text-nella-600">
                سود شما از این خرید: {formatPrice(product.price - price)} تومان
              </p>
            )}
          </div>

          <div className="mt-5">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-nella-100">
              🚚 ارسال اکسپرس ۲۴ ساعته
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-nella-100">
              ↩️ ۷ روز ضمانت بازگشت
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-nella-100">
              🛡️ ضمانت اصالت کالا
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white p-2 ring-1 ring-nella-100">
              💳 پرداخت در محل
            </div>
          </div>
        </div>
      </div>

      {/* مشخصات */}
      <section className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-nella-100/60">
        <h2 className="text-base font-extrabold text-slate-800">مشخصات و توضیحات</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">{product.description}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {specs.map(([key, value]) => (
            <div key={key} className="flex justify-between rounded-xl bg-nella-50/70 px-3 py-2 text-sm">
              <span className="text-slate-500">{key}</span>
              <span className="font-bold text-slate-700">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* محصولات مشابه */}
      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-extrabold text-slate-800">محصولات مشابه</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
