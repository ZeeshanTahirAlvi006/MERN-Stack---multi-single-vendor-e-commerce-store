import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/api';
import ProductCard from '../../components/product/ProductCard';
import { FiChevronLeft, FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';

  const [minPriceInput, setMinPriceInput] = useState(priceMin);
  const [maxPriceInput, setMaxPriceInput] = useState(priceMax);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({ page, search, category, priceMin, priceMax, limit: 12 });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      setProducts([]);
      toast.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, priceMin, priceMax]);

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
    params.set('page', 1);
    setSearchParams(params);
  };

  const applyPriceFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (minPriceInput) params.set('priceMin', minPriceInput);
    else params.delete('priceMin');
    
    if (maxPriceInput) params.set('priceMax', maxPriceInput);
    else params.delete('priceMax');
    
    params.set('page', 1);
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setMinPriceInput('');
    setMaxPriceInput('');
    setShowFilters(false);
  };

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', p);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col md:flex-row">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 bg-white border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">All Products</h1>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium border-none cursor-pointer"
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`fixed inset-0 z-50 bg-white md:bg-transparent md:static md:w-64 md:block flex-shrink-0 border-r border-gray-200 p-6 overflow-y-auto transition-transform ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex justify-between items-center md:mb-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button onClick={() => setShowFilters(false)} className="md:hidden p-2 text-gray-500 bg-transparent border-none cursor-pointer">
            <FiX size={24} />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Categories</h3>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={category === cat || (cat === 'All' && !category)}
                  onChange={() => handleCategoryClick(cat)}
                  className="w-4 h-4 text-[var(--accent)] border-gray-300 focus:ring-[var(--accent)]"
                />
                <span className={`text-sm ${category === cat || (cat === 'All' && !category) ? 'font-medium text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Price Range (Rs.)</h3>
          <form onSubmit={applyPriceFilter} className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[var(--accent)]"
                min="0"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[var(--accent)]"
                min="0"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors border-none cursor-pointer"
            >
              Apply Filter
            </button>
          </form>
        </div>

        <button 
          onClick={clearFilters}
          className="w-full py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors bg-transparent cursor-pointer"
        >
          Clear All Filters
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {search ? `Search results for "${search}"` : category ? `${category} Products` : 'All Products'}
          </h1>
          <span className="text-sm text-gray-500">
             Scroll to explore
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">😕</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find any products matching your current filters. Try adjusting your search or category.
            </p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors border-none cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 bg-white w-fit mx-auto p-2 rounded-xl shadow-sm border border-gray-100">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white border-none"
                >
                  <FiChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none ${
                      p === page
                        ? 'bg-[var(--accent)] text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)]'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white border-none"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
