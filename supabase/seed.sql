-- =============================================
-- Seed data for Masale E-commerce
-- Run AFTER schema.sql in Supabase SQL Editor
-- =============================================

-- Clear existing (optional)
TRUNCATE order_items, orders, product_variants, products, categories RESTART IDENTITY CASCADE;

-- Categories
INSERT INTO categories (name, slug, description, image_url, display_order) VALUES
('CTC Spices', 'ctc-spices', 'Premium pure spices ground with traditional CTC method', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=400', 1),
('Blended Spices', 'blended-spices', 'Expertly blended masalas for authentic Indian flavors', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', 2),
('Quick Fry', 'quick-fry', 'Ready-to-use masalas for quick & tasty dishes', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=400', 3),
('Soya Chunks', 'soya-chunks', 'High protein soya chunks for healthy meals', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400', 4),
('Western Spices', 'western-spices', 'International flavors for modern kitchens', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=400', 5),
('Shahi Hing', 'shahi-hing', 'Pure & strong asafoetida for authentic taste', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=400', 6),
('Sprinkler', 'sprinkler', 'Convenient sprinkler packs for everyday use', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=400', 7),
('Combos', 'combos', 'Value packs and special combo offers', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', 8),
('Whole Spices', 'whole-spices', 'Fresh whole spices for maximum aroma', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=400', 9);

-- Products (category_id: 2 = Blended Spices, 3 = Quick Fry, etc.)
INSERT INTO products (category_id, name, slug, description, short_description, image_url, rating, review_count, is_featured, is_new, is_on_sale, sold_count) VALUES
(2, 'Achar Masala', 'achar-masala', 'Traditional pickle masala blend that adds authentic tangy and spicy flavor to homemade pickles.', 'Perfect blend for homemade pickles', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=500', 4.94, 128, true, false, true, 50),
(2, 'Chat Masala', 'chat-masala', 'Zesty and tangy chat masala that elevates street-style snacks, fruits, and salads.', 'Tangy & spicy for chaats and snacks', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500', 4.88, 95, true, false, true, 150),
(2, 'Jeeravan (Poha) Masala', 'jeeravan-masala', 'Authentic Indori Jeeravan masala specially crafted for perfect poha.', 'Authentic Indori taste for poha', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=500', 4.82, 210, true, false, true, 100),
(2, 'Garam Masala', 'garam-masala', 'Premium blended spice with strong distinct fragrance. Perfect for curries, lentils, biryanis.', 'Rich aroma for curries & biryanis', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=500', 4.78, 156, true, false, true, 200),
(2, 'Chana Masala', 'chana-masala', 'Specially formulated blend to make restaurant-style chole at home.', 'Restaurant style chole masala', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500', 4.72, 88, false, false, true, 80),
(2, 'Kitchen King Masala', 'kitchen-king-masala', 'All-purpose masala that works wonders in almost every Indian dish.', 'All-purpose kitchen essential', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=500', 4.85, 142, true, false, true, 120),
(3, 'Quick Fry Dal Tadka Masala', 'quick-fry-dal-tadka-masala', 'Superfast and easy flavor. Make perfect dal tadka in minutes.', 'Restaurant style dal in minutes', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=500', 4.59, 76, true, false, true, 200),
(3, 'Pasta Masala', 'pasta-masala', 'India''s first pasta masala. Turn regular pasta into restaurant-style deliciousness.', 'Restaurant style pasta at home', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500', 4.89, 320, true, true, true, 100),
(3, 'Spice Booster', 'spice-booster', 'Instant flavor booster for any dish.', 'Instant flavor for any dish', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=500', 4.79, 95, true, false, true, 200),
(9, 'Jeera (Cumin Seeds Whole)', 'jeera-cumin-seeds', 'Premium quality whole cumin seeds with intense aroma.', 'Premium whole cumin seeds', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=500', 4.78, 540, true, true, true, 500),
(9, 'Black Pepper Whole', 'black-pepper-whole', 'Bold and aromatic whole black peppercorns.', 'Bold aromatic peppercorns', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500', 4.50, 89, false, true, true, 100),
(6, 'Hing Powder (Asafoetida)', 'hing-powder', 'Pure & strong asafoetida powder. Just a pinch adds so much flavor.', 'Pure & strong asafoetida', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=500', 4.94, 410, true, false, true, 200),
(8, 'Indi Kitchen Favourites 600gm Box', 'indi-kitchen-favourites', 'A curated box of 6 essential masalas for the Indian kitchen.', '6 essential masalas in one box', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=500', 5.00, 65, true, false, true, 50),
(8, 'CrunchTime Sprinkler Combo', 'crunchtime-sprinkler-combo', 'Chat, Jeeravan & Sandwich Masala 100g each.', '3 sprinkler masalas combo', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500', 5.00, 42, true, false, true, 50),
(4, 'Soya Chunks (Bold)', 'soya-chunks-bold', 'High protein bold soya chunks. Perfect for curries and healthy meals.', 'High protein bold chunks', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500', 5.00, 55, false, false, true, 50),
(2, 'Tea Masala', 'tea-masala', 'Aromatic blend of spices specially crafted for perfect masala chai.', 'Perfect blend for masala chai', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=500', 4.81, 380, true, false, true, 350),
(2, 'Punjabi Garam Masala', 'punjabi-garam-masala', 'Authentic Punjabi style garam masala with robust flavor.', 'Authentic Punjabi style', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=500', 5.00, 72, true, false, true, 50),
(2, 'Shahi Biryani Masala', 'shahi-biryani-masala', 'Royal blend for fragrant and flavorful biryanis.', 'Royal blend for biryani', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500', 4.89, 110, true, false, true, 50),
(2, 'Red Chilli Powder', 'red-chilli-powder', 'Vibrant color and perfect heat. Pure red chilli powder.', 'Vibrant color & perfect heat', 'https://images.unsplash.com/photo-1506368249639-73a05d4d2e42?w=500', 4.73, 190, false, false, true, 100),
(2, 'Mix Masala Powder', 'mix-masala-powder', 'High-spice blend to elevate flavor, aroma and color of vegetable dishes.', 'High spice content for veggies', 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=500', 4.78, 65, false, true, true, 50);

-- Variants
INSERT INTO product_variants (product_id, weight, price, compare_at_price, is_default) VALUES
-- Achar Masala (1)
(1, '100g', 191, 233, true), (1, '200g', 360, 450, false), (1, '500g', 850, 1100, false),
-- Chat Masala (2)
(2, '100g Sprinkler', 67, 94, true), (2, '100g', 73, 89, false), (2, '200g', 130, 160, false),
-- Jeeravan (3)
(3, '100g Sprinkler', 44, 68, true), (3, '100g', 50, 70, false), (3, '200g', 90, 130, false),
-- Garam Masala (4)
(4, '50g', 35, 45, false), (4, '100g', 60, 75, true), (4, '200g', 110, 140, false),
-- Chana Masala (5)
(5, '100g', 83, 102, true), (5, '200g', 155, 190, false),
-- Kitchen King (6)
(6, '100g', 76, 102, true), (6, '200g', 140, 190, false),
-- Dal Tadka (7)
(7, '50g', 35, 50, false), (7, '100g', 60, 88, true),
-- Pasta Masala (8)
(8, '50g', 70, 110, false), (8, '100g', 121, 200, true),
-- Spice Booster (9)
(9, '50g', 70, 110, false), (9, '100g', 121, 200, true),
-- Jeera (10)
(10, '100g', 120, 180, false), (10, '200g', 220, 340, false), (10, '500g', 449, 800, true),
-- Black Pepper (11)
(11, '100g', 180, 250, false), (11, '200g', 340, 480, false), (11, '500g', 616, 880, true),
-- Hing (12)
(12, '50g', 315, 395, true), (12, '100g', 580, 750, false),
-- Indi Kitchen (13)
(13, '600g Box', 440, 564, true),
-- CrunchTime (14)
(14, '3 x 100g', 159, 227, true),
-- Soya (15)
(15, '200g', 53, 64, true), (15, '500g', 120, 150, false),
-- Tea Masala (16)
(16, '50g', 30, 40, false), (16, '100g', 53, 72, true),
-- Punjabi Garam (17)
(17, '50g', 30, 40, false), (17, '100g', 50, 59, true),
-- Shahi Biryani (18)
(18, '50g', 40, 50, false), (18, '100g', 66, 78, true),
-- Red Chilli (19)
(19, '100g', 45, 55, false), (19, '200g', 85, 105, false), (19, '500g', 120, 148, true),
-- Mix Masala (20)
(20, '50g', 20, 25, false), (20, '100g', 37, 44, true);