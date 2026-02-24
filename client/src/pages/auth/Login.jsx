import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/authSlice';
import { loginUser } from '../../api/api';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await loginUser(formData.email, formData.password);
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:flex-[0_0_45%] relative items-center justify-center bg-gradient-to-br from-blue-800 via-blue-800 to-blue-900 overflow-hidden">
        <div className="relative z-10 p-12 text-white max-w-[440px]">
          <div className="flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-lg rounded-2xl text-3xl mb-8 border border-white/20">
            <FiShoppingBag />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Jalal Sons</h1>
          <p className="text-lg leading-relaxed opacity-85 font-light mb-10">
            Premium groceries & everyday essentials delivered to your doorstep
          </p>
          <div className="flex flex-col gap-4">
            {['Fresh & Quality Products', 'Fast Home Delivery', 'Best Prices Guaranteed'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-[0.95rem] opacity-90">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-30 -right-30 w-[400px] h-[400px] rounded-full bg-white/[0.04]" />
        <div className="absolute -bottom-10 -right-10 w-[300px] h-[300px] rounded-full bg-white/[0.03]" />
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 text-2xl font-bold text-blue-800 mb-8">
            <FiShoppingBag className="text-3xl" />
            <span>Jalal Sons</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-[0.95rem]">Sign in to your account to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div
                className={`flex items-center bg-white border-[1.5px] rounded-xl px-4 h-12 transition-all duration-200
                  ${errors.email
                    ? 'border-red-500 focus-within:ring-3 focus-within:ring-red-500/10'
                    : 'border-slate-200 focus-within:border-blue-800 focus-within:ring-3 focus-within:ring-blue-800/10'}`}
              >
                <FiMail className="text-slate-400 text-lg shrink-0 mr-3" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="flex-1 border-none outline-none bg-transparent text-[0.925rem] text-slate-900 placeholder:text-slate-300 h-full font-[inherit]"
                />
              </div>
              {errors.email && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.email}</span>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link to="/auth/forgot-password" className="text-xs text-blue-800 font-medium hover:text-blue-800 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div
                className={`flex items-center bg-white border-[1.5px] rounded-xl px-4 h-12 transition-all duration-200
                  ${errors.password
                    ? 'border-red-500 focus-within:ring-3 focus-within:ring-red-500/10'
                    : 'border-slate-200 focus-within:border-blue-800 focus-within:ring-3 focus-within:ring-blue-800/10'}`}
              >
                <FiLock className="text-slate-400 text-lg shrink-0 mr-3" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="flex-1 border-none outline-none bg-transparent text-[0.925rem] text-slate-900 placeholder:text-slate-300 h-full font-[inherit]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="bg-transparent border-none cursor-pointer text-slate-400 text-lg flex items-center p-0 ml-2 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.password}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full h-12 bg-gradient-to-br from-blue-800 to-blue-800 text-white rounded-xl text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 mt-2 hover:not-disabled:shadow-lg hover:not-disabled:shadow-blue-800/35 hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5.5 h-5.5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-7 text-[0.9rem] text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/auth/register" className="text-blue-800 font-semibold no-underline hover:text-blue-800 hover:underline transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
