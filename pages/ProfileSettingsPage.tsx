import React, { useEffect, useState } from 'react';
import { SettingsSidebar } from '../components/SettingsSidebar';
import { getUserProfile, saveUserProfile, UserProfile, DEFAULT_PROFILE } from '../utils/storage';

export const ProfileSettingsPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const data = getUserProfile();
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
    }, []);

    const handleSave = () => {
        const updated = { ...profile, name, email };
        setProfile(updated);
        saveUserProfile(updated);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(profile.name);
        setEmail(profile.email);
        setIsEditing(false);
    };

    return (
        <div className="flex-1 flex overflow-hidden h-full bg-gray-50/50 dark:bg-background-dark animate-fade-in-up">
            <SettingsSidebar />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="relative group">
                            <div
                                className="h-24 w-24 rounded-2xl bg-center bg-cover border-4 border-white dark:border-gray-800 shadow-soft"
                                style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
                            ></div>
                            <button className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 text-primary dark:text-white hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                        </div>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between gap-3">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="text-3xl font-black tracking-tight text-[#131516] dark:text-white bg-transparent border-b-2 border-primary outline-none max-w-sm"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-black tracking-tight text-[#131516] dark:text-white">{profile.name}</h2>
                                )}

                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">Manage your public identity and account preferences.</p>

                            {isEditing && (
                                <div className="flex gap-2 mt-2">
                                    <button onClick={handleSave} className="bg-primary text-white text-xs px-3 py-1.5 rounded-md font-bold hover:bg-primary/90">Save Changes</button>
                                    <button onClick={handleCancel} className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md font-bold hover:bg-gray-300">Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Account Information</h3>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Email Address</h4>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 w-full max-w-xs"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                                    )}
                                </div>
                                <button className="text-sm font-bold text-primary hover:underline">Change Email</button>
                            </div>
                            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Password</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                                </div>
                                <button className="text-sm font-bold text-primary hover:underline">Reset Password</button>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Subscription</h3>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-soft">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 dark:bg-primary/20 text-primary p-3 rounded-xl">
                                        <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Pro Member</h4>
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Next billing date: Oct 12, 2024</p>
                                    </div>
                                </div>
                                <button className="w-full md:w-auto px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all shadow-glow">
                                    Manage Subscription
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ... Linked Accounts Section ... */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Linked Accounts</h3>
                        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                            {/* Static visualization for now */}
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-lg">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">Google</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Connected</p>
                                    </div>
                                </div>
                                <button className="text-sm font-bold text-red-500 hover:text-red-600">Disconnect</button>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-lg">
                                        <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">GitHub</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
                                    </div>
                                </div>
                                <button className="text-sm font-bold text-primary hover:underline">Connect</button>
                            </div>
                        </div>
                    </section>

                    <div className="bg-secondary/5 p-4 rounded-lg flex gap-3 items-start border border-secondary/10">
                        <span className="material-symbols-outlined text-secondary">tips_and_updates</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            Keeping your profile up to date helps Re-Flect personalize your experience. Your data is always encrypted and we never share your personal information.
                            <a className="text-primary font-bold hover:underline ml-1" href="#">View Trust Report.</a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
