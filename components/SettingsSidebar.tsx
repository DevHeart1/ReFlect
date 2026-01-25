import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const SettingsSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-card-dark/50 overflow-x-auto md:overflow-y-auto shrink-0 md:h-full no-scrollbar">
            <div className="p-4 md:p-6 flex md:flex-col gap-2 md:gap-1 min-w-max md:min-w-0">
                <h2 className="hidden md:block text-lg font-bold text-gray-900 dark:text-white mb-6">Settings</h2>

                <button
                    onClick={() => navigate('/settings/general')}
                    className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${isActive('/settings/general')
                        ? 'font-semibold bg-primary/10 text-primary border-b-2 md:border-b-0 md:border-l-4 border-primary'
                        : 'font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
                    <span>General</span>
                </button>

                <button
                    onClick={() => navigate('/settings/profile')}
                    className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${isActive('/settings/profile')
                        ? 'font-semibold bg-primary/10 text-primary border-b-2 md:border-b-0 md:border-l-4 border-primary'
                        : 'font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                    <span>Profile</span>
                </button>

                <button
                    onClick={() => navigate('/settings/privacy')}
                    className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${isActive('/settings/privacy')
                        ? 'font-semibold bg-primary/10 text-primary border-b-2 md:border-b-0 md:border-l-4 border-primary'
                        : 'font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">security</span>
                    <span>Privacy & Security</span>
                </button>

                <button
                    onClick={() => navigate('/settings/data')}
                    className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${isActive('/settings/data')
                        ? 'font-semibold bg-primary/10 text-primary border-b-2 md:border-b-0 md:border-l-4 border-primary'
                        : 'font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">database</span>
                    <span>Data Management</span>
                </button>

                <button
                    onClick={() => navigate('/settings/notifications')}
                    className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${isActive('/settings/notifications')
                        ? 'font-semibold bg-primary/10 text-primary border-b-2 md:border-b-0 md:border-l-4 border-primary'
                        : 'font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                    <span>Notifications</span>
                </button>
            </div>
        </div>
    );
};
