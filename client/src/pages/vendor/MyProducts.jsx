import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVendorProducts, deleteProduct } from '../../api/api';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiEdit2, FiPackage, FiImage } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getVendorProducts();
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n) =>
    `Rs. ${(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Products</h1>
            <p className="text-gray-500 text-sm">Manage your inventory and product listings.</p>
          </div>
          <Link
            to="/vendor/add-product"
            className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-[var(--accent)] text-white rounded-full text-[0.95rem] font-semibold hover:bg-[var(--accent-hover)] transition shadow-sm hover:shadow-md hover:shadow-[var(--accent)]/20 whitespace-nowrap"
          >
            <FiPlus className="text-lg" />
            Add New Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              You haven't listed any products yet. Start selling by adding your first product to the marketplace.
            </p>
            <Link
              to="/vendor/add-product"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-[var(--accent)] text-white rounded-full text-[0.95rem] font-semibold hover:bg-[var(--accent-hover)] transition"
            >
              <FiPlus />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                {/* Image Wrap */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <FiImage className="text-4xl mb-2 opacity-50" />
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}
                  {/* Stock Badge Overlay */}
                  <div className="absolute top-3 left-3">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm border
                        ${product.stock > 0 
                          ? 'bg-white/90 text-gray-700 border-white/20' 
                          : 'bg-red-500/90 text-white border-red-500/20'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-1 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                    {product.category}
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2 line-clamp-1" title={product.name}>
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                    <span className="font-bold text-lg text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/products/${product._id}`} 
                        className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
                        title="View Product"
                      >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                         </svg>
                      </Link>
                      <button 
                         onClick={() => navigate(`/vendor/products/edit/${product._id}`)}
                         className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-colors border-none cursor-pointer"
                         title="Edit Product"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleDeleteProduct(product._id)}
                         className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                         title="Delete Product"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyProducts;
