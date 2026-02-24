import { useState, useEffect } from 'react';
import { getAdminStats } from '../../api/api';
import { toast } from 'react-toastify';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

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
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-800/30 border-t-blue-800 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue), icon: <FiDollarSign />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Platform Fees', value: formatCurrency(stats?.totalPlatformFee), icon: <FiDollarSign />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingBag />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Active Products', value: stats?.totalProducts || 0, icon: <FiPackage />, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: <FiUsers />, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' },
    { label: 'Total Vendors', value: stats?.totalVendors || 0, icon: <FiUsers />, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">System overview and key performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
