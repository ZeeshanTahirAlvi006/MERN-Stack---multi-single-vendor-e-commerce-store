import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MagnifyingGlass, ShoppingCart, User, List } from '@phosphor-icons/react';
import { logout } from '../../slices/authSlice';
import { useState, useEffect, useRef } from 'react';
import useCart from '../../hooks/useCart';
import { getProducts } from '../../api/api';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { itemCount: cartItemsCount } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await getProducts({ search: searchQuery.trim(), limit: 5 });
          setSearchResults(res.data.products || []);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
      setIsMenuOpen(false);
    }
  };

  const handleSelectProduct = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const linkClass = "text-sm font-medium text-gray-600 hover:text-[var(--accent)] transition-colors";
  const dropdownLinkClass = "block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--accent)] transition-colors";

  return (
    <nav className="bg-[#F6F6EE] border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <img src="/logo.png" alt="The Hive PK" className="h-9 w-auto" />
              <div className="hidden sm:block leading-none">
                <span className="text-lg font-extrabold tracking-tight" style={{ color: '#4A5568' }}>THE HIVE</span>
                <span className="block text-xs font-bold tracking-widest" style={{ color: '#6BCFA0' }}>PK</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden sm:flex flex-1 max-w-md mx-8 relative z-50">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-[var(--accent)] bg-transparent border-none cursor-pointer transition-colors">
                <MagnifyingGlass size={18} weight="bold" />
              </button>
            </form>

            {/* Auto-suggest Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden py-1 z-50">
                {isSearching ? (
                  <div className="px-4 py-4 text-sm text-gray-500 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mr-3"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul className="max-h-80 overflow-y-auto mb-0 list-none p-0">
                    {searchResults.map((product) => (
                      <li key={product._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        <button
                          onClick={() => handleSelectProduct(product._id)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 bg-transparent border-none cursor-pointer"
                        >
                          <img 
                            src={product.images?.[0] || 'https://placehold.co/40x40/f5f7f9/666?text=?'} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate font-medium">{product.name}</p>
                            <p className="text-xs text-[var(--accent)] font-semibold mt-0.5">Rs. {product.price.toLocaleString()}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                    <li className="border-t border-gray-100">
                      <button 
                        onClick={handleSearch}
                        className="w-full text-center px-4 py-3 text-sm text-[var(--accent)] hover:bg-gray-50 bg-transparent border-none cursor-pointer transition-colors font-medium"
                      >
                        Search for "{searchQuery}"
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="px-4 py-4 text-sm text-gray-400 text-center">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-5">
            <Link to="/" className={linkClass}>Home</Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-[var(--accent)] transition-colors p-2 rounded-full hover:bg-gray-50">
              <ShoppingCart size={22} weight="regular" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative group/nav">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-[var(--accent)] focus:outline-none transition-colors p-2 rounded-full hover:bg-gray-50 bg-transparent border-none cursor-pointer">
                  <User size={22} weight="regular" />
                  <span className="text-sm font-medium max-w-[100px] truncate">{userInfo.name}</span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 w-52 mt-0 pt-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                  <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
                    <div className="py-1">
                      {userInfo.role === 'customer' && (
                        <>
                          <Link to="/orders" className={dropdownLinkClass}>My Orders</Link>
                          <Link to="/profile" className={dropdownLinkClass}>Profile</Link>
                        </>
                      )}
                      {userInfo.role === 'vendor' && (
                        <>
                          <Link to="/vendor/dashboard" className={dropdownLinkClass}>Dashboard</Link>
                          <Link to="/vendor/products" className={dropdownLinkClass}>Products</Link>
                          <Link to="/vendor/sales" className={dropdownLinkClass}>Sales</Link>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link to="/orders" className={dropdownLinkClass}>My Orders</Link>
                          <Link to="/profile" className={dropdownLinkClass}>Profile</Link>
                        </>
                      )}
                      {userInfo.role === 'admin' && (
                        <Link to="/admin/dashboard" className={`${dropdownLinkClass} text-[var(--accent)] font-medium`}>Admin Dashboard</Link>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login" className={linkClass}>Login</Link>
                <Link to="/auth/register" className="px-5 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors no-underline">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[var(--accent)] focus:outline-none transition-colors p-2 rounded-lg hover:bg-gray-50 bg-transparent border-none cursor-pointer"
            >
              <List size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden absolute w-full left-0 bg-white border-b border-gray-200 shadow-lg overflow-hidden transition-all duration-300 ease-in-out origin-top ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="p-4 space-y-1">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--accent)] transition-all"
            />
            <button type="submit" className="absolute right-3 top-3 text-gray-400 hover:text-[var(--accent)] bg-transparent border-none cursor-pointer">
              <MagnifyingGlass size={20} weight="bold" />
            </button>
          </form>

          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50 rounded-lg transition-colors">
            Home
          </Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50 rounded-lg transition-colors">
            <span>Cart</span>
            {cartItemsCount > 0 && (
              <span className="bg-[var(--accent)] text-white px-2 py-0.5 rounded-full font-bold text-xs">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <div className="border-t border-gray-100 mt-2 pt-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Welcome, {userInfo.name}
              </div>
              {userInfo.role === 'customer' && (
                <>
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50 rounded-lg transition-colors">My Orders</Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50 rounded-lg transition-colors">Profile</Link>
                </>
              )}
              {userInfo.role === 'vendor' && (
                <>
                  <Link to="/vendor/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50 rounded-lg transition-colors">Dashboard</Link>
                  <Link to="/vendor/products" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50 rounded-lg transition-colors">Products</Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50 rounded-lg transition-colors">My Orders</Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50 rounded-lg transition-colors">Profile</Link>
                </>
              )}
              {userInfo.role === 'admin' && (
                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[var(--accent)] hover:bg-blue-50 rounded-lg transition-colors">Admin Dashboard</Link>
              )}
              <div className="border-t border-gray-100 my-2 pt-2">
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-transparent border-none cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-100 mt-2 pt-4 px-2 space-y-3 pb-4">
              <Link to="/auth/login" onClick={() => setIsMenuOpen(false)} className="block text-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-[var(--accent)] bg-gray-50 rounded-lg transition-colors">
                Login
              </Link>
              <Link to="/auth/register" onClick={() => setIsMenuOpen(false)} className="block text-center px-4 py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors no-underline">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
