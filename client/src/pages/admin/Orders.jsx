import { useState, useEffect } from 'react';
import { getAllOrders } from '../../api/api';
import { toast } from 'react-toastify';
import { FiPackage, FiCalendar } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const map = {
      'Pending': 'bg-amber-100 text-amber-700',
      'Paid': 'bg-blue-100 text-blue-700',
      'Shipped': 'bg-indigo-100 text-indigo-700',
      'Delivered': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <Loader className="w-8 h-8 text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-stranger text-red-500 mb-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] tracking-wide">All Signals</h1>
        <p className="text-slate-400 text-sm font-light">Monitor all cross-void transactions globally.</p>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm border border-red-900/30 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-shadow duration-300">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-red-900/30">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Signal ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Entity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Energy Transfer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/20">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <FiPackage className="text-3xl mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-light">No signals detected yet.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-amber-500 cursor-pointer hover:text-red-400">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-slate-500" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-200">{order.customerId?.name || order.shippingAddress?.name || 'Unknown Entity'}</div>
                      <div className="text-xs text-slate-500">{order.customerId?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-red-500 drop-shadow-[0_0_2px_rgba(220,38,38,0.5)]">
                      Rs. {order.total?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
