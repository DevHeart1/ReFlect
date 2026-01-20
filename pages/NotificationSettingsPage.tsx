import React, { useState } from 'react';


export const NotificationSettingsPage: React.FC = () => {
    const [dailyReminders, setDailyReminders] = useState(true);
    const [reminderTime, setReminderTime] = useState('20:00');
    const [aiAlerts, setAiAlerts] = useState(true);
    const [emailSummaries, setEmailSummaries] = useState(false);
    const [systemNotifications, setSystemNotifications] = useState(true);

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 animate-fade-in-up">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-[#131516] dark:text-white">Notification Preferences</h2>
                    <p className="text-gray-500 dark:text-gray-400">Choose how and when you want to be reminded to practice mindfulness and receive AI-driven insights.</p>
                </div>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Reminders</h3>
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-soft">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 pr-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Daily Journaling Reminders</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Get a gentle nudge to document your thoughts and reflect on your day.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            checked={dailyReminders}
                                            onChange={() => setDailyReminders(!dailyReminders)}
                                            className="sr-only peer"
                                            type="checkbox"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none ring-0 peer-checked:bg-primary transition-colors"></div>
                                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform ${dailyReminders ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Remind me at:</span>
                                <input
                                    className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-primary focus:border-primary px-3 py-1.5"
                                    type="time"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    disabled={!dailyReminders}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">AI & Insights</h3>
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-soft">
                        <div className="p-6 flex items-start justify-between">
                            <div className="space-y-1 pr-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-900 dark:text-white">AI Insight Alerts</h4>
                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">POPULAR</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Receive notifications when our AI detects new emotional patterns or significant mood shifts in your entries.</p>
                            </div>
                            <div className="flex-shrink-0">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        checked={aiAlerts}
                                        onChange={() => setAiAlerts(!aiAlerts)}
                                        className="sr-only peer"
                                        type="checkbox"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none ring-0 peer-checked:bg-primary transition-colors"></div>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform ${aiAlerts ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 flex items-start justify-between">
                            <div className="space-y-1 pr-4">
                                <h4 className="font-bold text-gray-900 dark:text-white">Email Summaries</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Receive a weekly digest of your mood reports and mindfulness progress directly in your inbox.</p>
                            </div>
                            <div className="flex-shrink-0">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        checked={emailSummaries}
                                        onChange={() => setEmailSummaries(!emailSummaries)}
                                        className="sr-only peer"
                                        type="checkbox"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none ring-0 peer-checked:bg-primary transition-colors"></div>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform ${emailSummaries ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Platform</h3>
                    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-soft">
                        <div className="p-6 flex items-start justify-between">
                            <div className="space-y-1 pr-4">
                                <h4 className="font-bold text-gray-900 dark:text-white">System Notifications</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Important alerts about app updates, security patches, and new features.</p>
                            </div>
                            <div className="flex-shrink-0">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        checked={systemNotifications}
                                        onChange={() => setSystemNotifications(!systemNotifications)}
                                        className="sr-only peer"
                                        type="checkbox"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none ring-0 peer-checked:bg-primary transition-colors"></div>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform ${systemNotifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="bg-blue-50/50 dark:bg-primary/5 p-4 rounded-lg flex gap-3 items-start border border-primary/10">
                    <span className="material-symbols-outlined text-primary">notifications_active</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        To receive desktop notifications, ensure that your browser or operating system settings allow Re-Flect to send alerts.
                        <a className="text-primary font-bold hover:underline ml-1" href="#">Troubleshoot notifications.</a>
                    </p>
                </div>

            </div>
        </div>
    );
};
