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
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-stranger text-red-500 mb-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] tracking-wide">Network Identities</h1>
          <p className="text-slate-400 text-sm font-light">Oversee all entities connected to the Hive.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm border border-red-900/50 rounded-xl px-3 h-10 shadow-[0_0_15px_rgba(0,0,0,0.5)] focus-within:border-red-500 focus-within:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all">
          <FiFilter className="text-slate-500" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border-none outline-none text-slate-300 bg-transparent cursor-pointer font-medium appearance-none w-full"
          >
            <option value="" className="bg-slate-900">All Entities</option>
            <option value="customer" className="bg-slate-900">Wanderers (Customers)</option>
            <option value="vendor" className="bg-slate-900">Harvesters (Vendors)</option>
            <option value="admin" className="bg-slate-900">Overlords (Admins)</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-red-900/30 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:border-red-500/30 transition-all duration-300">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-red-900/30">
                <th className="px-6 py-4 text-xs tracking-wider text-slate-400 font-bold uppercase">Identity</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-400 font-bold uppercase">Signature</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-400 font-bold uppercase">Class</th>
                <th className="px-6 py-4 text-xs tracking-wider text-slate-400 font-bold uppercase">State</th>
                <th className="px-6 py-4 text-xs tracking-wider text-red-500 font-bold uppercase text-right">Intervene</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/20">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <span className="w-6 h-6 border-2 border-red-800/30 border-t-red-600 rounded-full animate-spin inline-block mx-auto mb-2" />
                    <p className="text-sm font-light">Scanning network...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 text-sm font-light">No entities found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-200">{user.name}</div>
                      {user.role === 'vendor' && user.storeInfo?.name && (
                        <div className="text-xs text-amber-500/80 mt-0.5">{user.storeInfo.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-red-900/50 text-red-400 border border-red-500/30' :
                        user.role === 'vendor' ? 'bg-amber-900/30 text-amber-500 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-900/20 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" /> Linked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-900/20 px-2.5 py-1 rounded-md border border-red-500/30 shadow-[0_0_8px_rgba(220,38,38,0.2)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,1)]" /> Exiled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border cursor-pointer shadow-sm ${
                            user.isActive 
                              ? 'bg-red-900/20 text-red-500 border-red-500/30 hover:bg-red-900/40 hover:shadow-[0_0_10px_rgba(220,38,38,0.4)]' 
                              : 'bg-emerald-900/20 text-emerald-500 border-emerald-500/30 hover:bg-emerald-900/40 hover:shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                          }`}
                        >
                          {user.isActive ? <FiUserX /> : <FiUserCheck />}
                          {user.isActive ? 'Exile' : 'Restore'}
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
