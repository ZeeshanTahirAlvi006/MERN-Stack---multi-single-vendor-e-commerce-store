import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../api/api';
import { toast } from 'react-toastify';
import { FiTrash2, FiImage, FiSearch } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ search });
      setProducts(res.data.products || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Product Directory</h1>
          <p className="text-slate-500 text-sm">Review all active marketplace listings across all vendors.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 transition-all font-[inherit]"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase w-16">Image</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase">Product Info</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase">Vendor</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase">Price / Stock</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <span className="w-6 h-6 border-2 border-blue-800/30 border-t-blue-800 rounded-full animate-spin inline-block mx-auto mb-2" />
                    <p className="text-sm">Loading products...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 text-sm">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`} 
                          alt="product" 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200" 
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                          <FiImage />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900 line-clamp-1" title={product.name}>{product.name}</div>
                      <div className="text-xs font-semibold text-blue-600 mt-1.5 uppercase tracking-wide">{product.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">{product.vendorid?.name || 'Unknown Vendor'}</div>
                      <div className="text-xs text-slate-500">{product.vendorid?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">Rs. {product.price?.toLocaleString()}</div>
                      <div className={`text-xs font-semibold mt-1 ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors border-none cursor-pointer ml-auto"
                        title="Delete Product"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
