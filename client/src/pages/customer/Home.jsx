import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProducts } from '../../api/api';
import ProductGrid from '../../components/product/ProductGrid';
import { FiSearch, FiShoppingBag, FiPlus, FiLogOut, FiUser, FiShoppingCart } from 'react-icons/fi';
import useCart from '../../hooks/useCart';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const { itemCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();
      const { data } = await getProducts(params);
      setProducts(data.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-teal-700 no-underline">
              <FiShoppingBag className="text-2xl" />
              <span className="hidden sm:inline">Jalal Sons</span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4 sm:mx-8">
              <div className="flex items-center bg-slate-100 rounded-xl px-4 h-10 focus-within:ring-2 focus-within:ring-teal-700/20 transition-all">
                <FiSearch className="text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 font-[inherit]"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Cart Icon */}
              <Link to="/cart" className="relative text-slate-600 hover:text-teal-700 transition-colors no-underline">
                <FiShoppingCart className="text-xl" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center bg-teal-700 text-white text-[10px] font-bold rounded-full px-1">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {userInfo ? (
                <>
                  {(userInfo.role === 'vendor' || userInfo.role === 'admin') && (
                    <Link
                      to="/vendor/add-product"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 text-white rounded-lg text-sm font-medium no-underline hover:bg-teal-800 transition-colors"
                    >
                      <FiPlus className="text-base" /> Add Product
                    </Link>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FiUser className="text-lg" />
                    <span className="hidden sm:inline">{userInfo.name}</span>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white rounded-lg text-sm font-medium no-underline hover:bg-teal-800 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-700 via-emerald-800 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Fresh & Quality Products
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl">
            Discover premium groceries & essentials from trusted vendors, delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border-none cursor-pointer
                ${selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25'
                  : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
};

export default Home;
