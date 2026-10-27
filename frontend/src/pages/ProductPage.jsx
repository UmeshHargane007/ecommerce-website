import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProduct(slug);
        setProduct(data);
        const variants = data.variants || [];
        const def = variants.find((v) => v.is_default) || variants[0];
        setSelectedVariant(def || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleAdd = () => {
    if (!selectedVariant) return;
    setAdding(true);
    setMessage('');
    try {
      addItem(product, selectedVariant, qty);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setMessage('Failed to add. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: 60 }}>Loading...</div>;
  if (!product) {
    return (
      <div className="empty-state">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
          Browse Products
        </Link>
      </div>
    );
  }

  const price = selectedVariant ? Number(selectedVariant.price) : 0;
  const compare = selectedVariant?.compare_at_price ? Number(selectedVariant.compare_at_price) : null;
  const discount = compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0;

  return (
    <div className="container">
      <div className="product-detail">
        <div className="detail-img">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=600'}
            alt={product.name}
          />
        </div>

        <div className="detail-info">
          {product.category_name && (
            <Link
              to={`/category/${product.category_slug}`}
              style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}
            >
              {product.category_name}
            </Link>
          )}
          <h1>{product.name}</h1>

          <div className="detail-meta">
            <span>★ {Number(product.rating).toFixed(1)} ({product.review_count} reviews)</span>
            {product.sold_count > 0 && <span>{product.sold_count}+ bought</span>}
          </div>

          <div className="detail-price">
            <span className="price-current">₹{price}</span>
            {compare && compare > price && (
              <>
                <span className="price-old" style={{ marginLeft: 12 }}>₹{compare}</span>
                <span className="price-off" style={{ marginLeft: 8 }}>{discount}% off</span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            {product.short_description || product.description?.slice(0, 160)}
          </p>

          {product.variants?.length > 0 && (
            <>
              <strong style={{ fontSize: '0.9rem' }}>Select Weight / Pack</strong>
              <div className="variant-options">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.weight} — ₹{v.price}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="qty-control">
            <span style={{ fontWeight: 500 }}>Quantity</span>
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="qty-value">{qty}</span>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={adding || !selectedVariant}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link to="/cart" className="btn btn-outline">
              View Cart
            </Link>
          </div>

          {message && (
            <p style={{ marginTop: 12, color: 'var(--secondary)', fontWeight: 500 }}>{message}</p>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: 12, fontSize: '1.1rem' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}