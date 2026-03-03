import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-slate-900/40 rounded-2xl overflow-hidden border border-red-900/20 animate-pulse backdrop-blur-sm">
            <div className="aspect-square bg-slate-800/50" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-5 bg-slate-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg font-medium">The void is empty. No signals found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
