import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../api/api';
import useCart from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCart(product, qty);
    toast.success(`${qty} item(s) added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">Product not found</p>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--accent)] mb-8 transition-colors no-underline">
          <FiArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-[var(--bg-secondary)] rounded-2xl overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage] || 'https://placehold.co/600x600/f5f7f9/999?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx ? 'border-[var(--accent)]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {product.category && (
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-900 mb-6">
              Rs. {product.price.toLocaleString()}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                {inStock ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-8 border-t border-gray-100 pt-6">
              {product.description || 'No description available.'}
            </p>

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors cursor-pointer bg-white border-none"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-5 py-3 text-sm font-semibold min-w-[50px] text-center border-x border-gray-200">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="p-3 hover:bg-gray-50 transition-colors cursor-pointer bg-white border-none"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors cursor-pointer border-none text-sm"
                >
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            )}

            {/* Vendor */}
            {product.vendor && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Sold by <span className="text-gray-700 font-medium">{product.vendor.name}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
