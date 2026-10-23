"use client";

import React from "react";
import { Sparkles, Heart, Gift, Smile, Gem, Flame, Layers } from "lucide-react";

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  {
    name: "همه",
    label: "همه کالاها",
    icon: Layers,
    bg: "bg-pink-100",
    text: "text-pink-600",
    ring: "ring-pink-300",
  },
  {
    name: "لوازم آرایشی",
    label: "لوازم آرایشی",
    icon: Sparkles,
    bg: "bg-rose-100",
    text: "text-rose-600",
    ring: "ring-rose-300",
  },
  {
    name: "مراقبت پوستی",
    label: "مراقبت پوستی",
    icon: Heart,
    bg: "bg-sky-100",
    text: "text-sky-600",
    ring: "ring-sky-300",
  },
  {
    name: "عطر و ادکلن",
    label: "عطر و رایحه",
    icon: Flame,
    bg: "bg-purple-100",
    text: "text-purple-600",
    ring: "ring-purple-300",
  },
  {
    name: "زیورآلات و اکسسوری",
    label: "اکسسوری و زیورآلات",
    icon: Gem,
    bg: "bg-pink-100",
    text: "text-pink-600",
    ring: "ring-pink-300",
  },
  {
    name: "لوازم فانتزی و کادویی",
    label: "فانتزی و کادو",
    icon: Gift,
    bg: "bg-sky-100",
    text: "text-sky-600",
    ring: "ring-sky-300",
  },
];

export function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
          <Smile className="w-5 h-5 text-pink-500" />
          <span>دسته‌بندی‌های محبوب نلا شاپ</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium">انتخاب سریع دسته‌ها</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all cursor-pointer text-center group ${
                isSelected
                  ? "bg-white shadow-md ring-2 ring-pink-400 scale-102"
                  : "bg-white/80 hover:bg-white hover:shadow-sm border border-pink-50"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${cat.bg} ${cat.text} flex items-center justify-center mb-2 shadow-inner transition-transform group-hover:scale-110`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <span
                className={`text-xs font-bold transition-colors ${
                  isSelected ? "text-pink-600" : "text-slate-700 group-hover:text-pink-600"
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
