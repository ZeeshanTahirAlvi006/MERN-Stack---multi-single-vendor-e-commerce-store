import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0] || 'https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image';
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: imageUrl,
      vendorId: product.vendorid?._id || product.vendorid,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
  };


  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:shadow-blue-800/10 transition-all duration-300 flex flex-col h-full">
      <Link
        to={`/products/${product._id}`}
        className="flex-1 no-underline"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1.5 group-hover:text-blue-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-blue-800">
            Rs. {product.price?.toLocaleString()}
          </p>
          {product.vendorid?.name && (
            <p className="text-xs text-slate-400 mt-1">by {product.vendorid.name}</p>
          )}
        </div>
      </Link>
      
      {/* Add To Cart Section */}
      <div className="px-4 pb-4 mt-auto">
         <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full h-10 bg-blue-800 text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
      </div>
    </div>
  );
};

export default ProductCard;
