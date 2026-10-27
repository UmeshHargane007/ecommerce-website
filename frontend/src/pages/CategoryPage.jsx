import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategory } from '../api';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategory(slug);
        setCategory(data);
      } catch (err) {
        setError('Category not found');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return <div className="container" style={{ padding: 60 }}>Loading...</div>;
  if (error || !category) {
    return (
      <div className="empty-state">
        <h2>{error || 'Category not found'}</h2>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>{category.name}</h1>
          {category.description && (
            <p style={{ color: 'var(--text-muted)', marginTop: 8, maxWidth: 600 }}>
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        <p style={{ marginBottom: 20, color: 'var(--text-muted)' }}>
          Showing {category.products?.length || 0} products
        </p>
        {category.products?.length > 0 ? (
          <div className="product-grid">
            {category.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No products in this category yet</h2>
          </div>
        )}
      </div>
    </>
  );
}