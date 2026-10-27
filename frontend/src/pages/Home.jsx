import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import ProductCard from '../components/ProductCard';

const benefits = [
  {
    title: 'Quick Delivery',
    description: 'Fresh flavors, right on time.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="35" cy="13" r="8" />
        <path d="M35 8v5l3 2M5 19h20v16H8M25 24h9l7 7v4h-5M25 35h-6" />
        <path d="M29 28h5l4 4H29z" />
        <circle cx="13" cy="36" r="3" />
        <circle cx="32" cy="36" r="3" />
        <path d="M3 24h10M1 29h8M4 34h3" />
      </svg>
    ),
  },
  {
    title: 'Authentic Taste',
    description: 'Traditional recipes, true to roots.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M17 22v-7a3 3 0 0 1 6 0v7l3-5a3 3 0 0 1 5 3l-3 8c-1 3-4 5-8 5h-3l-5-4V23z" />
        <path d="M5 26h7v12H5zM3 41h30a4 4 0 0 0 4-4v-1H15" />
        <path d="m38 8 1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" />
      </svg>
    ),
  },
  {
    title: 'Wide Range',
    description: 'Pickles, spices, snacks & more.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="19" />
        <circle cx="24" cy="24" r="15" />
        <path d="M17 18h14v17H17zM20 18v-4h8v4M21 23h6M21 27h6M21 31h4" />
      </svg>
    ),
  },
  {
    title: 'Trusted Brand',
    description: 'From the house of Kalyani Masale.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="19" r="14" />
        <circle cx="24" cy="19" r="10" />
        <path d="m24 12 2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6z" />
        <path d="m15 30-5 10 9-3 5 6 3-11M33 30l5 10-9-3" />
      </svg>
    ),
  },
  {
    title: 'Quality-Made',
    description: 'Clean, safe, and consistent.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 5 27 8l4-1 2 4 4 1v4l3 3-2 4 1 4-4 2-1 4h-4l-3 3-4-2-4 1-2-4-4-1v-4l-3-3 2-4-1-4 4-2 1-4h4z" />
        <circle cx="25" cy="19" r="7" />
        <path d="m25 15 1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4zM6 36c4-2 8-2 12 0l6 3c2 1 2 4-1 4H11l-5-2M6 36l-3 2 4 5" />
      </svg>
    ),
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [allProducts, featuredProducts, latestProducts, productCategories] =
          await Promise.all([
            getProducts({ limit: 8 }),
            getProducts({ featured: 'true', limit: 8 }),
            getProducts({ is_new: 'true', limit: 4 }),
            getCategories(),
          ]);
        setProducts(allProducts);
        setFeatured(featuredProducts);
        setNewProducts(latestProducts);
        setCategories(productCategories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="home-page">
      <section className="home-banner">
        <img
          className="home-banner-image"
          src="/images/HeadingBanner.webp"
          alt="Kalyani Masale heading banner"
        />
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Products</h2>
            <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products available right now.</p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Everyone's Favorite</h2>
            <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="product-grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section> */}

      {/* <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Explore Our Categories</h2>
            <p>From pure spices to ready blends — everything for your kitchen</p>
          </div>
          <div className="category-grid">
            {categories.map((c) => (
              <Link key={c.id} to={`/category/${c.slug}`} className="category-card">
                <img src={c.image_url} alt={c.name} />
                <h3>{c.name}</h3>
                <span>{c.product_count || 0} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section> */}
      <section className="features section">
        <div className="container">
          <h2 className="features-heading">
            The <span>Benefits</span> We Provide in our Collections
          </h2>
          <div className="features-grid">
            {benefits.map((benefit) => (
              <article className="feature-item" key={benefit.title}>
                <div className="feature-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {newProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Newly Launched</h2>
              <Link to="/products?sort=newest" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div className="product-grid">
              {newProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section testimonials">
        <div className="container">
          <div className="section-title">
            <h2>What our customers say</h2>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>
                "When I talk about real taste I can blindly trust on these masale.
                I tried hing and the result is amazing — just a pinch adds so much flavor."
              </p>
              <strong>– Prince Sharma</strong>
            </div>
            <div className="testimonial-card">
              <p>
                "This turmeric adds vibrant color, rich flavor, and smooth consistency.
                Sustainably sourced and high-quality — a must-have for cooking!"
              </p>
              <strong>– Harshita</strong>
            </div>
            <div className="testimonial-card">
              <p>
                "Be it Kitchen King, Sambhar Masala or Chana Masala, every product
                is capable of making dishes aromatic and tasty. A must have."
              </p>
              <strong>– Mrs. Sarika Kumar</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}