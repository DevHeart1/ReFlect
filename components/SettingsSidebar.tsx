import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const SettingsSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-64 border-r border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-card-dark/50 hidden md:block overflow-y-auto shrink-0">
            <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
                <nav className="space-y-1">
                    <button
                        onClick={() => navigate('/settings/general')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive('/settings/general')
                                ? 'font-semibold bg-primary/10 text-primary border-l-4 border-primary'
                                : 'font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
                        General
                    </button>

                    <button
                        onClick={() => navigate('/settings/profile')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive('/settings/profile')
                                ? 'font-semibold bg-primary/10 text-primary border-l-4 border-primary'
                                : 'font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">badge</span>
                        Profile
                    </button>

                    <button
                        onClick={() => navigate('/settings')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive('/settings')
                                ? 'font-semibold bg-primary/10 text-primary border-l-4 border-primary'
                                : 'font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">security</span>
                        Privacy & Security
                    </button>

                    <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left"
                    >
                        <span className="material-symbols-outlined text-[20px]">database</span>
                        Data Management
                    </button>

                    <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left"
                    >
                        <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                        Notifications
                    </button>
                </nav>
            </div>
        </div>
    );
};
