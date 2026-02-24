import { NavLink } from 'react-router-dom';
import { 
  SquaresFour, 
  Package, 
  PlusCircle, 
  CurrencyDollar, 
  Gear,
  Users
} from '@phosphor-icons/react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const vendorLinks = [
    { name: 'Overview', path: '/vendor/dashboard', icon: <SquaresFour size={24} /> },
    { name: 'My Products', path: '/vendor/products', icon: <Package size={24} /> },
    { name: 'Add Product', path: '/vendor/add-product', icon: <PlusCircle size={24} /> },
    { name: 'Sales History', path: '/vendor/sales', icon: <CurrencyDollar size={24} /> },
    { name: 'Account Settings', path: '/vendor/settings', icon: <Gear size={24} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <SquaresFour size={24} /> },
    { name: 'Manage Users', path: '/admin/users', icon: <Users size={24} /> },
    { name: 'All Orders', path: '/admin/orders', icon: <CurrencyDollar size={24} /> },
    { name: 'Directory', path: '/admin/products', icon: <Package size={24} /> },
    { name: 'Account Settings', path: '/vendor/settings', icon: <Gear size={24} /> },
  ];

  const links = userInfo?.role === 'admin' ? adminLinks : vendorLinks;
  const title = userInfo?.role === 'admin' ? 'Admin Tools' : 'Vendor Tools';

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] hidden md:block shrink-0">
      <div className="py-6 px-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">
          {title}
        </h2>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/vendor/dashboard' || link.path === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
