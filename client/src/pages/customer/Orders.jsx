import { useState, useEffect } from 'react';
import { getMyOrders } from '../../api/api';
import { toast } from 'react-toastify';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
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
      default: return <FiPackage className="text-gray-400" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Paid': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-2xl text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 text-sm">You haven't placed any orders yet. Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400">Order #{order._id.slice(-6)}</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 w-fit ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Items */}
                <div className="p-5 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center text-xs font-semibold">
                          x{item.qty}
                        </span>
                        <span className="text-gray-700 text-sm">{item?.productId}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-xs text-gray-500">Payment: {order.paymentMethod}</span>
                  <span className="text-base font-bold text-gray-900">Total: {formatCurrency(order.total)}</span>
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
