import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0] || 'https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image';

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 no-underline"
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
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1.5 group-hover:text-teal-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-teal-700">
          Rs. {product.price?.toLocaleString()}
        </p>
        {product.vendorid?.name && (
          <p className="text-xs text-slate-400 mt-1">by {product.vendorid.name}</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
