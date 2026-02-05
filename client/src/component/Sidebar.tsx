import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate= useNavigate()
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-boared-50 text-boared-600'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  const menuItems = [
    { to: '/dashboard', icon: '📊', label: 'Overview' },
    { to: '/deposit', icon: '💰', label: 'Deposit' },
    { to: '/withdraw', icon: '💸', label: 'Withdraw' },
    { to: '/transfer', icon: '🔄', label: 'Transfer' },
    { to: '/transactions', icon: '📝', label: 'Activities' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
    { to: '/help', icon: '❓', label: 'Help' }
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="fixed right-4 top-4 z-50 flex flex-col gap-1.5 rounded-lg bg-white p-3 shadow-lg lg:hidden"
        aria-label="Toggle sidebar"
      >
        <span
          className={`h-0.5 w-6 bg-slate-700 transition-transform ${
            isOpen ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-700 transition-opacity ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-700 transition-transform ${
            isOpen ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-slate-200 p-6">
            <img src="/logo.png" alt="Bank Logo" className="h-10 w-auto" />
          </div>

          {/* User Info */}
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bonavy-700 text-sm font-semibold text-white">
                  {user?.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Sign Out */}
          <div className="border-t border-slate-200 p-4">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate('/')
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
            >
              <span className="text-lg">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
