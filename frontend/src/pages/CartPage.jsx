import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, total, updateItem, removeItem, loading } = useCart();

  if (loading) {
    return <div className="container cart-page"><p>Loading cart...</p></div>;
  }

  if (!items.length) {
    return (
      <div className="container cart-page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            Looks like you haven't added any spices yet.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = total >= 499 ? 0 : 49;
  const grandTotal = total + shipping;

  return (
    <div className="container cart-page">
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 28 }}>Your Cart</h1>

      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image_url || 'https://images.unsplash.com/photo-1596040033229-a0b54d854c2c?w=200'}
                alt={item.name}
              />
              <div className="cart-item-info">
                <h3>
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.weight}</p>
                <p style={{ fontWeight: 600, color: 'var(--primary)', marginTop: 4 }}>
                  ₹{Number(item.price)}
                </p>
                <div className="qty-control" style={{ marginTop: 10, marginBottom: 0 }}>
                  <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity - 1)}>
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateItem(item.id, item.quantity + 1)}>
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      marginLeft: 16,
                      background: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.85rem',
                      textDecoration: 'underline',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 700, alignSelf: 'center' }}>
                ₹{(Number(item.price) * item.quantity).toFixed(0)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
          </div>
          {total < 499 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: 12 }}>
              Add ₹{(499 - total).toFixed(0)} more for free shipping!
            </p>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(0)}</span>
          </div>
          <Link
            to="/checkout"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
          >
            Proceed to Checkout
          </Link>
          <Link
            to="/products"
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}