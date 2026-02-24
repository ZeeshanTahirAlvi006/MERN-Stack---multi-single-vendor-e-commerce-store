import { useState, useEffect } from 'react';
import { getAdminUsers, toggleUserStatus } from '../../api/api';
import { toast } from 'react-toastify';
import { FiFilter, FiUserCheck, FiUserX } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // '' = all, 'vendor', 'customer', 'admin'

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
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">User Management</h1>
          <p className="text-slate-500 text-sm">Manage accounts and platform access.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 h-10 shadow-sm">
          <FiFilter className="text-slate-400" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border-none outline-none text-slate-700 bg-transparent cursor-pointer font-medium"
          >
            <option value="">All Roles</option>
            <option value="customer">Customers</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase">Name</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase">Email</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase">Role</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase">Status</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-500 font-bold uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <span className="w-6 h-6 border-2 border-blue-800/30 border-t-blue-800 rounded-full animate-spin inline-block mx-auto mb-2" />
                    <p className="text-sm">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 text-sm">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{user.name}</div>
                      {user.role === 'vendor' && user.storeInfo?.name && (
                        <div className="text-xs text-slate-500 mt-0.5">{user.storeInfo.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'vendor' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border-none cursor-pointer ${
                            user.isActive 
                              ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' 
                              : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
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
