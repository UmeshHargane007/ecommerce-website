-- =============================================
-- Masale E-commerce – Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  slug          VARCHAR(100) NOT NULL UNIQUE,
  description   TEXT DEFAULT '',
  image_url     TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id                 BIGSERIAL PRIMARY KEY,
  category_id        BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  name               VARCHAR(255) NOT NULL,
  slug               VARCHAR(255) NOT NULL UNIQUE,
  description        TEXT DEFAULT '',
  short_description  TEXT DEFAULT '',
  image_url          TEXT DEFAULT '',
  rating             DECIMAL(3,2) DEFAULT 4.5,
  review_count       INT DEFAULT 0,
  is_featured        BOOLEAN DEFAULT false,
  is_new             BOOLEAN DEFAULT false,
  is_on_sale         BOOLEAN DEFAULT false,
  sold_count         INT DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Variants (weight / pack)
CREATE TABLE IF NOT EXISTS product_variants (
  id               BIGSERIAL PRIMARY KEY,
  product_id       BIGINT REFERENCES products(id) ON DELETE CASCADE,
  weight           VARCHAR(50) NOT NULL,
  price            DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  stock            INT DEFAULT 100,
  sku              VARCHAR(100) DEFAULT '',
  is_default       BOOLEAN DEFAULT false
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
  id               BIGSERIAL PRIMARY KEY,
  session_id       VARCHAR(100),
  status           VARCHAR(50) DEFAULT 'pending',
  total_amount     DECIMAL(12,2) NOT NULL,
  shipping_address TEXT DEFAULT '',
  payment_method   VARCHAR(50) DEFAULT 'cod',
  customer_name    VARCHAR(150),
  customer_phone   VARCHAR(20),
  customer_email   VARCHAR(255),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id         BIGSERIAL PRIMARY KEY,
  order_id   BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  variant_id BIGINT REFERENCES product_variants(id),
  name       VARCHAR(255),
  weight     VARCHAR(50),
  quantity   INT NOT NULL,
  price      DECIMAL(10,2) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- =============================================
-- Row Level Security (RLS) – allow public read
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public can READ categories, products, variants
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);

-- Anyone can INSERT orders (guest checkout)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Public can read their own order by id (optional)
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);

-- =============================================
-- Helpful VIEW: products with default price
-- =============================================
CREATE OR REPLACE VIEW products_with_price AS
SELECT
  p.*,
  c.name AS category_name,
  c.slug AS category_slug,
  (
    SELECT MIN(pv.price)
    FROM product_variants pv
    WHERE pv.product_id = p.id
  ) AS min_price
FROM products p
LEFT JOIN categories c ON c.id = p.category_id;