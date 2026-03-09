import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/api';
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
      'Processing': 'bg-purple-100 text-purple-700',
      'Shipped': 'bg-indigo-100 text-indigo-700',
      'Delivered': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success('Order status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader className="w-8 h-8 text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-[var(--bg-primary)] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Orders</h1>
        <p className="text-gray-500 text-sm">Monitor all customer orders globally.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">
                    <FiPackage className="text-3xl mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No orders found.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[var(--accent)] cursor-pointer hover:text-[var(--accent-hover)]">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customerId?.name || order.shippingAddress?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-400">{order.customerId?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      Rs. {order.total?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-md border outline-none cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
