import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/api';
import ProductCard from '../../components/product/ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({ page, search, category, limit: 12 });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      setProducts([]);
      toast.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All' || category === cat) {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.set('page', 1); // Reset to first page when category changes
    setSearchParams(params);
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2D3748] to-[#1A202C] overflow-hidden">
        {/* Geometric Floral Logo Pattern Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex-floral" x="0" y="0" width="120" height="207.84" patternUnits="userSpaceOnUse">
                <g stroke="#6BCFA0" strokeWidth="1" fill="none">
                  {/* Hexagon Base */}
                  <path d="M60 0 L120 34.64 L120 103.92 L60 138.56 L0 103.92 L0 34.64 Z" />
                  <path d="M60 207.84 L120 173.2 L120 103.92 L60 69.28 L0 103.92 L0 173.2 Z" />
                  {/* Internal Intersecting Lines (Floral effect) */}
                  <path d="M0 34.64 L120 103.92 M120 34.64 L0 103.92 M60 0 L60 138.56" />
                  <path d="M0 173.2 L120 103.92 M120 173.2 L0 103.92 M60 207.84 L60 69.28" />
                  {/* Small detailed petals/leaves */}
                  <path d="M60 69.28 Q 75 86.6 90 69.28 Q 75 51.96 60 69.28 Z" />
                  <path d="M60 69.28 Q 45 86.6 30 69.28 Q 45 51.96 60 69.28 Z" />
                  <path d="M60 138.56 Q 75 121.24 90 138.56 Q 75 155.88 60 138.56 Z" />
                  <path d="M60 138.56 Q 45 121.24 30 138.56 Q 45 155.88 60 138.56 Z" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex-floral)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent)]/10 backdrop-blur-sm">
            <p className="text-sm font-bold text-[var(--accent)] uppercase tracking-[0.2em] m-0">New Collection 2025</p>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#F6F6EE] mb-6 md:mb-8 leading-tight max-w-4xl tracking-tight px-2">
            Discover Premium Products
          </h1>
          
          <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-2xl font-light leading-relaxed px-4">
            Shop the latest trends with unbeatable prices and free shipping on your first order.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <a href="#products" className="px-6 md:px-8 py-3 md:py-4 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[var(--accent-hover)] hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] no-underline text-sm md:text-base text-center w-full sm:w-auto">
              Shop Now
            </a>
            <a href="#categories" className="px-8 py-4 bg-transparent border-2 border-slate-500 text-slate-300 font-semibold rounded-xl hover:bg-slate-800 hover:border-slate-400 hover:text-white transition-all no-underline text-base text-center">
              Browse Categories
            </a>
          </div>
        </div>
        
        {/* Bottom subtle gradient fade removed */}
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                category === cat || (cat === 'All' && !category)
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {search && (
          <p className="text-sm text-gray-500 mb-6">
            Showing results for <span className="font-semibold text-gray-900">"{search}"</span>
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white"
                >
                  <FiChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
                      p === page
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
