import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, closeMobileMenu }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Journal', icon: 'book' },
    { id: ViewState.INSIGHTS, label: 'Insights', icon: 'bar_chart' },
    { id: ViewState.YEAR_REPORT, label: 'Year Report', icon: 'auto_awesome' },
    { id: ViewState.JOURNAL, label: 'Mood Tracker', icon: 'sentiment_satisfied' }, 
    { id: ViewState.SETTINGS, label: 'Settings', icon: 'settings' },
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
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  closeMobileMenu();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium w-full text-left
                  ${isActive 
                    ? 'bg-[#f1f5f9] text-[#2a5e6f] dark:bg-[#2a5e6f] dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div 
            className="h-10 w-10 rounded-full bg-center bg-cover border-2 border-white dark:border-gray-700 shadow-sm" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTl5DKtYfek9G5GdtwQpurwPvAdBPXO6LSY36hAsHY0m7xTNZrUd0e620Hkl8NSFQBlbQXFQRlP3Of2DmydzlnuUxsfsZerVHfrl5IreHcp5HRi89WnvgEG2LZ-e9AZFoBllf4b8LX5RASB6P-yvuPhNU6Tfkv7UDgjmQMz2Oeom77Rg30sbW8AOUXh6IbJ5WtkcahJRsPGvRNCIAGZOkqntuIIKwKyNC-mTJA-PEumaay9IYs7LbRhAowE5u6hBZ8XuTDiyKWYnVg')" }}
          />
          <div className="flex flex-col">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Alex Morgan</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pro Member</p>
          </div>
          <span className="material-symbols-outlined ml-auto text-gray-400">more_vert</span>
        </div>
      </aside>
    </>
  );
};
