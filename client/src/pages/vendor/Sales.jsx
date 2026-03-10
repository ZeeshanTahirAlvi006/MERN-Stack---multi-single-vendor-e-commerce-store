import { useState, useEffect } from 'react';
import { getVendorSales, updateOrderStatus } from '../../api/api';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import Loader from '../../components/common/Loader';

const Sales = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await getVendorSales();
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load sales history');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n) =>
    `Rs. ${(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchSales(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiClock className="text-amber-500" />;
      case 'Paid': return <FiCheckCircle className="text-blue-500" />;
      case 'Shipped': return <FiTruck className="text-indigo-500" />;
      case 'Delivered': return <FiCheckCircle className="text-emerald-500" />;
      case 'Cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiPackage className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Paid': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sales History</h1>
            <p className="text-gray-500 text-sm">Track your orders and update fulfillment statuses.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
             <FiTrendingUp className="text-[var(--accent)]" />
             <span className="text-sm font-semibold text-gray-700">
               {orders.length} Total Orders
             </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Sales Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              You haven't made any sales yet. Keep adding great products and they will appear here soon!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order #{order._id.slice(-6)}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">
                        {order.customerId?.name || order.shippingAddress?.name || 'Guest Customer'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy - HH:mm')}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between text-sm py-2 border-t border-gray-50 first:border-0">
                         <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                              {item.qty}
                            </span>
                            <span className="font-medium text-gray-900 line-clamp-1">Product ID: {item.productId}</span>
                         </div>
                         <span className="font-bold text-gray-700">{formatCurrency(item.price * item.qty)}</span>
                       </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gray-50 md:w-64 flex flex-col justify-between">
                   <div>
                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order Total</p>
                     <p className="text-2xl font-bold text-[var(--accent)]">
                        {formatCurrency(order.items.reduce((acc, curr) => acc + (curr.price * curr.qty), 0))}
                     </p>
                   </div>

                   <div className="mt-6">
                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                     <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updatingId === order._id || order.status === 'Cancelled' || order.status === 'Delivered'}
                        className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                     >
                       <option value="Pending">Pending</option>
                       <option value="Paid">Paid</option>
                       <option value="Shipped">Shipped</option>
                       <option value="Delivered">Delivered</option>
                       <option value="Cancelled">Cancelled</option>
                     </select>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
