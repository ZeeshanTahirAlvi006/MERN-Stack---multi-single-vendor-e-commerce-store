import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import useCart from '../../hooks/useCart';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return toast.error('Out of stock');
    addToCart(product);
    toast.success('Added to cart');
  };

  return (
    <Link to={`/products/${product._id}`} className="group block no-underline">
      {/* Image */}
      <div className="relative aspect-square bg-[var(--bg-secondary)] rounded-xl overflow-hidden mb-4">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/f5f7f9/999?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-semibold">Out of Stock</span>
          </div>
        )}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-white text-gray-900 p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer border-none hover:bg-[var(--accent)] hover:text-white"
          >
            <FiShoppingCart size={16} />
          </button>
        )}
      </div>

      {/* Details */}
      <div>
        {product.category && (
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
        )}
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[var(--accent)] transition-colors mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-gray-900">
          Rs. {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
