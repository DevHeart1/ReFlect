import React, { useState } from 'react';


export const PrivacySettings: React.FC = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoLockTimer, setAutoLockTimer] = useState('15 Minutes');
  const [aiPersonalization, setAiPersonalization] = useState(true);
  const [anonymousData, setAnonymousData] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 animate-fade-in-up">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-[#131516] dark:text-white">Privacy & Security</h2>
          <p className="text-gray-500 dark:text-gray-400">Control your data, encryption preferences, and how our AI interacts with your personal thoughts.</p>
        </div>

        {/* Encryption Status */}
        <section className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-full">
                <span className="material-symbols-outlined">encrypted</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Data Encryption</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your data is secured using industry-standard AES-256 encryption.</p>
              </div>
            </div>
            <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 flex items-center gap-1 whitespace-nowrap">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span className="hidden sm:inline">End-to-End Encrypted</span>
            </span>
          </div>
        </section>

        {/* Device Security */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Device Security</h3>
          <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <h4 className="font-bold text-gray-900 dark:text-white">Biometric Lock</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Require Touch ID or Windows Hello to open the desktop application.</p>
              </div>
              <div className="flex-shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={biometricEnabled}
                    onChange={() => setBiometricEnabled(!biometricEnabled)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <h4 className="font-bold text-gray-900 dark:text-white">Auto-Lock Timer</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Automatically lock the app after a period of inactivity.</p>
              </div>
              <select
                value={autoLockTimer}
                onChange={(e) => setAutoLockTimer(e.target.value)}
                className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:ring-primary focus:border-primary py-2 px-3"
              >
                <option>5 Minutes</option>
                <option>15 Minutes</option>
                <option>1 Hour</option>
                <option>Never</option>
              </select>
            </div>
          </div>
        </section>

        {/* AI Privacy */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">AI & Insights Privacy</h3>
          <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            <div className="p-6 flex items-start justify-between">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">AI Personalization</h4>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">RECOMMENDED</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Allow the AI to analyze your journal entries to provide personalized emotional insights and mood patterns.</p>
              </div>
              <div className="flex-shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={aiPersonalization}
                    onChange={() => setAiPersonalization(!aiPersonalization)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            <div className="p-6 flex items-start justify-between">
              <div className="space-y-1 pr-4">
                <h4 className="font-bold text-gray-900 dark:text-white">Anonymous Data Contribution</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Contribute completely anonymized sentiment data to improve our global mindfulness models. Your personal text never leaves your device.</p>
              </div>
              <div className="flex-shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={anonymousData}
                    onChange={() => setAnonymousData(!anonymousData)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Your Data */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Your Data</h3>
          <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 dark:text-white">Download Journal Entries</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Export all your thoughts and data in PDF or JSON format for your own records.</p>
              </div>
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors whitespace-nowrap shadow-sm">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Export Data
              </button>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="bg-blue-50/50 dark:bg-primary/5 p-4 rounded-lg flex gap-3 items-start border border-primary/10">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">info</span>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            At Re-Flect, we believe your privacy is a fundamental human right. We never sell your data to third parties, and all AI processing is designed with privacy-first principles.
            <a className="text-primary font-bold hover:underline ml-1" href="#">Learn more in our Privacy Policy.</a>
          </p>
        </div>

      </div>
    </div>
  );
};
