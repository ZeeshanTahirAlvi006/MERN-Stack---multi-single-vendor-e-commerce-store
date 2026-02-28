import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/authSlice';
import { registerUser } from '../../api/api';
import { toast } from 'react-toastify';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShoppingBag,
  FiArrowRight,
  FiShoppingCart,
  FiPackage,
} from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const { data } = await registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      dispatch(setCredentials(data));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: 'customer',
      label: 'Customer',
      description: 'Shop & order products',
      icon: <FiShoppingCart />,
    },
    {
      value: 'vendor',
      label: 'Vendor',
      description: 'Sell your products',
      icon: <FiPackage />,
    },
  ];

  // Reusable input wrapper classes
  const inputWrapperBase =
    'flex items-center bg-white border-[1.5px] rounded-xl px-4 h-12 transition-all duration-200';
  const inputWrapperNormal =
    'border-slate-200 focus-within:border-blue-800 focus-within:ring-3 focus-within:ring-blue-800/10';
  const inputWrapperError =
    'border-red-500 focus-within:ring-3 focus-within:ring-red-500/10';
  const inputClasses =
    'flex-1 border-none outline-none bg-transparent text-[0.925rem] text-slate-900 placeholder:text-slate-300 h-full font-[inherit]';

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
            Join thousands of happy customers & vendors on Pakistan&apos;s favourite grocery platform
          </p>
          <div className="flex flex-col gap-4">
            {['Free Delivery on First Order', 'Become a Vendor & Grow', 'Secure & Easy Checkout'].map((f) => (
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
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative">
        <div className="absolute top-6 left-6 lg:left-8">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-800 transition-colors">
            <FiArrowRight className="rotate-180" />
            Back to Shop
          </Link>
        </div>

        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 text-2xl font-bold text-blue-800 mb-8">
            <FiShoppingBag className="text-3xl" />
            <span>Jalal Sons</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create your account</h2>
            <p className="text-slate-500 text-[0.95rem]">Start shopping or selling in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className={`${inputWrapperBase} ${errors.name ? inputWrapperError : inputWrapperNormal}`}>
                <FiUser className="text-slate-400 text-lg shrink-0 mr-3" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className={inputClasses}
                />
              </div>
              {errors.name && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.name}</span>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className={`${inputWrapperBase} ${errors.email ? inputWrapperError : inputWrapperNormal}`}>
                <FiMail className="text-slate-400 text-lg shrink-0 mr-3" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={inputClasses}
                />
              </div>
              {errors.email && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.email}</span>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className={`${inputWrapperBase} ${errors.password ? inputWrapperError : inputWrapperNormal}`}>
                <FiLock className="text-slate-400 text-lg shrink-0 mr-3" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={inputClasses}
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className={`${inputWrapperBase} ${errors.confirmPassword ? inputWrapperError : inputWrapperNormal}`}>
                <FiLock className="text-slate-400 text-lg shrink-0 mr-3" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  className="bg-transparent border-none cursor-pointer text-slate-400 text-lg flex items-center p-0 ml-2 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="block text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setFormData({ ...formData, role: r.value })}
                    className={`flex flex-col items-center gap-1 p-4 bg-white border-[1.5px] rounded-xl cursor-pointer transition-all duration-200 text-center
                      ${formData.role === r.value
                        ? 'border-blue-800 bg-blue-50 ring-3 ring-blue-800/10'
                        : 'border-slate-200 hover:border-blue-800 hover:bg-blue-50'}`}
                  >
                    <span className="text-2xl text-blue-800 flex">{r.icon}</span>
                    <span className="text-[0.9rem] font-semibold text-slate-900">{r.label}</span>
                    <span className="text-xs text-slate-400">{r.description}</span>
                  </button>
                ))}
              </div>
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
                  Create Account
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-7 text-[0.9rem] text-slate-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-800 font-semibold no-underline hover:text-blue-800 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
