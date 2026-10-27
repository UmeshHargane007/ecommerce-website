import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminGetProducts, adminGetOrders, adminGetCategories } from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [products, orders, categories] = await Promise.all([
          adminGetProducts(),
          adminGetOrders(),
          adminGetCategories(),
        ]);
        setStats({
          products: products?.length || 0,
          orders: orders?.length || 0,
          categories: categories?.length || 0,
          pending: (orders || []).filter((o) => o.status === 'pending').length,
        });
        setRecentOrders((orders || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.products}</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.categories}</span>
          <span className="stat-label">Categories</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.orders}</span>
          <span className="stat-label">Orders</span>
        </div>
        <div className="stat-card highlight">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending Orders</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="muted">No orders yet</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer_name || '—'}</td>
                  <td>₹{Number(o.total_amount).toFixed(0)}</td>
                  <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                  <td>{o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}