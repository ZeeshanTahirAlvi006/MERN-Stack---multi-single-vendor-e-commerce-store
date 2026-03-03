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
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-stranger text-red-500 mb-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] tracking-wide">Node Matrix</h1>
          <p className="text-slate-400 text-sm font-light">Monitor all active manifested objects across the network.</p>
        </div>

        <div className="relative w-full sm:w-72 group">
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-slate-900/50 backdrop-blur-sm border border-red-900/50 rounded-xl text-sm text-slate-200 outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all font-[inherit] placeholder-slate-500"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors text-lg" />
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-red-900/30 rounded-2xl overflow-hidden hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:border-red-500/30 transition-all duration-300">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-red-900/30">
                <th className="px-6 py-4 text-xs tracking-wider text-slate-400 font-bold uppercase w-16">Visual</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-400 font-bold uppercase">Node Data</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-400 font-bold uppercase">Source Controller</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-400 font-bold uppercase">Energy required / Capacity</th>
                <th className="px-6 py-4 text-xs tracking-wider text-red-500 font-bold uppercase text-right">Sever</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/20">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <span className="w-6 h-6 border-2 border-red-800/30 border-t-red-600 rounded-full animate-spin inline-block mx-auto mb-2" />
                    <p className="text-sm font-light">Scanning the void...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 text-sm font-light">No nodes detected.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`} 
                          alt="product" 
                          className="w-12 h-12 object-cover rounded-lg border border-slate-700 opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 border border-slate-700">
                          <FiImage />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-amber-500 transition-colors" title={product.name}>{product.name}</div>
                      <div className="text-xs font-semibold text-slate-500 mt-1.5 uppercase tracking-wide">{product.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-300">{product.vendorid?.name || 'Unknown Entity'}</div>
                      <div className="text-xs text-slate-500">{product.vendorid?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-red-500 drop-shadow-[0_0_2px_rgba(220,38,38,0.5)]">Rs. {product.price?.toLocaleString()}</div>
                      <div className={`text-xs font-semibold mt-1 ${product.stock > 0 ? 'text-amber-500' : 'text-red-500 shadow-[0_0_5px_rgba(220,38,38,0.5)]'}`}>
                        {product.stock > 0 ? `${product.stock} active` : 'Lost to void'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-500 flex items-center justify-center hover:bg-red-900/30 hover:text-red-500 hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-300 cursor-pointer ml-auto"
                        title="Sever Connection"
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
