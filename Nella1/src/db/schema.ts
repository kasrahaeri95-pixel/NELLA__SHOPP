import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull(),
  discountPercent: integer("discount_percent").notNull().default(0),
  image: text("image").notNull(),
  stock: integer("stock").notNull().default(10),
  sold: integer("sold").notNull().default(0),
  rating: real("rating").notNull().default(4.5),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
