import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/customer/Home';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import AddProduct from './pages/vendor/AddProduct';
import Dashboard from './pages/vendor/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Vendor-only routes */}
        <Route
          path="/vendor/dashboard"
          element={
            <RoleRoute roles={['vendor', 'admin']}>
              <Dashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/vendor/add-product"
          element={
            <RoleRoute roles={['vendor', 'admin']}>
              <AddProduct />
            </RoleRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
