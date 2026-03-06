import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to add Token
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

// ─── Auth ───
export const loginUser = (email, password) =>
  API.post('/auth/login', { email, password });

export const registerUser = (name, email, password, role) =>
  API.post('/auth/register', { name, email, password, role });

export const getUserProfile = () =>
  API.get('/auth/profile');

export const updateUserProfile = (profileData) =>
  API.put('/auth/profile', profileData);

// ─── Products ───
export const getProducts = (params = {}) =>
  API.get('/products', { params });

export const getProductById = (id) =>
  API.get(`/products/${id}`);

export const createProduct = (productData) =>
  API.post('/products', productData);

export const updateProduct = (id, productData) =>
  API.put(`/products/${id}`, productData);

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);

export const getVendorProducts = () =>
  API.get('/products/vendor/mine');

// ─── Vendor ───
export const getVendorDashboard = () =>
  API.get('/vendors/dashboard');

export const getVendorSales = () =>
  API.get('/vendors/sales');

export const getVendors = () =>
  API.get('/vendors');

export const getVendorProfile = (id) =>
  API.get(`/vendors/${id}`);

// ─── Orders ───
export const placeOrder = (orderData) =>
  API.post('/orders', orderData);

export const getMyOrders = () =>
  API.get('/orders/mine');

export const getAllOrders = (params = {}) =>
  API.get('/orders', { params });

export const getOrderById = (id) =>
  API.get(`/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });


export const verifyStripeSession = (sessionId) =>
  API.get(`/orders/verify-session?session_id=${sessionId}`);

// ─── Admin ───
export const getAdminStats = () =>
  API.get('/admin/stats');

export const getAdminUsers = (params = {}) =>
  API.get('/admin/users', { params });

export const toggleUserStatus = (id) =>
  API.put(`/admin/users/${id}`);

export const getAdminCommission = () =>
  API.get('/admin/commission');

export default API;