import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-4xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Successful!</h1>
        <p className="text-slate-500 mb-8">
          Thank you for your purchase. Your order has been placed and is being processed. 
          {sessionId && ' Your payment was successful.'}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors no-underline"
          >
            <FiPackage /> View My Orders
          </Link>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors no-underline"
          >
            Continue Shopping <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
