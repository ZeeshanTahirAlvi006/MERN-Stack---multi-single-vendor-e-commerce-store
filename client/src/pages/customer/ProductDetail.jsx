import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../../api/api';
import { toast } from 'react-toastify';
import {
  FiArrowLeft,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiPackage,
  FiShield,
  FiTruck,
} from 'react-icons/fi';
import useCart from '../../hooks/useCart';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      qty,
      image: product.images?.[0] || '',
      vendorId: product.vendorid?._id || product.vendorid,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-800/30 border-t-blue-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 mb-4">
              <img
                src={product.images?.[selectedImage] || 'https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer p-0
                      ${selectedImage === i ? 'border-blue-800 ring-2 ring-blue-800/20' : 'border-slate-200 hover:border-slate-400'}`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block bg-blue-50 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
            {product.vendorid?.name && (
              <p className="text-sm text-slate-400 mb-4">Sold by <span className="text-slate-600 font-medium">{product.vendorid.name}</span></p>
            )}

            <p className="text-3xl font-bold text-blue-800 mb-6">
              Rs. {product.price?.toLocaleString()}
            </p>

            <p className="text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-blue-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${inStock ? 'text-blue-600' : 'text-red-500'}`}>
                {inStock ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty + Add to Cart */}
            {inStock && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-semibold text-slate-900">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 h-12 bg-gradient-to-br from-blue-800 to-blue-800 text-white rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-800/35 hover:-translate-y-0.5 active:translate-y-0 border-none"
                >
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            )}

            {/* Features */}
            <div className="border-t border-slate-200 pt-6 grid grid-cols-3 gap-4">
              {[
                { icon: <FiTruck />, label: 'Fast Delivery' },
                { icon: <FiShield />, label: 'Secure Payment' },
                { icon: <FiPackage />, label: 'Quality Assured' },
              ].map((feat) => (
                <div key={feat.label} className="flex flex-col items-center text-center gap-1.5">
                  <span className="text-xl text-blue-800">{feat.icon}</span>
                  <span className="text-xs text-slate-500 font-medium">{feat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
