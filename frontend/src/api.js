import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const key = sessionStorage.getItem('masale_admin_key');
  if (key) config.headers['x-admin-key'] = key;
  return config;
});

export const getCategories = () => api.get('/categories').then((r) => r.data);
export const getCategory = (slug) => api.get(`/categories/${slug}`).then((r) => r.data);
export const getProducts = (params = {}) => api.get('/products', { params }).then((r) => r.data);
export const getProduct = (slug) => api.get(`/products/${slug}`).then((r) => r.data);
export const placeOrder = (data) => api.post('/orders', data).then((r) => r.data);

export const adminGetProducts = () => api.get('/admin/products').then((r) => r.data);
export const adminCreateProduct = (body) => api.post('/admin/products', body).then((r) => r.data);
export const adminUpdateProduct = (id, body) => api.put(`/admin/products/${id}`, body).then((r) => r.data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`).then((r) => r.data);
export const adminGetCategories = () => api.get('/admin/categories').then((r) => r.data);
export const adminCreateCategory = (body) => api.post('/admin/categories', body).then((r) => r.data);
export const adminGetOrders = () => api.get('/admin/orders').then((r) => r.data);
export const adminUpdateOrder = (id, body) => api.patch(`/admin/orders/${id}`, body).then((r) => r.data);
export const adminUploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/admin/upload', formData).then((r) => r.data);
};

export default api;
