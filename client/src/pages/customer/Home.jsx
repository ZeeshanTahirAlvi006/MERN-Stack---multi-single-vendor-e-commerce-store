import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/api';
import ProductGrid from '../../components/product/ProductGrid';
import useCart from '../../hooks/useCart';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const { userInfo } = useSelector((state) => state.auth);
  // useCart isn't needed here anymore since cart icon moved to global Navbar, but keeping it if needed elsewhere
  
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, search]); // Added search to dependency array so it refetches when global search updates

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Fresh & Quality Products
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
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
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-800/25'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-800 border border-slate-200'}`}
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
