import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DEFAULT_PROFILE, getUserProfile } from '../utils/storage';
import { authService } from '../services/authService';

interface SidebarProps {
  isOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobileMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(() => {
    // Initialize from local storage if available for instant render
    const local = getUserProfile();
    return (local && local.email !== 'guest@example.com') ? local : DEFAULT_PROFILE;
  });

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Try local storage first
      try {
        const { getUserProfile } = await import('../utils/storage');
        const localProfile = getUserProfile();
        if (localProfile && localProfile.email !== 'guest@example.com') {
          setProfile(localProfile);
        }
      } catch (e) { /* ignore */ }

      // 2. Then fresh fetch
      const user = await authService.getCurrentUser();
      if (user) {
        setProfile({
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          isPro: user.isPro
        });
      }
    };
    fetchProfile();

    // Listen for auth changes
    const handleAuthChange = () => {
      fetchProfile();
    };
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('profile-updated', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('profile-updated', handleAuthChange);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Journal', icon: 'book', exact: true },
    { path: '/insights', label: 'Insights', icon: 'bar_chart' },
    { path: '/judy', label: 'Judy', icon: 'psychology_alt' },
    { path: '/year-report', label: 'Year Report', icon: 'auto_awesome' },
    { path: '/mood-tracker', label: 'Mood Tracker', icon: 'sentiment_satisfied' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 bg-card-light dark:bg-card-dark border-r border-gray-100 dark:border-gray-800 shadow-soft transition-all duration-300 ease-in-out lg:static lg:flex lg:flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    ${isCollapsed ? 'lg:w-20' : 'lg:w-72 w-72'}
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
        {/* Toggle Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-9 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm z-50"
        >
          <span className="material-symbols-outlined text-sm">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>

        <div className={`flex flex-col h-full ${isCollapsed ? 'px-3 py-6' : 'p-6'}`}>
          {/* Logo */}
          {/* Logo */}
          <NavLink to="/" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-10 transition-all hover:opacity-80`}>
            <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-lg text-primary dark:text-white shrink-0">
              <span className="material-symbols-outlined text-3xl">spa</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap animate-fade-in">
                <h1 className="text-xl font-bold tracking-tight text-primary dark:text-white">Re-Flect</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mindfulness AI</p>
              </div>
            )}
          </NavLink>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-xl transition-all font-medium relative group
                    ${isActive
                    ? 'bg-[#f1f5f9] text-[#2a5e6f] dark:bg-[#2a5e6f] dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`
                }
                title={isCollapsed ? item.label : ''}
              >
                <span className="material-symbols-outlined shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className={`mt-2 pt-4 border-t border-gray-100 dark:border-gray-800 relative`}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-xl transition-colors text-left`}
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=random';
                }}
              />
              {!isCollapsed && (
                <>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{profile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile.isPro ? 'Pro Member' : 'Free Plan'}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 shrink-0">more_vert</span>
                </>
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className={`absolute bottom-full ${isCollapsed ? 'left-full ml-4 w-56' : 'left-0 w-full'} mb-2 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up z-50`}>
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
                    onClick={async () => {
                      try {
                        await authService.logout();
                      } catch (err) {
                        console.error('Logout failed:', err);
                        // Force redirect anyway
                        localStorage.clear();
                        window.location.href = '/';
                      }
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
        </div>
      </aside>
    </>
  );
};