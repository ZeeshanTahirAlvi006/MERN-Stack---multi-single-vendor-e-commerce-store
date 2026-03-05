import { useState, useEffect } from 'react';
import { getAdminStats } from '../../api/api';
import { toast } from 'react-toastify';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (error) {
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n) =>
    `Rs. ${(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center">
        <Loader className="w-8 h-8 text-red-600" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue), icon: <FiDollarSign />, color: 'text-amber-500', bg: 'bg-amber-900/20 border border-amber-500/30' },
    { label: 'Platform Fees', value: formatCurrency(stats?.totalPlatformFee), icon: <FiDollarSign />, color: 'text-red-500', bg: 'bg-red-900/20 border border-red-500/30' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingBag />, color: 'text-slate-300', bg: 'bg-slate-800 border border-slate-700' },
    { label: 'Active Products', value: stats?.totalProducts || 0, icon: <FiPackage />, color: 'text-amber-500', bg: 'bg-amber-900/20 border border-amber-500/30' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: <FiUsers />, color: 'text-red-500', bg: 'bg-red-900/20 border border-red-500/30' },
    { label: 'Total Vendors', value: stats?.totalVendors || 0, icon: <FiUsers />, color: 'text-slate-300', bg: 'bg-slate-800 border border-slate-700' },
  ];

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-stranger text-red-500 mb-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] tracking-wide">The Core (Admin)</h1>
        <p className="text-slate-400 text-sm font-light">System overview and key performance metrics of the Hive.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-red-900/30 flex items-start gap-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:border-red-500/30 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
