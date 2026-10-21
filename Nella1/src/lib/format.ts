const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => faDigits[Number(d)]);
}

export function formatPrice(value: number): string {
  return toPersianDigits(value.toLocaleString("en-US"));
}

export function formatPriceToman(value: number): string {
  return `${formatPrice(value)} تومان`;
}

export function finalPrice(price: number, discountPercent: number): number {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.round((price * (100 - discountPercent)) / 100);
}

export function slugify(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, "")
    .slice(0, 80);
}
