import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobileMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navItems = [
    { path: '/', label: 'Journal', icon: 'book', exact: true },
    { path: '/insights', label: 'Insights', icon: 'bar_chart' },
    { path: '/year-report', label: 'Year Report', icon: 'auto_awesome' },
    { path: '/mood-tracker', label: 'Mood Tracker', icon: 'sentiment_satisfied' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-72 bg-card-light dark:bg-card-dark border-r border-gray-100 dark:border-gray-800 p-6 shadow-soft transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-lg text-primary dark:text-white">
            <span className="material-symbols-outlined text-3xl">spa</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-primary dark:text-white">Re-Flect</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mindfulness AI</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium w-full text-left
                ${isActive
                  ? 'bg-[#f1f5f9] text-[#2a5e6f] dark:bg-[#2a5e6f] dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-800 relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-xl transition-colors text-left"
          >
            <div
              className="h-10 w-10 rounded-full bg-center bg-cover border-2 border-white dark:border-gray-700 shadow-sm"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTl5DKtYfek9G5GdtwQpurwPvAdBPXO6LSY36hAsHY0m7xTNZrUd0e620Hkl8NSFQBlbQXFQRlP3Of2DmydzlnuUxsfsZerVHfrl5IreHcp5HRi89WnvgEG2LZ-e9AZFoBllf4b8LX5RASB6P-yvuPhNU6Tfkv7UDgjmQMz2Oeom77Rg30sbW8AOUXh6IbJ5WtkcahJRsPGvRNCIAGZOkqntuIIKwKyNC-mTJA-PEumaay9IYs7LbRhAowE5u6hBZ8XuTDiyKWYnVg')" }}
            />
            <div className="flex flex-col flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Alex Morgan</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pro Member</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">more_vert</span>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animation-fade-in-up z-50">
              <div className="p-1">
                <NavLink
                  to="/settings/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg w-full"
                  onClick={() => { setIsMenuOpen(false); closeMobileMenu(); }}
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  Profile Settings
                </NavLink>
                <button
                  onClick={() => {
                    import('../utils/storage').then(({ clearUserSession }) => clearUserSession());
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg w-full text-left"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};