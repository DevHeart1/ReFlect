import React from 'react';


export const DataManagementPage: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 animate-fade-in-up">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-[#131516] dark:text-white">Data Management</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage your local storage, backups, and data portability.</p>
                </div>

                <section className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-soft">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 dark:bg-primary/20 text-primary p-3 rounded-full">
                                    <span className="material-symbols-outlined">storage</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Storage Usage</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Journal entries and cached AI insights.</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">124.5 MB</span>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Used of 2 GB</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: '15%' }}></div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Backup & Restore</h3>
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                        <div className="p-6 flex items-center justify-between">
                            <div className="space-y-1 pr-4">
                                <h4 className="font-bold text-gray-900 dark:text-white">Auto-backup to Cloud</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Keep your data synced across devices with encrypted cloud backups.</p>
                            </div>
                            <div className="flex-shrink-0">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input defaultChecked className="sr-only peer" type="checkbox" />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none ring-0 peer-checked:bg-primary transition-colors"></div>
                                    <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-5"></div>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Manual Backup</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Last backed up: Today at 10:42 AM</p>
                            </div>
                            <button className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">backup</span>
                                Back up now
                            </button>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Portability</h3>
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Import Data</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Import your history from other journaling apps like Day One or Notion.</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                                Import Files
                            </button>
                        </div>
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Export Journal</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Download all your records in JSON, PDF, or Markdown format.</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                Export Data
                            </button>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-widest px-1">Danger Zone</h3>
                    <div className="bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Delete Account & Data</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">Permanently remove your account and all associated journal entries. This action cannot be undone.</p>
                            </div>
                            <button className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                                Delete Everything
                            </button>
                        </div>
                    </div>
                </section>

                <div className="bg-blue-50/50 dark:bg-primary/5 p-4 rounded-lg flex gap-3 items-start border border-primary/10">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Your data is yours. We use end-to-end encryption for all cloud backups, meaning only you have the keys to unlock your thoughts.
                        <a className="text-primary font-bold hover:underline ml-1" href="#">Security technical whitepaper</a>
                    </p>
                </div>

            </div>
        </div>
    );
};
