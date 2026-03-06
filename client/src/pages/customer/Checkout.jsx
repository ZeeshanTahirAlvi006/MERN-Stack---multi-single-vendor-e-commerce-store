import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { placeOrder } from '../../api/api';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';

const Checkout = () => {
  const { items, clearCart, subtotal } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', zip: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const formatCurrency = (n) =>
    `Rs. ${(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 })}`;

  const handlePlaceOrder = async () => {
    if (!address.name || !address.street || !address.city || !address.country) {
      return toast.error('Please fill in all required address fields');
    }
    setPlacing(true);
    try {
      const res = await placeOrder({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty, price: i.price })),
        shippingAddress: address,
        paymentMethod,
        total: subtotal,
      });
      if (res.data.stripeUrl) {
        window.location.href = res.data.stripeUrl;
      } else {
        clearCart();
        navigate('/success');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6 no-underline">
          <FiArrowLeft /> Back to cart
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal ({items.reduce((a, i) => a + i.qty, 0)} items)</span>
              <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Shipping Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--accent)] rounded-lg transition-colors sm:col-span-2"
                />
                <input
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--accent)] rounded-lg transition-colors sm:col-span-2"
                />
                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--accent)] rounded-lg transition-colors"
                />
                <input
                  placeholder="State/Province (optional)"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--accent)] rounded-lg transition-colors"
                />
                <input
                  placeholder="ZIP/Postal Code (optional)"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--accent)] rounded-lg transition-colors"
                />
                <input
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--accent)] rounded-lg transition-colors"
                />
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Method</h4>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-[var(--accent)] rounded-lg cursor-pointer appearance-none transition-colors"
              >
                <option>Cash on Delivery</option>
                <option>Card (Stripe)</option>
              </select>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full py-4 mt-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-colors cursor-pointer border-none text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)]"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
