import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getVendorDashboard, getVendorProducts, deleteProduct } from '../../api/api';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import {
  FiDollarSign,
  FiTrendingUp,
  FiShoppingBag,
  FiPackage,
  FiAlertTriangle,
  FiPlus,
  FiArrowLeft,
  FiBarChart2,
  FiTrash2,
} from 'react-icons/fi';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashRes, prodRes] = await Promise.all([
        getVendorDashboard(),
        getVendorProducts(),
      ]);
      setStats(dashRes.data);
      setProducts(prodRes.data);
    } catch {
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
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center relative">
        <Loader className="w-8 h-8 text-[var(--accent)]" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue),
      icon: <FiDollarSign />,
      color: 'text-[var(--accent)]',
      bg: 'bg-[var(--accent)]/10',
    },
    {
      label: 'Platform Fee (10%)',
      value: formatCurrency(stats?.platformFee),
      icon: <FiBarChart2 />,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      label: 'Net Earnings',
      value: formatCurrency(stats?.netEarnings),
      icon: <FiTrendingUp />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Orders This Month',
      value: stats?.ordersThisMonth || 0,
      icon: <FiShoppingBag />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  const maxRevenue = Math.max(1, ...(stats?.monthlyRevenue?.map((m) => m.revenue) || []));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex relative">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Vendor Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {userInfo?.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center text-xl text-${card.color.split('-')[1]}-600`}>
                  {React.cloneElement(card.icon, { className: card.color })}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{card.value}</p>
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Revenue History</h2>
            {stats?.monthlyRevenue?.length > 0 ? (
              <div className="flex items-end gap-3 h-48">
                {stats.monthlyRevenue.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(m.revenue)}
                    </span>
                    <div
                      className="w-full bg-[var(--accent)]/20 rounded-t-sm group-hover:bg-[var(--accent)]/40 transition-all duration-300"
                      style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: m.revenue > 0 ? '4px' : '0px' }}
                    />
                    <span className="text-xs text-gray-500 font-medium group-hover:text-gray-900">{MONTHS[m.month - 1]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                No revenue data available
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <FiAlertTriangle className="text-red-500" />
              <h2 className="text-base font-bold text-gray-900">Low Stock Alerts</h2>
            </div>
            {stats?.stockAlerts?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {stats.stockAlerts.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <img
                      src={item.images?.[0] || 'https://placehold.co/40x40/f8fafc/94a3b8?text=?'}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className={`text-xs font-semibold ${item.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                        {item.stock === 0 ? 'Out of Stock' : `Only ${item.stock} left`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">All products fully stocked</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
             <h2 className="text-base font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Top Selling Products</h2>
            {stats?.topProducts?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {stats.topProducts.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-3 border-b border-gray-50 pb-2 last:border-0 last:pb-0 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {i + 1}
                    </span>
                    <img
                      src={p.image || 'https://placehold.co/40x40/f8fafc/94a3b8?text=?'}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-md border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">Sold: {p.totalQty}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--accent)]">
                      {formatCurrency(p.totalSales)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No sales data yet</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-base font-bold text-gray-900">Your Products</h2>
              <span className="text-xs font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                {products.length} Items
              </span>
            </div>
            {products.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {products.slice(0, 10).map((p) => (
                  <div key={p._id} className="flex items-center gap-3 bg-white p-2 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors group">
                    <img
                      src={p.images?.[0] || 'https://placehold.co/40x40/f8fafc/94a3b8?text=?'}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 truncate">{p.category} | Stock: {p.stock}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(p.price)}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Delete Product"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center">
                <p className="text-sm text-gray-500 mb-4">You haven't added any products yet.</p>
                <Link
                  to="/vendor/add-product"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
                >
                  <FiPlus size={16} /> Add Product
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
