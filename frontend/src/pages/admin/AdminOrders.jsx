import { useEffect, useState } from 'react';
import { adminGetOrders, adminUpdateOrder } from '../../api';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setOrders((await adminGetOrders()) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminUpdateOrder(id, { status });
      await load();
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <div className="admin-card">
        {orders.length === 0 ? (
          <p className="muted">No orders yet</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tbody key={o.id} style={{ display: 'contents' }}>
                  <tr>
                    <td>#{o.id}</td>
                    <td>{o.customer_name || '—'}</td>
                    <td>{o.customer_phone || '—'}</td>
                    <td>₹{Number(o.total_amount).toFixed(0)}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="status-select"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>{o.created_at ? new Date(o.created_at).toLocaleString() : '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                      >
                        {expanded === o.id ? 'Hide' : 'Items'}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="order-items-row">
                      <td colSpan={7}>
                        <div className="order-detail">
                          <p><strong>Address:</strong> {o.shipping_address || '—'}</p>
                          <p><strong>Payment:</strong> {o.payment_method}</p>
                          <ul>
                            {(o.order_items || []).map((item, i) => (
                              <li key={i}>
                                {item.name} ({item.weight}) × {item.quantity} — ₹{item.price}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}