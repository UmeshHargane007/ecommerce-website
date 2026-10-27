import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api';

export default function CheckoutPage() {
  const { items, total, sessionId, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cod',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  const shipping = total >= 499 ? 0 : 49;
  const grandTotal = total + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await placeOrder({
        sessionId,
        shippingAddress: `${form.name}\n${form.phone}\n${form.email}\n${form.address}`,
        paymentMethod: form.paymentMethod,
        name: form.name,
        phone: form.phone,
        email: form.email,
        items: items.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id,
          name: i.name,
          weight: i.weight,
          quantity: i.quantity,
          price: i.price,
        })),
        total: grandTotal,
      });
      setOrderResult(result);
      clear();
    } catch (err) {
      console.error(err);
      setError(err.message || err.error_description || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
          Order Placed Successfully!
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
          Order ID: <strong>#{orderResult.orderId}</strong>
        </p>
        <p style={{ marginBottom: 24 }}>
          Total: ₹{Number(orderResult.total).toFixed(0)} • We will contact you soon.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container cart-page">
        <div className="empty-state">
          <h2>Nothing to checkout</h2>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 28 }}>Checkout</h1>

      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 20 }}>Shipping Details</h3>

          <div className="form-group">
            <label>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Delivery Address *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="House no, Street, City, State, PIN"
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
            >
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="upi">UPI (coming soon)</option>
              <option value="card">Card (coming soon)</option>
            </select>
          </div>

          {error && <p style={{ color: 'var(--primary)', marginBottom: 12 }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Placing Order...' : `Place Order — ₹${grandTotal.toFixed(0)}`}
          </button>
        </form>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="summary-row" style={{ fontSize: '0.9rem' }}>
              <span>
                {item.name} ({item.weight}) × {item.quantity}
              </span>
              <span>₹{(Number(item.price) * item.quantity).toFixed(0)}</span>
            </div>
          ))}
          <div className="summary-row" style={{ marginTop: 12 }}>
            <span>Subtotal</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}