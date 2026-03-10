import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../../api/api';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

const Settings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name || '',
        email: userInfo.email || '',
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const updateData = { name: formData.name };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await updateUserProfile(updateData);
      toast.success('Profile updated successfully! Login again to see changes everywhere.');
      
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperBase =
    'flex items-center bg-white border-[1.5px] rounded-xl px-4 h-12 transition-all duration-200';
  const inputWrapperNormal =
    'border-gray-200 focus-within:border-[var(--accent)] focus-within:ring-3 focus-within:ring-[var(--accent)]/10';
  const inputClasses =
    'w-full bg-transparent border-none outline-none text-[0.925rem] text-gray-900 placeholder:text-gray-300 font-[inherit] h-full';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
        
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className={`${inputWrapperBase} ${inputWrapperNormal}`}>
                <FiUser className="text-gray-400 text-lg shrink-0 mr-3" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className={`${inputWrapperBase} border-gray-200 bg-gray-50/50`}>
                <FiMail className="text-gray-400 text-lg shrink-0 mr-3" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  title="Email cannot be changed"
                  className={`${inputClasses} text-gray-500 cursor-not-allowed`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Email address cannot be changed currently.</p>
            </div>

            <div className="pt-4 pb-2">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Change Password
              </h3>
              <p className="text-xs text-gray-500 mt-1">Leave blank if you do not wish to change your password.</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                New Password
              </label>
              <div className={`${inputWrapperBase} ${inputWrapperNormal}`}>
                <FiLock className="text-gray-400 text-lg shrink-0 mr-3" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={inputClasses}
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className={`${inputWrapperBase} ${inputWrapperNormal}`}>
                <FiLock className="text-gray-400 text-lg shrink-0 mr-3" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={inputClasses}
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex items-center justify-center gap-2 w-full sm:w-auto px-8 h-12 bg-[var(--accent)] text-white rounded-full text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 hover:not-disabled:bg-[var(--accent-hover)] hover:not-disabled:shadow-md hover:not-disabled:shadow-[var(--accent)]/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-[2px] border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiSave className="text-lg" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
