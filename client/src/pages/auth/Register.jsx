import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../api/api';
import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'customer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'customer', label: 'Customer', desc: 'Shop and order products' },
    { value: 'vendor', label: 'Vendor', desc: 'Sell your products' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Minimum 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const res = await registerUser(payload.name, payload.email, payload.password, payload.role);
      dispatch(setCredentials(res.data));
      toast.success('Account created successfully');
      navigate(res.data.role === 'vendor' ? '/vendor/dashboard' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "flex-1 border-none outline-none bg-transparent px-4 text-sm text-gray-900 placeholder:text-gray-400 h-full rounded-lg";
  const wrapperBase = "flex items-center bg-white border h-12 rounded-lg transition-all duration-200";
  const wrapperNormal = "border-gray-200 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]";
  const wrapperError = "border-red-400";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[var(--bg-secondary)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm text-gray-500">Join us and start shopping today.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className={`${wrapperBase} ${errors.name ? wrapperError : wrapperNormal}`}>
                <div className="h-full flex items-center justify-center px-3 text-gray-400"><FiUser /></div>
                <input id="name" type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} autoComplete="name" className={inputClass} />
              </div>
              {errors.name && <span className="block text-red-500 text-xs mt-1">{errors.name}</span>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className={`${wrapperBase} ${errors.email ? wrapperError : wrapperNormal}`}>
                <div className="h-full flex items-center justify-center px-3 text-gray-400"><FiMail /></div>
                <input id="email" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} autoComplete="email" className={inputClass} />
              </div>
              {errors.email && <span className="block text-red-500 text-xs mt-1">{errors.email}</span>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className={`${wrapperBase} ${errors.password ? wrapperError : wrapperNormal}`}>
                <div className="h-full flex items-center justify-center px-3 text-gray-400"><FiLock /></div>
                <input id="password" type={showPassword ? 'text' : 'password'} name="password" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} autoComplete="new-password" className={inputClass} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <span className="block text-red-500 text-xs mt-1">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className={`${wrapperBase} ${errors.confirmPassword ? wrapperError : wrapperNormal}`}>
                <div className="h-full flex items-center justify-center px-3 text-gray-400"><FiLock /></div>
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" className={inputClass} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="px-3 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="block text-red-500 text-xs mt-1">{errors.confirmPassword}</span>}
            </div>

            {/* Role Selector */}
            <div className="pt-3 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setFormData({ ...formData, role: r.value })}
                    className={`flex flex-col items-center gap-1 p-4 bg-white border rounded-lg cursor-pointer transition-all duration-200 text-center ${
                      formData.role === r.value
                        ? 'border-[var(--accent)] bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${formData.role === r.value ? 'text-[var(--accent)]' : 'text-gray-700'}`}>{r.label}</span>
                    <span className="text-[11px] text-gray-400">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full h-12 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed border-none mt-2"
            >
              {loading ? 'Creating account...' : <>Create Account <FiArrowRight /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-[var(--accent)] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
