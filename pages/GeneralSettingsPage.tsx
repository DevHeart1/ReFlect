import React, { useState, useEffect } from 'react';
import { SettingsSidebar } from '../components/SettingsSidebar';
import { getAppSettings, saveAppSettings, DEFAULT_SETTINGS, AppSettings } from '../utils/storage';

export const GeneralSettingsPage: React.FC = () => {
    // Initialize state from storage
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

    // Initial load
    useEffect(() => {
        setSettings(getAppSettings());
    }, []);

    // Apply theme side-effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        let effectiveTheme = settings.theme;
        if (effectiveTheme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            effectiveTheme = systemDark ? 'dark' : 'light';
        }

        root.classList.add(effectiveTheme);
    }, [settings.theme]);

    // Helper to update settings
    const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        saveAppSettings(newSettings);
    };

    const { theme, language, timeZone, fontSize, highContrast, screenReader } = settings;

    return (
        <div className="flex-1 flex overflow-hidden h-full bg-gray-50/50 dark:bg-background-dark animate-fade-in-up">
            <SettingsSidebar />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-[#131516] dark:text-white">General Settings</h2>
                        <p className="text-gray-500 dark:text-gray-400">Manage your app appearance, language preferences, and accessibility options.</p>
                    </div>

                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Appearance</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button
                                onClick={() => updateSetting('theme', 'light')}
                                className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all group ${theme === 'light'
                                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-800 bg-card-light dark:bg-card-dark hover:border-primary/50'
                                    }`}
                            >
                                <div className="aspect-video rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-400 text-3xl">light_mode</span>
                                </div>
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Light</p>
                                        <p className="text-xs text-gray-500">Classic clean look</p>
                                    </div>
                                    {theme === 'light' && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                                </div>
                            </button>

                            <button
                                onClick={() => updateSetting('theme', 'dark')}
                                className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all group ${theme === 'dark'
                                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-800 bg-card-light dark:bg-card-dark hover:border-primary/50'
                                    }`}
                            >
                                <div className="aspect-video rounded-md bg-background-dark border border-gray-700 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-500 text-3xl">dark_mode</span>
                                </div>
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Dark</p>
                                        <p className="text-xs text-gray-500">Easy on the eyes</p>
                                    </div>
                                    {theme === 'dark' && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                                </div>
                            </button>

                            <button
                                onClick={() => updateSetting('theme', 'system')}
                                className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all group ${theme === 'system'
                                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-800 bg-card-light dark:bg-card-dark hover:border-primary/50'
                                    }`}
                            >
                                <div className="aspect-video rounded-md bg-gradient-to-br from-gray-100 to-background-dark border border-gray-200 flex items-center justify-center overflow-hidden">
                                    <span className="material-symbols-outlined text-primary text-3xl">settings_brightness</span>
                                </div>
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">System</p>
                                        <p className="text-xs text-gray-500">Matches device</p>
                                    </div>
                                    {theme === 'system' && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                                </div>
                            </button>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Language & Region</h3>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                            <div className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Display Language</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose the language used for the interface.</p>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => updateSetting('language', e.target.value)}
                                    className="min-w-[160px] bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-primary focus:border-primary px-3 py-2 outline-none"
                                >
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                    <option>Japanese</option>
                                </select>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Time Zone</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Set your local time for journal entry timestamps.</p>
                                </div>
                                <select
                                    value={timeZone}
                                    onChange={(e) => updateSetting('timeZone', e.target.value)}
                                    className="min-w-[160px] bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-primary focus:border-primary px-3 py-2 outline-none"
                                >
                                    <option>(UTC-08:00) Pacific</option>
                                    <option>(UTC-05:00) Eastern</option>
                                    <option>(UTC+00:00) UTC</option>
                                    <option>(UTC+01:00) Central European</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Accessibility</h3>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                            <div className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Font Size</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Adjust the text size for better readability.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-400">A</span>
                                    <input
                                        className="w-32 accent-primary cursor-pointer"
                                        max="3"
                                        min="1"
                                        step="1"
                                        type="range"
                                        value={fontSize}
                                        onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                                    />
                                    <span className="text-lg text-gray-900 dark:text-white">A</span>
                                </div>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">High Contrast Mode</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enhance contrast for improved visual clarity.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            className="sr-only peer"
                                            type="checkbox"
                                            checked={highContrast}
                                            onChange={() => updateSetting('highContrast', !highContrast)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none ring-0 peer-checked:bg-primary transition-colors"></div>
                                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform ${highContrast ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </label>
                                </div>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Screen Reader Optimization</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Optimizes UI components for assistive technologies.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            className="sr-only peer"
                                            type="checkbox"
                                            checked={screenReader}
                                            onChange={() => updateSetting('screenReader', !screenReader)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none ring-0 peer-checked:bg-primary transition-colors"></div>
                                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform ${screenReader ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4 pb-10">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Application Updates</h3>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-3 rounded-xl">
                                        <span className="material-symbols-outlined text-2xl">system_update</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">Software Version</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">You are currently running version <span className="font-mono bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">v2.4.12-stable</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
                                        Check for updates
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Re-Flect is up to date. Last checked today at 10:45 AM.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
