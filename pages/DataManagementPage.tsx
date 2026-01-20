import React, { useState, useRef } from 'react';
import { Dialog } from '../components/Dialog';
import {
    getAppSettings,
    getJournalEntries,
    getMoodCheckins,
    getUserProfile,
    clearUserSession,
    saveAppSettings,
    saveUserProfile
} from '../utils/storage';

export const DataManagementPage: React.FC = () => {
    // State for Delete Dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

    // File Input Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Export ---
    const handleExport = () => {
        const data = {
            profile: getUserProfile(),
            settings: getAppSettings(),
            journalEntries: getJournalEntries(),
            moodCheckins: getMoodCheckins(),
            exportDate: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reflect-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // --- Import ---
    const triggerImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);

                // Basic validation: check for expected keys
                if (!json.profile || !json.settings || !json.journalEntries) {
                    throw new Error("Invalid backup file format.");
                }

                // Restore Data
                localStorage.setItem('reflect_app_settings', JSON.stringify(json.settings));
                localStorage.setItem('reflect_user_profile', JSON.stringify(json.profile));
                localStorage.setItem('reflect_journal_entries', JSON.stringify(json.journalEntries));
                if (json.moodCheckins) {
                    localStorage.setItem('reflect_mood_checkins', JSON.stringify(json.moodCheckins));
                }

                // Success Feedback (Could use a Toast/Dialog, but reload is effective for state reset)
                setImportError(null);
                setIsImportDialogOpen(true);

            } catch (err) {
                console.error("Import failed:", err);
                setImportError("Failed to import data. The file might be corrupted or invalid.");
                setIsImportDialogOpen(true);
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    // --- Delete ---
    const handleDeleteEverything = () => {
        clearUserSession();
    };

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
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{(JSON.stringify(localStorage).length / 1024 / 1024).toFixed(2)} MB</span>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Used of 50 MB (Local Storage)</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                            {/* Rough percentage calc based on 5MB typical localstorage limit, though modern browsers usually support more, treating 10MB as baseline for visual */}
                            <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min((JSON.stringify(localStorage).length / (5 * 1024 * 1024)) * 100, 100)}%` }}></div>
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
                                    <input defaultChecked className="sr-only peer" type="checkbox" disabled />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none ring-0 peer-checked:bg-primary transition-colors opacity-60"></div>
                                    <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-5"></div>
                                </label>
                                <span className="text-[10px] text-gray-400 block mt-1 text-center font-medium">Coming Soon</span>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Manual Backup</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Download a complete backup of your journal.</p>
                            </div>
                            <button
                                onClick={handleExport}
                                className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
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
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Restore your history from a Re-Flect backup file (JSON).</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".json"
                                className="hidden"
                            />
                            <button
                                onClick={triggerImport}
                                className="flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                                Import Files
                            </button>
                        </div>
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">Export Journal</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Download all your records in JSON format.</p>
                            </div>
                            <button
                                onClick={handleExport}
                                className="flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                            >
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
                            <button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
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

            {/* Confirmation Dialogs */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title="Delete Everything?"
                type="error"
                footer={
                    <>
                        <button
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteEverything}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                            Yes, Delete All Data
                        </button>
                    </>
                }
            >
                <div className="space-y-3">
                    <p>Are you sure you want to completely wipe all your data? This includes:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>All journal entries and mood check-ins</li>
                        <li>User profile and settings</li>
                        <li>Custom templates and habits</li>
                    </ul>
                    <p className="font-bold text-red-600 dark:text-red-400 mt-2">This action cannot be undone.</p>
                </div>
            </Dialog>

            <Dialog
                isOpen={isImportDialogOpen}
                onClose={() => {
                    setIsImportDialogOpen(false);
                    if (!importError) window.location.reload();
                }}
                title={importError ? "Import Failed" : "Import Successful"}
                type={importError ? "error" : "success"}
                footer={
                    <button
                        onClick={() => {
                            setIsImportDialogOpen(false);
                            if (!importError) window.location.reload();
                        }}
                        className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg"
                    >
                        {importError ? "Close" : "Reload Application"}
                    </button>
                }
            >
                {importError ? (
                    <p>{importError}</p>
                ) : (
                    <p>Your data has been successfully restored. The application will now reload to apply changes.</p>
                )}
            </Dialog>

        </div>
    );
};
