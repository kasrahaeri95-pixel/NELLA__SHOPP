import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";

const vazir = localFont({
  src: [
    { path: "../../public/fonts/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Vazirmatn-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Vazirmatn-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Vazirmatn-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NELLA_SHOPP | فروشگاه اینترنتی نلا",
  description:
    "نلا شاپ، فروشگاه اینترنتی خرید کالای دیجیتال، مد و پوشاک، آرایشی و بهداشتی و اسباب‌بازی با ارسال سریع و ضمانت اصالت کالا.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="flex min-h-screen flex-col text-slate-800 antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-7xl flex-1 px-3 pb-14 pt-4 sm:px-5">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
