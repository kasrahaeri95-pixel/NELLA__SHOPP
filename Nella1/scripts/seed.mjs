import pg from "pg";

const { Pool } = pg;

const IMG = "/images/products/";

const products = [
  // کالای دیجیتال
  { title: "هدفون بی‌سیم سونی مدل WH-1000XM5", slug: "sony-wh1000xm5", category: "digital", price: 14900000, discountPercent: 12, image: `${IMG}headphones-white.jpg`, stock: 15, sold: 320, rating: 4.8, description: "هدفون بی‌سیم نویز کنسلینگ حرفه‌ای سونی با ۳۰ ساعت شارژدهی، صدای فراگیر و صدای گفتگوی شفاف. تجربه‌ای متفاوت از موسیقی با کیفیت Hi-Res." },
  { title: "هدفون بی‌سیم گیمینگ RGB حرفه‌ای", slug: "gaming-headphones-rgb", category: "digital", price: 2450000, discountPercent: 25, image: `${IMG}headphones-black.jpg`, stock: 40, sold: 180, rating: 4.4, description: "هدست گیمینگ با درایور ۵۰ میلی‌متری، نورپردازی RGB و میکروفن حذف نویز؛ مناسب بازی‌های رقابتی و استریم." },
  { title: "ساعت هوشمند اپل واچ سری ۹ سایز ۴۵", slug: "apple-watch-series-9", category: "digital", price: 18700000, discountPercent: 8, image: `${IMG}watch-smart.jpg`, stock: 8, sold: 96, rating: 4.9, description: "نمایشگر همیشه روشن، سنسورهای پیشرفته سلامت، ضدآب تا عمق ۵۰ متر و پردازنده سری ۹ با عملکرد فوق‌العاده سریع." },
  { title: "ساعت مچی کلاسیک مردانه اسکیمی", slug: "classic-mens-watch", category: "digital", price: 3250000, discountPercent: 20, image: `${IMG}watch-classic.jpg`, stock: 22, sold: 74, rating: 4.3, description: "ساعت کلاسیک با بدنه فولاد ضدزنگ، بند چرم طبیعی و مقاوم تا ۵۰ متر؛ همراه با ۲ سال گارانتی." },
  { title: "گوشی موبایل سامسونگ گلکسی A55 ۵G", slug: "galaxy-a55-5g", category: "digital", price: 16500000, discountPercent: 5, image: `${IMG}phone-blue.jpg`, stock: 12, sold: 210, rating: 4.6, description: "نمایشگر ۶.۶ اینچی سوپر آمولد، دوربین سه‌گانه ۵۰ مگاپیکسل، باتری ۵۰۰۰ میلی‌آمپری و اندروید ۱۴." },
  { title: "لپ‌تاپ ایسوس ویووبوک ۱۵ Core i5", slug: "asus-vivobook-15", category: "digital", price: 24900000, discountPercent: 15, image: `${IMG}laptop-minimal.jpg`, stock: 6, sold: 58, rating: 4.5, description: "لپ‌تاپ ۱۵.۶ اینچی با پردازنده Core i5 نسل ۱۳، ۱۶ گیگ رم، SSD ظرفیت ۵۱۲ گیگابایت و ویندوز ۱۱ اورجینال." },
  { title: "دوربین عکاسی قدیمی رفلکس دوعدسی", slug: "retro-slr-camera", category: "digital", price: 5600000, discountPercent: 0, image: `${IMG}camera-vintage.jpg`, stock: 9, sold: 31, rating: 4.2, description: "دوربین کالکشن‌ای رفلکس دوعدسی با بند چرمی؛ مناسب عکاسان علاقه‌مند به عکاسی کلاسیک و دکور خانه." },

  // مد و پوشاک
  { title: "کیف چرم دستی زنانه مدل میلانو", slug: "milano-leather-bag", category: "fashion", price: 4200000, discountPercent: 30, image: `${IMG}handbag-brown.jpg`, stock: 18, sold: 140, rating: 4.7, description: "کیف دستی چرم طبیعی با دوختی دقیق، آستر ساتن و بند قابل تنظیم؛ سبک، جادار و مناسب مهمانی." },
  { title: "کیف دوشی چرم مشکی مجلسی", slug: "black-shoulder-bag", category: "fashion", price: 3100000, discountPercent: 10, image: `${IMG}handbag-black.jpg`, stock: 25, sold: 88, rating: 4.4, description: "کیف دوشی چرم مصنوعی درجه یک با زیپ فلزی مقاوم، چندین جیب داخلی و طراحی مینیمال." },
  { title: "عینک آفتابی مخصوص رانندگی پلاریزه", slug: "driving-sunglasses", category: "fashion", price: 1850000, discountPercent: 18, image: `${IMG}sunglasses.jpg`, stock: 33, sold: 65, rating: 4.3, description: "عدسی پلاریزه با محافظت UV400، فریم سبک فلزی و چندلایه؛ کاهش درخشش نور برای رانندگی امن." },

  // ورزش و سفر
  { title: "کفش کتانی روزانه مردانه سفید", slug: "white-daily-sneakers", category: "sports", price: 2980000, discountPercent: 22, image: `${IMG}sneakers-white.jpg`, stock: 28, sold: 190, rating: 4.6, description: "رویه مشبک سبک با زیره لاستیکی ضدر sliding؛ کفش روزانه مناسب پیاده‌روی طولانی و استایل اسپرت." },
  { title: "کفش ورزشی اسپرت خاکستری", slug: "gray-sport-shoes", category: "sports", price: 3450000, discountPercent: 12, image: `${IMG}sneakers-gray.jpg`, stock: 14, sold: 120, rating: 4.5, description: "کفش دویدن با فوم EVA جاذب ضربه، رویه نخی ضدتعریق و زیره مقاوم؛ مناسب باشگاه و دویدن در فضای باز." },

  // آرایشی و بهداشتی
  { title: "سرم صورت نیاسینامید ۱۰٪ ویتامین B3", slug: "niacinamide-serum-10", category: "beauty", price: 890000, discountPercent: 15, image: `${IMG}skincare-serum.jpg`, stock: 50, sold: 260, rating: 4.8, description: "سرم کنترل چربی و کوچک کردن منافذ با نیاسینامید ۱۰٪؛ بافت سبک و سریع‌جذب مناسب پوست‌های چرب و مختلط." },
  { title: "کرم مرطوب‌کننده صورت ۲۴ ساعته صورتی", slug: "pink-moisturizer-cream", category: "beauty", price: 1250000, discountPercent: 20, image: `${IMG}cosmetics-pink.jpg`, stock: 44, sold: 175, rating: 4.5, description: "کرم مرطوب‌کننده روز و شب با اسید هیالورونیک و عصاره گل رز؛ آبرسانی عمیق و درخشش طبیعی پوست." },
  { title: "ادکلن مردانه لاکچری ۱۰۰ میلی‌لیتر", slug: "mens-luxury-cologne", category: "beauty", price: 3900000, discountPercent: 35, image: `${IMG}perfume-lux.jpg`, stock: 11, sold: 92, rating: 4.6, description: "رایحه مردانه ماندگار با نت‌های مرکبات، چوب صندل و وانیل؛ ماندگاری بیش از ۸ ساعت." },
  { title: "ادوپرفیوم زنانه طلایی ۹۰ میلی‌لیتر", slug: "golden-women-perfume", category: "beauty", price: 5200000, discountPercent: 0, image: `${IMG}perfume-gold.jpg`, stock: 7, sold: 64, rating: 4.7, description: "عطر زنانه لوکس با نت‌های یاس، هل و مشک سفید؛ طراحی شیشه‌ای طلایی مناسب هدیه." },

  // خانه و آشپزخانه
  { title: "اسپرسوساز حرفه‌ای خانگی ۲۰ بار", slug: "home-espresso-machine", category: "home", price: 9800000, discountPercent: 10, image: `${IMG}espresso-machine.jpg`, stock: 5, sold: 40, rating: 4.4, description: "اسپرسوسای ۲۰ بار با کف‌گیر شیر خودکار، مخزن ۱.۵ لیتری و بدنه استیل؛ آماده‌سازی انواع نوشیدنی‌های قهوه." },

  // اسباب‌بازی
  { title: "عروسک پولیشی دخترانه صورتی", slug: "pink-girl-teddy", category: "toys", price: 780000, discountPercent: 25, image: `${IMG}teddy-pink.jpg`, stock: 60, sold: 150, rating: 4.9, description: "عروسک پولیشی نرم و ضدحساسیت با لباس صورتی بافتنی؛ دوست طبیعت گردی کودکان بالای ۳ سال." },
  { title: "عروسک خرس پشمالو قهوه‌ای ۵۰ سانتی", slug: "brown-teddy-bear", category: "toys", price: 1150000, discountPercent: 0, image: `${IMG}teddy-brown.jpg`, stock: 35, sold: 98, rating: 4.8, description: "خرس پشمالو بزرگ با پرخی فوق‌نرم و دوخت تقویت‌شده؛ هدیه‌ای عالی برای تولد و مناسبت‌ها." },
];

const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db" });

await pool.query('delete from "products"');

for (const p of products) {
  await pool.query(
    `insert into "products" ("title","slug","category","description","price","discount_percent","image","stock","sold","rating")
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [p.title, p.slug, p.category, p.description, p.price, p.discountPercent, p.image, p.stock, p.sold, p.rating],
  );
}

const { rows } = await pool.query('select count(*)::int as count from "products"');
console.log("seeded products:", rows[0].count);
await pool.end();
