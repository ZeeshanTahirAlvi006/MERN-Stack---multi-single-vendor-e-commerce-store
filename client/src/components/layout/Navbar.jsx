import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MagnifyingGlass, ShoppingCart, User, List } from '@phosphor-icons/react';
import { logout } from '../../slices/authSlice';
import { useState } from 'react';
import useCart from '../../hooks/useCart';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { itemCount: cartItemsCount } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight text-blue-800">
              MERNStore
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-lg ml-8 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-800 bg-transparent border-none cursor-pointer">
              <MagnifyingGlass size={20} weight="bold" />
            </button>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-800 font-medium">
              Shop
            </Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-800">
              <ShoppingCart size={24} weight="regular" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-800 focus:outline-none">
                  <User size={24} weight="regular" />
                  <span className="font-medium">{userInfo.name}</span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white border rounded-2xl shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {userInfo.role === 'customer' && (
                    <>
                      <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                    </>
                  )}
                  {userInfo.role === 'vendor' && (
                    <>
                      <Link to="/vendor/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                      <Link to="/vendor/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Products</Link>
                      <Link to="/vendor/sales" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sales</Link>
                    </>
                  )}
                  {userInfo.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                  )}
                  <div className="border-t my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login" className="text-gray-600 hover:text-blue-800 font-medium tracking-tight">
                  Login
                </Link>
                <Link to="/auth/register" className="bg-blue-800 text-white px-5 py-2 rounded-full font-medium tracking-tight hover:bg-blue-700 transition shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <List size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-2xl">
              Shop
            </Link>
            <Link to="/cart" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-2xl">
              Cart ({cartItemsCount})
            </Link>
            
            {userInfo ? (
              <div className="border-t mt-4 pt-4">
                <div className="px-3 pb-2 text-sm font-semibold text-gray-500 uppercase tracking-tight">
                  {userInfo.role} Account
                </div>
                {userInfo.role === 'customer' && (
                  <>
                    <Link to="/my-orders" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-2xl">My Orders</Link>
                    <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-2xl">Profile</Link>
                  </>
                )}
                {userInfo.role === 'vendor' && (
                  <>
                    <Link to="/vendor/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-2xl">Dashboard</Link>
                    <Link to="/vendor/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-2xl">My Products</Link>
                  </>
                )}
                {userInfo.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-2xl">Admin Panel</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left mt-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-2xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t mt-4 pt-4 space-y-2">
                <Link to="/auth/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50 rounded-2xl">
                  Login
                </Link>
                <Link to="/auth/register" className="block px-3 py-2 text-base font-medium text-blue-800 bg-blue-50 rounded-full tracking-tight text-center">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
