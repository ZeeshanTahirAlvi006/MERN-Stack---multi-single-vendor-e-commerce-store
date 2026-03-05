import { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-bleed-void flex items-center justify-center relative crt-overlay">
        <Loader className="w-8 h-8 text-bleed-amber theme-glitch" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Energy Harvested',
      value: formatCurrency(stats?.totalRevenue),
      icon: <FiDollarSign />,
      color: 'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]',
      bg: 'bg-green-900/10 border border-green-500/30',
    },
    {
      label: 'Hive Tribute (10%)',
      value: formatCurrency(stats?.platformFee),
      icon: <FiBarChart2 />,
      color: 'text-bleed-rift drop-shadow-[0_0_5px_rgba(230,30,42,0.8)]',
      bg: 'bg-bleed-rift/10 border border-bleed-rift/30',
    },
    {
      label: 'Net Power',
      value: formatCurrency(stats?.netEarnings),
      icon: <FiTrendingUp />,
      color: 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]',
      bg: 'bg-bleed-void border border-green-500/20',
    },
    {
      label: 'Signals This Cycle',
      value: stats?.ordersThisMonth || 0,
      icon: <FiShoppingBag />,
      color: 'text-bleed-signal',
      bg: 'bg-bleed-void border border-bleed-ash',
    },
  ];

  // Revenue chart: simple bar chart
  const maxRevenue = Math.max(1, ...(stats?.monthlyRevenue?.map((m) => m.revenue) || []));

  return (
    <div className="min-h-screen bg-bleed-void flex relative">
      <div className="crt-overlay z-50 pointer-events-none mix-blend-overlay"></div>
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-bleed-void/80 backdrop-blur-sm rounded-lg border border-green-500/20 p-5 shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:border-green-500/50 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className={`w-10 h-10 ${card.bg} ${card.color} flex items-center justify-center text-xl shadow-[0_0_15px_rgba(34,197,94,0.2)]`}>
                  {card.icon}
                </span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,1)]"></div>
              </div>
              <p className="text-2xl font-mono text-bleed-signal mb-0.5 tracking-wider">{card.value}</p>
              <p className="text-xs text-green-500/70 font-mono-tag">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="lg:col-span-2 bg-bleed-void/80 backdrop-blur-sm border border-green-500/20 p-6 shadow-[0_0_15px_rgba(34,197,94,0.05)] relative">
            <h2 className="text-sm font-mono-tag text-green-500 mb-6 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)] tracking-widest border-b border-green-500/20 pb-2">SYS.DATA // HARVEST_CYCLES</h2>
            {stats?.monthlyRevenue?.length > 0 ? (
              <div className="flex items-end gap-3 h-48">
                {stats.monthlyRevenue.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] text-green-400/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(m.revenue)}
                    </span>
                    <div
                      className="w-full bg-green-500/20 group-hover:bg-green-500/40 transition-all duration-300 border-x border-t border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)] group-hover:shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                      style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: m.revenue > 0 ? '4px' : '0px' }}
                    />
                    <span className="text-[10px] text-green-500/70 font-mono-tag group-hover:text-green-400">{MONTHS[m.month - 1]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-green-500/30 text-xs font-mono">
                [NO DATA FOUND IN CURRENT SECTOR]
              </div>
            )}
          </div>

          {/* Stock Alerts */}
          <div className="bg-bleed-void/80 backdrop-blur-sm border border-bleed-rift/30 p-6 shadow-[0_0_15px_rgba(230,30,42,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 bg-bleed-rift/10 flex items-center justify-center border-l border-b border-bleed-rift/30">
              <div className="w-2 h-2 rounded-full bg-bleed-rift animate-pulse shadow-[0_0_8px_rgba(230,30,42,1)]"></div>
            </div>
            <div className="flex items-center gap-2 mb-4 border-b border-bleed-rift/20 pb-2">
              <FiAlertTriangle className="text-bleed-rift drop-shadow-[0_0_5px_rgba(230,30,42,0.8)]" />
              <h2 className="text-sm font-mono-tag text-bleed-rift tracking-widest">CRITICAL.ALERTS</h2>
            </div>
            {stats?.stockAlerts?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {stats.stockAlerts.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 bg-bleed-void border border-bleed-rift/40 hover:bg-bleed-rift/5 transition-colors group">
                    <img
                      src={item.images?.[0] || 'https://placehold.co/40x40/1e293b/94a3b8?text=?'}
                      alt={item.name}
                      className="w-10 h-10 object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all border border-bleed-rift/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-bleed-signal truncate drop-shadow-md">{item.name}</p>
                      <p className={`text-[10px] font-mono-tag tracking-wider ${item.stock === 0 ? 'text-bleed-rift shadow-[0_0_5px_rgba(230,30,42,0.3)]' : 'text-bleed-amber'}`}>
                        {item.stock === 0 ? 'VOID (EMPTY)' : `QTY: ${item.stock}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-green-500/50 text-center py-6 font-mono">[ALL SYSTEMS NOMINAL]</p>
            )}
          </div>
        </div>

        {/* Top Products + My Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Top Products */}
          <div className="bg-bleed-void/80 backdrop-blur-sm border border-green-500/20 p-6 shadow-[0_0_15px_rgba(34,197,94,0.05)] relative">
             <h2 className="text-sm font-mono-tag text-green-500 mb-6 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)] tracking-widest border-b border-green-500/20 pb-2">SYS.DATA // HIGH_YIELD_NODES</h2>
            {stats?.topProducts?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {stats.topProducts.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-3 border-b border-green-500/10 pb-2 last:border-0 last:pb-0 hover:bg-green-500/5 transition-colors p-2 -mx-2">
                    <span className="w-6 h-6 border border-green-500/50 flex items-center justify-center text-[10px] font-mono text-green-400 bg-bleed-void">
                      {i + 1}
                    </span>
                    <img
                      src={p.image || 'https://placehold.co/40x40/1e293b/94a3b8?text=?'}
                      alt={p.name}
                      className="w-10 h-10 object-cover opacity-60 mix-blend-luminosity border border-bleed-ash"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-bleed-signal font-mono truncate">{p.name}</p>
                      <p className="text-[10px] text-green-500/50 font-mono-tag tracking-wider">YIELD: {p.totalQty}</p>
                    </div>
                    <span className="text-xs font-mono text-green-400 drop-shadow-[0_0_2px_rgba(74,222,128,0.5)]">
                      {formatCurrency(p.totalSales)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-green-500/30 text-center py-6 font-mono">[NO YIELD DATA]</p>
            )}
          </div>

          {/* My Products */}
          <div className="bg-bleed-void/80 backdrop-blur-sm border border-green-500/20 p-6 shadow-[0_0_15px_rgba(34,197,94,0.05)] relative">
            <div className="flex items-center justify-between mb-4 border-b border-green-500/20 pb-2">
              <h2 className="text-sm font-mono-tag text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)] tracking-widest">LOCAL.NODES</h2>
              <span className="text-[10px] font-mono-tag tracking-wider text-bleed-void bg-green-500 px-2 py-0.5 shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                ACTIVE: {products.length}
              </span>
            </div>
            {products.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {products.slice(0, 10).map((p) => (
                  <div key={p._id} className="flex items-center gap-3 bg-bleed-void p-2 border border-bleed-ash/50 hover:border-bleed-rift/50 transition-colors group">
                    <img
                      src={p.images?.[0] || 'https://placehold.co/40x40/1e293b/94a3b8?text=?'}
                      alt={p.name}
                      className="w-10 h-10 object-cover opacity-60 mix-blend-luminosity border border-bleed-ash group-hover:mix-blend-normal group-hover:opacity-100 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-bleed-signal truncate">{p.name}</p>
                      <p className="text-[10px] text-bleed-signal/40 font-mono-tag tracking-wider">TYPE: {p.category} | DURABILITY: {p.stock}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-mono text-bleed-signal">
                        {formatCurrency(p.price)}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="text-bleed-rift/50 hover:text-bleed-rift bg-bleed-void border border-transparent hover:border-bleed-rift/30 cursor-pointer px-2 py-0.5 rounded-lg font-mono-tag text-[10px] tracking-widest transition-all duration-300 hover:shadow-[0_0_5px_rgba(230,30,42,0.5)] uppercase"
                        title="Sever Node"
                      >
                        Purge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center">
                <p className="text-[10px] text-green-500/50 mb-4 font-mono">[NO LOCAL NODES FOUND]</p>
                <Link
                  to="/vendor/add-product"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 text-[10px] font-mono-tag hover:bg-green-500 hover:text-bleed-void transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] border border-green-500/50 uppercase tracking-widest no-underline"
                >
                  <FiPlus size={12} /> INIT NODE
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
