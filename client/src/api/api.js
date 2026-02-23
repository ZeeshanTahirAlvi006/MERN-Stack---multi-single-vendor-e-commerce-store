import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
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

// ─── Orders ───
export const placeOrder = (orderData) =>
  API.post('/orders', orderData);

export const getMyOrders = () =>
  API.get('/orders/mine');

export const getOrderById = (id) =>
  API.get(`/orders/${id}`);

export default API;