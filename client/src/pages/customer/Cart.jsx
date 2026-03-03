import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { placeOrder } from '../../api/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const { items, removeFromCart, updateQty, clearCart, subtotal } = useCart();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', zip: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);

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
        // Stripe payment — redirect to Stripe checkout
        clearCart();
        window.location.href = res.data.stripeUrl;
      } else {
        // COD — go to success page
        clearCart();
        navigate('/success');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <FiShoppingBag className="text-3xl text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add some products to get started.</p>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors no-underline"
        >
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <img
                  src={item.image || 'https://placehold.co/80x80/f5f7f9/999?text=?'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm font-bold text-[var(--accent)] mt-1">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={() => updateQty(item.productId, item.qty - 1)} className="p-2 hover:bg-gray-50 cursor-pointer bg-white border-none">
                    <FiMinus size={12} />
                  </button>
                  <span className="px-3 text-sm font-semibold border-x border-gray-200">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, item.qty + 1)} className="p-2 hover:bg-gray-50 cursor-pointer bg-white border-none">
                    <FiPlus size={12} />
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.productId)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary / Checkout */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
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

            {!showCheckout ? (
              <button
                onClick={() => {
                  if (!userInfo) return navigate('/auth/login');
                  setShowCheckout(true);
                }}
                className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors cursor-pointer border-none text-sm"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-gray-900">Shipping Address</h4>
                {['name', 'street', 'city', 'state', 'zip', 'country'].map((field) => (
                  <input
                    key={field}
                    placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}${field === 'zip' || field === 'state' ? ' (optional)' : ''}`}
                    value={address[field]}
                    onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--accent)] rounded-lg transition-colors"
                  />
                ))}

                <h4 className="text-sm font-semibold text-gray-900 mt-2">Payment Method</h4>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-[var(--accent)] rounded-lg cursor-pointer appearance-none transition-colors"
                >
                  <option>Cash on Delivery</option>
                  <option>Card (Stripe)</option>
                </select>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors cursor-pointer border-none text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-transparent border-none"
                >
                  ← Back to cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
