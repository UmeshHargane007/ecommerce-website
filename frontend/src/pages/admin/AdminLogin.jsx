import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { adminGetProducts } from '../../api';

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Temporarily set key and test API
      sessionStorage.setItem('masale_admin_key', key);
      await adminGetProducts();
      login(key);
      navigate('/admin');
    } catch (err) {
      sessionStorage.removeItem('masale_admin_key');
      setError('Invalid admin key. Check backend/.env ADMIN_SECRET');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <p className="muted">Enter the admin secret from backend/.env</p>
        <div className="form-group">
          <label>Admin Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ADMIN_SECRET"
            required
            autoFocus
          />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Checking...' : 'Login'}
        </button>
        <a href="/" className="back-link">← Back to store</a>
      </form>
    </div>
  );
}