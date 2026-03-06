import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVendorProfile } from '../../api/api';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import { FiMapPin, FiCalendar, FiBox, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const VendorProfile = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendorProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getVendorProfile(id);
      setVendor(res.data.vendor);
      setProducts(res.data.products);
    } catch (error) {
      toast.error('Failed to load vendor profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVendorProfile();
  }, [fetchVendorProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <Loader />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-secondary)] px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor not found</h2>
        <p className="text-gray-500 mb-6">The vendor you are looking for does not exist or has been removed.</p>
        <Link to="/" className="text-[var(--accent)] font-medium hover:underline flex items-center gap-2">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Dynamic Cover/Banner Block */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-slate-900 to-[#1e293b] relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 pb-20">
        
        {/* Vendor Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-end text-center md:text-left">
          <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-2xl shadow-md border-4 border-white overflow-hidden flex-shrink-0 relative z-10 flex items-center justify-center">
            {vendor.storeInfo?.logo ? (
              <img src={vendor.storeInfo.logo} alt={vendor.storeInfo?.name || vendor.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl md:text-5xl font-bold text-gray-300">
                {(vendor.storeInfo?.name || vendor.name).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex-1 pb-2 flex flex-col items-center md:items-start">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              {vendor.storeInfo?.name || vendor.name}
            </h1>
            <p className="text-gray-600 mb-4 max-w-2xl leading-relaxed">
              {vendor.storeInfo?.description || 'This vendor has not provided a description yet.'}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <FiBox className="text-[var(--accent)]" /> 
                {products.length} Products
              </div>
              <div className="flex items-center gap-1.5">
                <FiCalendar className="text-[var(--accent)]" /> 
                Joined {new Date(vendor.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Products */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-xl font-bold text-gray-900 border-b-2 border-[var(--accent)] pb-2 inline-block">
            Store Catalogue
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            <FiBox className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No products yet</p>
            <p className="text-sm">This vendor hasn't listed any products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfile;
