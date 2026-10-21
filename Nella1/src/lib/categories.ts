export type Category = {
  id: string;
  label: string;
  emoji: string;
  tint: string;
};

export const categories: Category[] = [
  { id: "digital", label: "کالای دیجیتال", emoji: "📱", tint: "from-sky-100 to-sky-50" },
  { id: "fashion", label: "مد و پوشاک", emoji: "👜", tint: "from-pink-100 to-pink-50" },
  { id: "sports", label: "ورزش و سفر", emoji: "👟", tint: "from-emerald-100 to-emerald-50" },
  { id: "beauty", label: "آرایشی و بهداشتی", emoji: "💄", tint: "from-rose-100 to-rose-50" },
  { id: "home", label: "خانه و آشپزخانه", emoji: "🏠", tint: "from-amber-100 to-amber-50" },
  { id: "toys", label: "اسباب‌بازی", emoji: "🧸", tint: "from-violet-100 to-violet-50" },
];

export const categoryMap = new Map(categories.map((c) => [c.id, c]));

export function categoryLabel(id: string): string {
  return categoryMap.get(id)?.label ?? id;
}
