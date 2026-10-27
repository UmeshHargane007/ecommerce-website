import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const variants = product.variants || [];
  const defaultVariant = variants.find(v => v.is_default) || variants[0];
  const price = defaultVariant ? Number(defaultVariant.price) : (product.min_price || 0);
  const compare = defaultVariant?.compare_at_price ? Number(defaultVariant.compare_at_price) : null;
  const discount = compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0;
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!defaultVariant) return;
    addItem(product, defaultVariant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="product-card">
      {product.is_on_sale && discount > 0 && (
        <span className="product-badge">SALE! {discount}% off</span>
      )}
      {product.is_new && !product.is_on_sale && (
        <span className="product-badge new">NEW</span>
      )}
      <div className="product-img">
        <Link
          to={`/product/${product.slug}`}
          className="product-img-link"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=400'}
            alt={product.name}
            loading="lazy"
          />
        </Link>
      </div>
      <Link to={`/product/${product.slug}`} className="product-body">
        <div className="product-rating">
          ★ {Number(product.rating || 4.5).toFixed(1)}
          {product.review_count > 0 && (
            <span style={{ color: '#999', marginLeft: 4 }}>({product.review_count})</span>
          )}
        </div>
        <h3 className="product-name">{product.name}</h3>
        {product.sold_count > 0 && (
          <div className="product-sold">{product.sold_count}+ bought in past month</div>
        )}
        <div className="product-price">
          <span className="price-current">₹{price}</span>
          {compare && compare > price && (
            <>
              <span className="price-old">₹{compare}</span>
              <span className="price-off">{discount}% off</span>
            </>
          )}
        </div>
      </Link>
      <button
        type="button"
        className="product-add-button"
        onClick={handleAddToCart}
        disabled={!defaultVariant}
      >
        {added ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </article>
  );
}