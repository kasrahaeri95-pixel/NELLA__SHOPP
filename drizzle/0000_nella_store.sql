CREATE TYPE "public"."order_status" AS ENUM ('pending', 'confirmed', 'preparing', 'shipped', 'completed', 'cancelled');

CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(120) NOT NULL,
  "slug" varchar(140) NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "categories_slug_uidx" ON "categories" USING btree ("slug");

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_id" uuid,
  "name" varchar(180) NOT NULL,
  "slug" varchar(200) NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "price_toman" integer NOT NULL,
  "compare_at_price_toman" integer,
  "stock_quantity" integer DEFAULT 0 NOT NULL,
  "is_published" boolean DEFAULT false NOT NULL,
  "is_featured" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX "products_slug_uidx" ON "products" USING btree ("slug");
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");
CREATE INDEX "products_published_created_idx" ON "products" USING btree ("is_published", "created_at");

CREATE TABLE "product_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "storage_key" text NOT NULL,
  "alt_text" varchar(240) DEFAULT '' NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "is_primary" boolean DEFAULT false NOT NULL,
  "is_temporary_sample" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
);
CREATE INDEX "product_images_product_id_idx" ON "product_images" USING btree ("product_id");

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_number" varchar(32) NOT NULL,
  "customer_name" varchar(160) NOT NULL,
  "phone" varchar(32) NOT NULL,
  "province" varchar(100),
  "city" varchar(100),
  "address" text,
  "postal_code" varchar(24),
  "subtotal_toman" integer NOT NULL,
  "shipping_toman" integer DEFAULT 0 NOT NULL,
  "total_toman" integer NOT NULL,
  "status" "order_status" DEFAULT 'pending' NOT NULL,
  "customer_note" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "orders_order_number_uidx" ON "orders" USING btree ("order_number");
CREATE INDEX "orders_status_created_idx" ON "orders" USING btree ("status", "created_at");
CREATE INDEX "orders_phone_idx" ON "orders" USING btree ("phone");

CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL,
  "product_id" uuid,
  "product_name_snapshot" varchar(180) NOT NULL,
  "unit_price_toman" integer NOT NULL,
  "quantity" integer NOT NULL,
  "line_total_toman" integer NOT NULL,
  CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
  CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL
);
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");

CREATE TABLE "store_settings" (
  "key" varchar(120) PRIMARY KEY NOT NULL,
  "value" jsonb NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
