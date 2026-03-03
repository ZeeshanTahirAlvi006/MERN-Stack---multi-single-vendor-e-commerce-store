import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/api';
import ProductCard from '../../components/product/ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams();
    if (cat === 'All' || category === cat) {
      // Clear category filter
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-4">New Collection 2025</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight max-w-xl">
            Discover Premium Products
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-md">
            Shop the latest trends with unbeatable prices and free shipping on your first order.
          </p>
          <div className="flex gap-4">
            <a href="#products" className="px-8 py-3 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors no-underline text-sm">
              Shop Now
            </a>
            <a href="#categories" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all no-underline text-sm">
              Browse Categories
            </a>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                category === cat
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
            <div className="w-8 h-8 border-3 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
