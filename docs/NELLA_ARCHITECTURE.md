# NELLA SHOPP — Architecture & Implementation Plan

## Confirmed product decisions

- Product management: store owner uses a private admin panel.
- Orders: checkout is stored in the website database and the customer can also contact the store through WhatsApp.
- Product imagery: launch with clearly marked temporary/sample imagery; replace with real product photos uploaded by the owner.
- Brand reference: Instagram handle `nella__shopp`; visual direction is pastel pink, warm white, cream and soft lilac.
- Store language and layout: Persian, RTL, responsive/mobile-first.
- Existing work must be extended, not discarded.

## Repository assessment (2026-11-10)

The repository already contains a substantial root `index.html` prototype (about 110 KB) with product-grid UI, product detail modal, default sample products, and localStorage keys for products, orders, cart and messages. Its product/order persistence is browser-local and therefore is not a shared, owner-managed production database.

The root `package.json` is a Next.js 16 / React 19 / TypeScript template with Drizzle ORM and PostgreSQL dependencies. The existing prototype and this template need to be reconciled carefully; do not overwrite the prototype or assume the database is configured.

## Target architecture

- Frontend: Next.js App Router, TypeScript, Tailwind CSS; Persian RTL.
- Database: PostgreSQL, accessed through Drizzle ORM.
- Authentication: secure server-side owner authentication; no public admin registration.
- Product media: managed object storage with server-authorized uploads. Temporary assets must be clearly marked as samples until replaced.
- Hosting: GitHub as source control; deploy to a host that supports Next.js server routes and environment variables. A static-only host is insufficient for private admin APIs and database-backed checkout unless paired with a separate backend.

## Core data model

### categories
- id (UUID primary key)
- name, slug
- sort_order, is_active
- created_at, updated_at

### products
- id (UUID primary key)
- category_id (nullable foreign key)
- name, slug, description
- price_toman (integer; store whole toman)
- compare_at_price_toman (nullable integer)
- stock_quantity (integer, default 0)
- is_published (boolean)
- is_featured (boolean)
- created_at, updated_at

### product_images
- id (UUID primary key)
- product_id (foreign key)
- storage_key, alt_text
- sort_order, is_primary
- is_temporary_sample (boolean)
- created_at

### orders
- id (UUID primary key)
- order_number (unique)
- customer_name, phone
- province, city, address, postal_code (nullable until checkout requirements are finalized)
- subtotal_toman, shipping_toman, total_toman
- status (pending, confirmed, preparing, shipped, completed, cancelled)
- customer_note (nullable)
- created_at, updated_at

### order_items
- id (UUID primary key)
- order_id (foreign key)
- product_id (nullable foreign key to preserve historical orders)
- product_name_snapshot
- unit_price_toman
- quantity
- line_total_toman

### store_settings
- key (primary key)
- value (JSON)
- updated_at

## Main routes

- `/`: home page and featured/new products
- `/products`: searchable, filterable catalogue
- `/products/[slug]`: product details
- `/cart`: cart
- `/checkout`: customer details and order confirmation
- `/order/[orderNumber]`: order confirmation/status view (only safe, non-sensitive access)
- `/admin/login`: owner login
- `/admin`: dashboard
- `/admin/products`: product CRUD
- `/admin/categories`: category CRUD
- `/admin/orders`: order management
- `/admin/settings`: store contact, WhatsApp number, Instagram link and homepage banner

## Required behavior

1. Only the authenticated owner can create, edit, publish, unpublish or delete products and categories.
2. Owner can upload multiple images per product, choose a primary image and replace temporary sample images.
3. Every product and order change persists in PostgreSQL; browser localStorage may be used only for a non-authoritative cart draft.
4. Checkout creates a database order and immutable item snapshots. It must validate current prices and stock on the server.
5. After order creation, show order confirmation and a WhatsApp contact link containing a concise order reference. Do not expose private customer data in a public URL.
6. Never claim an order is paid. No online payment gateway is included until a real provider is configured.
7. Validate all inputs, protect admin routes and mutations server-side, rate-limit sensitive endpoints, and keep secrets out of client bundles.
8. Do not present sample imagery or invented products/prices as actual store inventory.

## Visual direction

Use the supplied Instagram screenshots only as references for the brand's overall style and product categories. Do not crop profile-grid screenshots into individual product photos. Use a refined pastel-pink/cream palette, generous whitespace, soft borders, readable Persian typography and consistent product-card proportions.

Initial categories:
- ماگ و فنجان فانتزی
- لوازم تحریر
- کیف و کوله
- پوشاک
- اکسسوری
- عروسک و محصولات فانتزی
- وسایل دکوری
- لوازم خانه و آشپزخانه

## Implementation milestones

1. Audit the full repository tree, current app entry points, API routes, database schema and deployment configuration.
2. Reconcile the existing HTML prototype with the Next.js application without deleting working UI.
3. Implement PostgreSQL schema and migrations.
4. Implement owner authentication and protected admin routes.
5. Implement product/category CRUD and authorized image uploads.
6. Implement catalogue, product details, cart and database-backed checkout.
7. Implement order management and WhatsApp handoff.
8. Add temporary sample-image handling and owner replacement workflow.
9. Test mobile RTL layout, authorization, CRUD, stock validation, order creation and production build.
10. Document environment variables and deployment steps.

## Non-goals for the first release

- No fake online payment.
- No public admin signup.
- No fake inventory, prices, customer reviews or sales statistics.
- No reliance on localStorage as the production database.
- No deletion/replacement of existing project files before their role is understood.
