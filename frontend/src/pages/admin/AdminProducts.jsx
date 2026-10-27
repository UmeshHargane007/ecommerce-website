import { useEffect, useState } from 'react';
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetCategories,
  adminUploadImage,
} from '../../api';

const emptyForm = {
  name: '',
  slug: '',
  category_id: '',
  description: '',
  short_description: '',
  image_url: '',
  rating: 4.5,
  is_featured: false,
  is_new: false,
  is_on_sale: false,
  price: '',
  compare_at_price: '',
  weight: '100g',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // File selected from device (upload only on submit)
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([adminGetProducts(), adminGetCategories()]);
      setProducts(p || []);
      setCategories(c || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Cleanup local preview URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetImageState = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl('');
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id || '' });
    resetImageState();
    setShowForm(true);
    setError('');
  };

  const openEdit = (p) => {
    const def =
      (p.product_variants || []).find((v) => v.is_default) ||
      (p.product_variants || [])[0];
    setEditing(p);
    setForm({
      name: p.name || '',
      slug: p.slug || '',
      category_id: p.category_id || '',
      description: p.description || '',
      short_description: p.short_description || '',
      image_url: p.image_url || '',
      rating: p.rating || 4.5,
      is_featured: !!p.is_featured,
      is_new: !!p.is_new,
      is_on_sale: !!p.is_on_sale,
      price: def?.price || '',
      compare_at_price: def?.compare_at_price || '',
      weight: def?.weight || '100g',
    });
    resetImageState();
    if (p.image_url) setPreviewUrl(p.image_url);
    setShowForm(true);
    setError('');
  };

  const slugify = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name' && !editing) next.slug = slugify(value);
      return next;
    });
  };

  // Only store file + local preview (NO API call here)
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  // Upload on submit, then save product with image_url
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let imageUrl = form.image_url || '';

      // Upload only if user selected a new file from device
      if (imageFile) {
        const result = await adminUploadImage(imageFile);
        imageUrl = result.url;
      }

      const payload = {
        name: form.name,
        slug: form.slug,
        category_id: Number(form.category_id) || null,
        description: form.description,
        short_description: form.short_description,
        image_url: imageUrl,
        rating: Number(form.rating) || 4.5,
        is_featured: form.is_featured,
        is_new: form.is_new,
        is_on_sale: form.is_on_sale,
      };

      if (editing) {
        await adminUpdateProduct(editing.id, payload);
      } else {
        payload.variants = [
          {
            weight: form.weight || '100g',
            price: Number(form.price) || 0,
            compare_at_price: form.compare_at_price
              ? Number(form.compare_at_price)
              : null,
            is_default: true,
            stock: 100,
          },
        ];
        await adminCreateProduct(payload);
      }

      setShowForm(false);
      resetImageState();
      await load();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminDeleteProduct(id);
      await load();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h2>{editing ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input name="slug" value={form.slug} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category_id" value={form.category_id} onChange={handleChange}>
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL (optional if you upload file)</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="Or paste URL"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Upload image from device</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageFile}
                disabled={saving}
              />
              <p className="muted" style={{ marginTop: 6, fontSize: '0.85rem' }}>
                Image uploads when you click Save
              </p>
              {previewUrl && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: 160,
                      maxHeight: 160,
                      borderRadius: 8,
                      objectFit: 'cover',
                      border: '1px solid #eee',
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Short description</label>
              <input name="short_description" value={form.short_description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
            </div>

            {!editing && (
              <div className="form-row">
                <div className="form-group">
                  <label>Weight</label>
                  <input name="weight" value={form.weight} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Compare at price</label>
                  <input name="compare_at_price" type="number" value={form.compare_at_price} onChange={handleChange} />
                </div>
              </div>
            )}

            <div className="form-row checks">
              <label>
                <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured
              </label>
              <label>
                <input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} /> New
              </label>
              <label>
                <input type="checkbox" name="is_on_sale" checked={form.is_on_sale} onChange={handleChange} /> On Sale
              </label>
            </div>

            {error && <p className="admin-error">{error}</p>}

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setShowForm(false);
                  resetImageState();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const def =
                  (p.product_variants || []).find((v) => v.is_default) ||
                  (p.product_variants || [])[0];
                return (
                  <tr key={p.id}>
                    <td>
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt=""
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                        />
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>
                      <strong>{p.name}</strong>
                      <div className="muted small">{p.slug}</div>
                    </td>
                    <td>{p.categories?.name || '—'}</td>
                    <td>₹{def ? Number(def.price) : '—'}</td>
                    <td>
                      {p.is_featured && <span className="badge">Featured</span>}
                      {p.is_new && <span className="badge badge-new">New</span>}
                      {p.is_on_sale && <span className="badge badge-sale">Sale</span>}
                    </td>
                    <td>
                      <button type="button" className="link-btn" onClick={() => openEdit(p)}>Edit</button>
                      {' · '}
                      <button type="button" className="link-btn danger" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && <p className="muted">No products yet</p>}
        </div>
      )}
    </div>
  );
}