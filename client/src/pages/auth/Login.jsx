import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../api/api';
import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = 'Email is required';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginUser(formData.email, formData.password);
      dispatch(setCredentials(res.data));
      toast.success('Login successful');
      const role = res.data.role;
      navigate(role === 'admin' ? '/admin/dashboard' : role === 'vendor' ? '/vendor/dashboard' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "flex-1 border-none outline-none bg-transparent px-4 text-sm text-gray-900 placeholder:text-gray-400 h-full rounded-lg";

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[var(--bg-secondary)] px-4 py-10 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
    >
      {/* Base Subtle Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none animate-pattern z-0">
        <svg width="100%" height="200%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-floral-base" x="0" y="0" width="120" height="207.84" patternUnits="userSpaceOnUse">
              <g stroke="#10B981" strokeWidth="1" fill="none">
                <path d="M60 0 L120 34.64 L120 103.92 L60 138.56 L0 103.92 L0 34.64 Z" />
                <path d="M60 207.84 L120 173.2 L120 103.92 L60 69.28 L0 103.92 L0 173.2 Z" />
                <path d="M0 34.64 L120 103.92 M120 34.64 L0 103.92 M60 0 L60 138.56" />
                <path d="M0 173.2 L120 103.92 M120 173.2 L0 103.92 M60 207.84 L60 69.28" />
                <path d="M60 69.28 Q 75 86.6 90 69.28 Q 75 51.96 60 69.28 Z" />
                <path d="M60 69.28 Q 45 86.6 30 69.28 Q 45 51.96 60 69.28 Z" />
                <path d="M60 138.56 Q 75 121.24 90 138.56 Q 75 155.88 60 138.56 Z" />
                <path d="M60 138.56 Q 45 121.24 30 138.56 Q 45 155.88 60 138.56 Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-floral-base)" />
        </svg>
      </div>

      {/* Cursor Reveal Zoomed/Darker Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-90 animate-pattern">
          {/* Exact 1:1 mapping with the base layer, no scaling/zooming, just darker thicker lines */}
          <svg width="100%" height="200%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex-floral-hover" x="0" y="0" width="120" height="207.84" patternUnits="userSpaceOnUse">
                <g stroke="#047857" strokeWidth="2.5" fill="none">
                  <path d="M60 0 L120 34.64 L120 103.92 L60 138.56 L0 103.92 L0 34.64 Z" />
                  <path d="M60 207.84 L120 173.2 L120 103.92 L60 69.28 L0 103.92 L0 173.2 Z" />
                  <path d="M0 34.64 L120 103.92 M120 34.64 L0 103.92 M60 0 L60 138.56" />
                  <path d="M0 173.2 L120 103.92 M120 173.2 L0 103.92 M60 207.84 L60 69.28" />
                  <path d="M60 69.28 Q 75 86.6 90 69.28 Q 75 51.96 60 69.28 Z" />
                  <path d="M60 69.28 Q 45 86.6 30 69.28 Q 45 51.96 60 69.28 Z" />
                  <path d="M60 138.56 Q 75 121.24 90 138.56 Q 75 155.88 60 138.56 Z" />
                  <path d="M60 138.56 Q 45 121.24 30 138.56 Q 45 155.88 60 138.56 Z" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex-floral-hover)" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your account to continue.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className={`flex items-center bg-white border h-12 rounded-lg transition-all duration-200 ${errors.email ? 'border-red-400' : 'border-gray-200 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]'}`}>
                <div className="h-full flex items-center justify-center px-3 text-gray-400">
                  <FiMail />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              {errors.email && <span className="block text-red-500 text-xs mt-1">{errors.email}</span>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <Link to="/auth/forgot-password" className="text-xs text-[var(--accent)] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className={`flex items-center bg-white border h-12 rounded-lg transition-all duration-200 ${errors.password ? 'border-red-400' : 'border-gray-200 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]'}`}>
                <div className="h-full flex items-center justify-center px-3 text-gray-400">
                  <FiLock />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <span className="block text-red-500 text-xs mt-1">{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full h-12 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed border-none mt-2"
            >
              {loading ? 'Signing in...' : <>Sign In <FiArrowRight /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-[var(--accent)] font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
