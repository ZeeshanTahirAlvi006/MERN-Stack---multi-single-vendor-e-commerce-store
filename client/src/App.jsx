import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Loader from './components/common/Loader';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Home = lazy(() => import('./pages/customer/Home'));
const Products = lazy(() => import('./pages/customer/Products'));
const ProductDetail = lazy(() => import('./pages/customer/ProductDetail'));
const VendorProfile = lazy(() => import('./pages/customer/VendorProfile'));
const Cart = lazy(() => import('./pages/customer/Cart'));

const Checkout = lazy(() => import('./pages/customer/Checkout'));
const Success = lazy(() => import('./pages/customer/Success'));
const Orders = lazy(() => import('./pages/customer/Orders'));
const Profile = lazy(() => import('./pages/customer/Profile'));

const AddProduct = lazy(() => import('./pages/vendor/AddProduct'));
const Dashboard = lazy(() => import('./pages/vendor/Dashboard'));
const Settings = lazy(() => import('./pages/vendor/Settings'));
const MyProducts = lazy(() => import('./pages/vendor/MyProducts'));
const EditProduct = lazy(() => import('./pages/vendor/EditProduct'));
const Sales = lazy(() => import('./pages/vendor/Sales'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen text-gray-900 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <Loader />
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/vendors/:id" element={<VendorProfile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              <Route
                path="/vendor/*"
                element={
                  <RoleRoute roles={['vendor', 'admin']}>
                    <div className="flex bg-[var(--bg-secondary)] min-h-[calc(100vh-4rem)]">
                      <Sidebar />
                      <div className="flex-1 w-full relative">
                        <Routes>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="add-product" element={<AddProduct />} />
                          <Route path="products" element={<MyProducts />} />
                          <Route path="products/edit/:id" element={<EditProduct />} />
                          <Route path="sales" element={<Sales />} />
                          <Route path="settings" element={<Settings />} />
                        </Routes>
                      </div>
                    </div>
                  </RoleRoute>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <RoleRoute roles={['admin']}>
                    <div className="flex bg-[var(--bg-secondary)] min-h-[calc(100vh-4rem)]">
                      <Sidebar />
                      <div className="flex-1 w-full relative">
                        <Routes>
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="orders" element={<AdminOrders />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="settings" element={<Settings />} />
                        </Routes>
                      </div>
                    </div>
                  </RoleRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
