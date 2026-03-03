import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-8 text-center shadow-sm border border-gray-100">
        
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-3xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your order has been placed successfully. 
          {sessionId && ' Payment received.'}
        </p>

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
      </div>
    </div>
  );
};

export default Success;
