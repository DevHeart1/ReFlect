import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { exportToJSON, exportToPDF } from '../utils/export';
import { analyzeMoods, MoodStats } from '../utils/analytics';

export const YearReport: React.FC = () => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [stats, setStats] = useState<MoodStats | null>(null);

  useEffect(() => {
    setStats(analyzeMoods());
  }, []);

  if (!stats) return null;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8 animate-fade-in-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#CCAB48]/20 pb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#CCAB48] font-bold text-sm tracking-[0.2em] uppercase">
            <span className="material-symbols-outlined text-sm">event</span>
            <span>Annual Insight {new Date().getFullYear()}</span>
          </div>
          <h2 className="text-5xl font-black tracking-tight text-[#131516] dark:text-white leading-tight">Your Year in Reflection</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">A celebratory look at your emotional journey, personal growth, and consistency over the past twelve months.</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white dark:bg-card-dark p-4 rounded-2xl shadow-glow border border-[#CCAB48]/30 min-w-[140px]">
          <div className="relative">
            <span className="material-symbols-outlined text-5xl text-[#CCAB48]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white mt-1">{stats.streak}</span>
            </div>
          </div>
          <p className="text-xs font-bold text-[#CCAB48] mt-2 uppercase tracking-widest">Current Streak</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* AI Synthesis */}
        <section className="lg:col-span-8 bg-white dark:bg-card-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-9xl">psychology</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Growth Synthesis</h3>
            </div>
            <div className="space-y-4">
              <p className="text-xl font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                "You have logged <span className="text-primary dark:text-blue-300">{stats.total} entries</span> this year.
                {stats.topMoods.length > 0 && <> Your most frequent mood was <span className="font-bold">{stats.topMoods[0].mood}</span>.</>}
                Keep documenting your journey to unlock deeper insights."
              </p>
            </div>
          </div>
        </section>

        {/* Sentiment Distribution */}
        <section className="lg:col-span-4 bg-white dark:bg-card-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-soft flex flex-col items-center">
          <h3 className="text-lg font-bold mb-8 w-full text-gray-900 dark:text-white">Sentiment Distribution</h3>

          {/* Simple Bar Chart for Distribution */}
          <div className="w-full space-y-4">
            {stats.distribution.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">No mood data available yet.</p>
            ) : (
              stats.distribution.sort((a, b) => b.count - a.count).slice(0, 5).map((item) => (
                <div key={item.mood} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase text-gray-500">
                    <span>{item.mood}</span>
                    <span>{Math.round((item.count / stats.total) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(item.count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Mood Heatmap (Simplified to Recent History) */}
        <section className="lg:col-span-12 bg-white dark:bg-card-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Mood History</h3>
              <p className="text-sm text-gray-500">Your latest check-ins</p>
            </div>
          </div>

          {stats.heatmap.length === 0 ? (
            <p className="text-gray-500 italic">Start tracking your mood to see your history here.</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {stats.heatmap.slice(0, 365).map((entry, i) => (
                <div
                  key={i}
                  title={`${new Date(entry.date).toLocaleDateString()} - Intensity: ${entry.intensity}`}
                  className={`w-3 h-3 rounded-[1px] ${entry.intensity >= 4 ? 'bg-green-500' :
                      entry.intensity === 3 ? 'bg-gray-300' :
                        'bg-red-400'
                    }`}
                ></div>
              ))}
            </div>
          )}
        </section>

        {/* Word Cloud */}
        <section className="lg:col-span-12 bg-white dark:bg-card-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
          <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white">Top Recurring Themes</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 py-4">
            <span className="text-5xl font-extrabold text-primary">Gratitude</span>
            <span className="text-3xl font-bold text-[#CCAB48] opacity-80">Resilience</span>
            <span className="text-2xl font-medium text-gray-400">Walking</span>
            <span className="text-4xl font-bold text-primary/70">Mindfulness</span>
            <span className="text-lg font-bold text-gray-500">Sleep</span>
            <span className="text-3xl font-bold text-[#CCAB48]">Focus</span>
            <span className="text-4xl font-black text-primary/90">Reflection</span>
            <span className="text-xl font-medium text-gray-400">Journaling</span>
            <span className="text-2xl font-bold text-[#CCAB48] opacity-60">Success</span>
            <span className="text-3xl font-extrabold text-primary/60">Growth</span>
          </div>
        </section>
      </div>

      <div className="flex flex-col items-center justify-center pt-8 pb-12 gap-6">
        <p className="text-gray-500 font-medium">Ready to start your journey for 2024?</p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowExportDialog(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined">download</span>
            Export Annual Report
          </button>
          <button className="flex items-center gap-2 bg-white dark:bg-card-dark border border-[#CCAB48] text-[#CCAB48] hover:bg-[#CCAB48] hover:text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-glow">
            <span className="material-symbols-outlined">share</span>
            Share Reflection
          </button>
        </div>
      </div>

      <Dialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        title="Select Export Format"
        footer={
          <button
            onClick={() => setShowExportDialog(false)}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 rounded-lg"
          >
            Cancel
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              exportToJSON();
              setShowExportDialog(false);
            }}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">data_object</span>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">JSON</div>
              <div className="text-xs text-gray-500">Machine readable backup</div>
            </div>
          </button>

          <button
            onClick={() => {
              exportToPDF();
              setShowExportDialog(false);
            }}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">picture_as_pdf</span>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">PDF</div>
              <div className="text-xs text-gray-500">Document format</div>
            </div>
          </button>
        </div>
      </Dialog>
    </div >
  );
};
