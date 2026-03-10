import { useState, useEffect } from 'react';
import { getAdminUsers, toggleUserStatus } from '../../api/api';
import { toast } from 'react-toastify';
import { FiFilter, FiUserCheck, FiUserX } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers(filter);
  }, [filter]);

  const fetchUsers = async (role) => {
    setLoading(true);
    try {
      const res = await getAdminUsers(role ? { role } : {});
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: res.data.isActive } : u));
      toast.success(`User ${res.data.isActive ? 'activated' : 'suspended'} successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle user status');
    }
  };

  return (
    <div className="p-8 bg-[var(--bg-primary)] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm">Manage customers, vendors, and admins.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">
          <FiFilter className="text-gray-400" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border-none outline-none text-gray-700 bg-transparent cursor-pointer font-medium appearance-none w-full"
          >
            <option value="">All Users</option>
            <option value="customer">Customers</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    <Loader className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
                    <p className="text-sm">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      {user.role === 'vendor' && user.storeInfo?.name && (
                        <div className="text-xs text-[var(--accent)] mt-0.5">{user.storeInfo.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'vendor' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 border cursor-pointer shadow-sm ${
                            user.isActive 
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {user.isActive ? <FiUserX /> : <FiUserCheck />}
                          {user.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
