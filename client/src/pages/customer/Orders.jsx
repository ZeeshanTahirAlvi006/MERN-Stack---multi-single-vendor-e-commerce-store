import { useState, useEffect } from 'react';
import { getMyOrders } from '../../api/api';
import { toast } from 'react-toastify';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n) =>
    `Rs. ${(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiClock className="text-amber-500" />;
      case 'Paid': return <FiCheckCircle className="text-blue-500" />;
      case 'Shipped': return <FiTruck className="text-indigo-500" />;
      case 'Delivered': return <FiCheckCircle className="text-emerald-500" />;
      case 'Cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiPackage className="text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Paid': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-800/30 border-t-blue-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Orders</h1>
          <p className="text-slate-500 text-sm">View and track your previous orders.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Orders Yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              You haven't placed any orders yet. Explore our products and place your first order!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order #{order._id.slice(-6)}</span>
                    <p className="text-sm text-slate-500 mt-1">
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
                    <div key={idx} className="flex items-center justify-between text-sm py-2">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                          {item.qty}
                        </span>
                        <span className="font-medium text-slate-900">Product ID: {item.productId}</span>
                      </div>
                      <span className="font-bold text-slate-700">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500">Payment: {order.paymentMethod}</span>
                  <div>
                    <span className="text-sm font-semibold text-slate-500 mr-3">Order Total</span>
                    <span className="text-xl font-bold text-blue-800">{formatCurrency(order.total)}</span>
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

export default Orders;
