import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import VendorProfile from './pages/customer/VendorProfile';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Success from './pages/customer/Success';
import Orders from './pages/customer/Orders';
import Profile from './pages/customer/Profile';
import AddProduct from './pages/vendor/AddProduct';
import Dashboard from './pages/vendor/Dashboard';
import Settings from './pages/vendor/Settings';
import MyProducts from './pages/vendor/MyProducts';
import EditProduct from './pages/vendor/EditProduct';
import Sales from './pages/vendor/Sales';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen text-gray-900 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/vendors/:id" element={<VendorProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Customer Protected Routes */}
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Vendor-only routes */}
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

            {/* Admin-only routes */}
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
                      </Routes>
                    </div>
                  </div>
                </RoleRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
