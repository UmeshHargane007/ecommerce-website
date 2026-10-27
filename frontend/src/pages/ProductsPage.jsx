import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || 'featured';
  const search = searchParams.get('q') || '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProducts({ sort, search: search || undefined, limit: 40 });
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sort, search]);

  const handleSort = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>All Products</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>
            Premium Indian spices & masalas
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        <div className="filters">
          <select value={sort} onChange={handleSort}>
            <option value="featured">🔥 Best Selling</option>
            <option value="newest">🆕 Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="rating">Rating</option>
            <option value="name">A → Z</option>
          </select>
          <span style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>
            {products.length} products
          </span>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h2>No products found</h2>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}