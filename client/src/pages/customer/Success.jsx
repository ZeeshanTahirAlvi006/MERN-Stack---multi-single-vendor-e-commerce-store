import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiShoppingBag, FiArrowRight, FiPackage } from 'react-icons/fi';
import { verifyStripeSession } from '../../api/api';
import useCart from '../../hooks/useCart';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verifying, setVerifying] = useState(!!sessionId);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      console.log('🔍 Calling verifyStripeSession with sessionId:', sessionId);
      const res = await verifyStripeSession(sessionId);
      console.log('🔍 Verify response:', res.data);
      if (res.data.status === 'Paid') {
        setVerified(true);
        clearCart(); // Clear cart only after payment is confirmed
      } else {
        setError(`Payment status: ${res.data.status}`);
      }
    } catch (err) {
      console.error('❌ Verify error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Could not verify payment status');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-8 text-center shadow-sm border border-gray-100">
        
        {verifying ? (
          <>
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h1>
            <p className="text-gray-500 text-sm">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <div className={`w-16 h-16 ${verified || !sessionId ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {verified || !sessionId ? (
                <FiCheckCircle className="text-3xl" />
              ) : (
                <FiAlertCircle className="text-3xl" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {verified ? 'Payment Successful!' : !sessionId ? 'Order Confirmed!' : 'Order Placed'}
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              {verified
                ? 'Your payment has been confirmed and your order is being processed.'
                : !sessionId
                  ? 'Your order has been placed successfully.'
                  : error || 'Your order has been placed. Payment verification is in progress.'}
            </p>
          </>
        )}

        {!verifying && (
          <div className="flex flex-col gap-3">
            <Link
              to="/orders"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors no-underline"
            >
              <FiPackage /> View My Orders
            </Link>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors no-underline"
            >
              Continue Shopping <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
