import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getVendorDashboard, getVendorProducts, deleteProduct } from '../../api/api';
import { toast } from 'react-toastify';
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
      // Will show empty state
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
      // Optionally refresh dashboard stats here, but removing from local list is fine for UX
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-800/30 border-t-blue-800 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue),
      icon: <FiDollarSign />,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
    },
    {
      label: 'Platform Fee (10%)',
      value: formatCurrency(stats?.platformFee),
      icon: <FiBarChart2 />,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    },
    {
      label: 'Net Earnings',
      value: formatCurrency(stats?.netEarnings),
      icon: <FiTrendingUp />,
      color: 'from-blue-500 to-green-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
    {
      label: 'Orders This Month',
      value: stats?.ordersThisMonth || 0,
      icon: <FiShoppingBag />,
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      text: 'text-violet-700',
    },
  ];

  // Revenue chart: simple bar chart
  const maxRevenue = Math.max(1, ...(stats?.monthlyRevenue?.map((m) => m.revenue) || []));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar added globally via App.jsx wrapping, or we can just render the layout directly here. Wait, App.jsx only adds Navbar. The Sidebar is specific to Vendor and Admin. I'll need to update the layout to include Sidebar for vendor pages, or just let App.jsx handle it since I already made it flex. Actually, App.jsx only has Navbar. Let's fix Dashboard layout. Wait, I should just remove the top bar for now. */}
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`w-10 h-10 rounded-xl ${card.bg} ${card.text} flex items-center justify-center text-xl`}>
                  {card.icon}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-0.5">{card.value}</p>
              <p className="text-sm text-slate-400">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-6">Monthly Revenue</h2>
            {stats?.monthlyRevenue?.length > 0 ? (
              <div className="flex items-end gap-3 h-48">
                {stats.monthlyRevenue.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {formatCurrency(m.revenue)}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: m.revenue > 0 ? '8px' : '0px' }}
                    />
                    <span className="text-xs text-slate-400">{MONTHS[m.month - 1]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                No revenue data yet
              </div>
            )}
          </div>

          {/* Stock Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiAlertTriangle className="text-amber-500" />
              <h2 className="text-base font-semibold text-slate-900">Stock Alerts</h2>
            </div>
            {stats?.stockAlerts?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {stats.stockAlerts.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                    <img
                      src={item.images?.[0] || 'https://placehold.co/40x40/e2e8f0/94a3b8?text=?'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                      <p className={`text-xs font-semibold ${item.stock === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                        {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">All stock levels are healthy!</p>
            )}
          </div>
        </div>

        {/* Top Products + My Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Top Selling Products</h2>
            {stats?.topProducts?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {stats.topProducts.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      #{i + 1}
                    </span>
                    <img
                      src={p.image || 'https://placehold.co/40x40/e2e8f0/94a3b8?text=?'}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.totalQty} sold</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-800">
                      {formatCurrency(p.totalSales)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">No sales yet</p>
            )}
          </div>

          {/* My Products */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">My Products</h2>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {products.length} total
              </span>
            </div>
            {products.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                {products.slice(0, 10).map((p) => (
                  <div key={p._id} className="flex items-center gap-3">
                    <img
                      src={p.images?.[0] || 'https://placehold.co/40x40/e2e8f0/94a3b8?text=?'}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.category} · Stock: {p.stock}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-blue-800">
                        {formatCurrency(p.price)}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Product"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 mb-3">No products yet</p>
                <Link
                  to="/vendor/add-product"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-800 text-white text-sm rounded-lg no-underline hover:bg-blue-800 transition-colors"
                >
                  <FiPlus /> Add your first product
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
