import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useCart from '../../hooks/useCart';
import { placeOrder } from '../../api/api';
import {
  FiShoppingCart,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiPackage,
  FiX,
} from 'react-icons/fi';

const EMPTY_ADDRESS = { name: '', street: '', city: '', zip: '', country: '' };

const Cart = () => {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, removeFromCart, updateQty, clearCart } = useCart();
  const { userInfo } = useSelector((s) => s.auth);

  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!userInfo) {
      toast.error('Please sign in to place an order');
      return navigate('/auth/login');
    }

    if (!address.name || !address.street || !address.city || !address.country) {
      return toast.error('Please fill in the required shipping fields');
    }

    setPlacing(true);
    try {
      const res = await placeOrder({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      toast.success('Order placed successfully!');
      
      if (res.data?.stripeUrl) {
        window.location.href = res.data.stripeUrl;
      } else {
        navigate('/success');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  /* ─── Empty cart ─── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
          <FiShoppingCart className="text-3xl text-blue-800" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="text-slate-500 text-sm text-center max-w-xs">
          Looks like you haven&apos;t added anything yet. Explore our collection and find something you love!
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-800 text-white rounded-xl text-sm font-semibold no-underline hover:bg-teal-800 transition-colors"
        >
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  /* ─── Cart with items ─── */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Items column ─── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 items-start"
            >
              {/* Image */}
              <img
                src={item.image || 'https://placehold.co/120x120/e2e8f0/94a3b8?text=No+Img'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl shrink-0 border border-slate-100"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.productId}`}
                  className="text-sm font-semibold text-slate-900 hover:text-blue-800 transition-colors no-underline line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-blue-800 font-bold mt-1">
                  Rs. {item.price?.toLocaleString()}
                </p>

                {/* Qty stepper */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-slate-900">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      disabled={item.qty >= item.stock}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">{item.stock} available</span>
                </div>
              </div>

              {/* Right: total + remove */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="text-sm font-bold text-slate-900">
                  Rs. {(item.price * item.qty).toLocaleString()}
                </p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <FiTrash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Summary / Checkout column ─── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Items ({itemCount})</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 mb-4">
              <span>Delivery</span>
              <span className="text-blue-600 font-medium">Free</span>
            </div>
            <div className="border-t border-slate-200 pt-4 flex justify-between text-base font-bold text-slate-900 mb-6">
              <span>Total</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            {!showCheckout ? (
              <button
                onClick={() => {
                  if (!userInfo) {
                    toast.error('Please sign in to checkout');
                    return navigate('/auth/login');
                  }
                  setShowCheckout(true);
                }}
                className="w-full h-12 bg-gradient-to-br from-blue-800 to-blue-800 text-white rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-800/35 hover:-translate-y-0.5 active:translate-y-0 border-none"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-slate-700">Shipping Address</h3>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {['name', 'street', 'city', 'zip', 'country'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === 'zip' ? ' (optional)' : ' *')}
                    value={address[field]}
                    onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 transition-all font-[inherit]"
                  />
                ))}

                <h3 className="text-sm font-semibold text-slate-700 mt-2">Payment Method</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 transition-all font-[inherit] bg-white cursor-pointer"
                >
                  <option>Cash on Delivery</option>
                  <option>Card (Stripe)</option>
                </select>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full h-12 mt-2 bg-gradient-to-br from-blue-800 to-blue-800 text-white rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-800/35 hover:-translate-y-0.5 active:translate-y-0 border-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {placing ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiPackage /> Place Order
                    </>
                  )}
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
