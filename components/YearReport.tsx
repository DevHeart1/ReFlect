import React, { useState, useMemo, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/db';
import { Dialog } from './Dialog';
import { exportToJSON, exportToPDF } from '../utils/export';
import { analyzeMoods, MoodStats } from '../utils/analytics';
import { generateYearlySummary } from '../services/geminiService';

export const YearReport: React.FC = () => {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const checkins = useLiveQuery(() => db.moodCheckins.toArray()) || [];

  const stats = useMemo(() => analyzeMoods(checkins), [checkins]);

  const [summary, setSummary] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (stats && stats.total > 0) {
      setIsLoadingSummary(true);
      generateYearlySummary(stats).then((text) => {
        setSummary(text);
        setIsLoadingSummary(false);
      });
    } else {
      setSummary("Start logging your moods to see a yearly summary.");
    }
  }, [stats]);


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
              {isLoadingSummary ? (
                <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  <span>Generating your yearly review...</span>
                </div>
              ) : (
                <p className="text-xl font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                  "{summary}"
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Sentiment Distribution */}
        <section className="lg:col-span-4 bg-white dark:bg-card-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-soft flex flex-col items-center justify-between">
          <h3 className="text-lg font-bold mb-4 w-full text-gray-900 dark:text-white">Sentiment Distribution</h3>

          <div className="relative w-48 h-48 my-4">
            {stats.distribution.length > 0 ? (
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {(() => {
                  let cumulativePercent = 0;
                  return stats.distribution.sort((a, b) => b.count - a.count).map((item, i) => {
                    const percent = (stats.total > 0) ? (item.count / stats.total) : 0;
                    if (percent <= 0) return null;

                    const startAngle = 2 * Math.PI * cumulativePercent;
                    const endAngle = 2 * Math.PI * (cumulativePercent + percent);

                    // Coordinates on unit circle
                    const startX = Math.cos(startAngle);
                    const startY = Math.sin(startAngle);
                    const endX = Math.cos(endAngle);
                    const endY = Math.sin(endAngle);

                    cumulativePercent += percent;

                    // Handle single item case (100% circle)
                    if (stats.distribution.length === 1 || percent > 0.999) {
                      return <circle key={i} cx="50" cy="50" r="50" fill={
                        item.mood === 'Radiant' ? '#f59e0b' :
                          item.mood === 'Content' ? '#10b981' :
                            item.mood === 'Neutral' ? '#94a3b8' :
                              item.mood === 'Low' ? '#3b82f6' : '#e11d48'
                      } />;
                    }

                    const largeArcFlag = percent > 0.5 ? 1 : 0;

                    // Use toFixed to avoid scientific notation and NaN issues
                    const p = (n: number) => n.toFixed(5);

                    const pathData = `M 0 0 L ${p(startX)} ${p(startY)} A 1 1 0 ${largeArcFlag} 1 ${p(endX)} ${p(endY)} Z`;

                    return (
                      <path
                        key={i}
                        d={pathData}
                        fill={
                          item.mood === 'Radiant' ? '#f59e0b' :
                            item.mood === 'Content' ? '#10b981' :
                              item.mood === 'Neutral' ? '#94a3b8' :
                                item.mood === 'Low' ? '#3b82f6' : '#e11d48'
                        }
                        transform="translate(50, 50) scale(50)"
                        className="hover:opacity-90 transition-opacity"
                      />
                    );
                  });
                })()}
              </svg>
            ) : (
              <div className="w-full h-full rounded-full border-4 border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-300">
                No Data
              </div>
            )}

            {/* Center overlay for donut look (optional, but looks premium) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-24 h-24 bg-white dark:bg-card-dark rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.distribution.length > 0 ? Math.round((stats.distribution.sort((a, b) => b.count - a.count)[0].count / stats.total) * 100) + '%' : '0%'}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter max-w-[60px] truncate text-center">
                  {stats.distribution.length > 0 ? stats.distribution.sort((a, b) => b.count - a.count)[0].mood : 'Empty'}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-2">
            {stats.distribution.sort((a, b) => b.count - a.count).slice(0, 3).map((item) => (
              <div key={item.mood} className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.mood === 'Radiant' ? 'bg-amber-500' :
                    item.mood === 'Content' ? 'bg-emerald-500' :
                      item.mood === 'Neutral' ? 'bg-slate-400' :
                        item.mood === 'Low' ? 'bg-blue-500' : 'bg-rose-500'
                    }`}></div>
                  <span className="text-sm font-medium">{item.mood}</span>
                </div>
                <span className="text-sm font-bold">{Math.round((item.count / stats.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Mood Heatmap */}
        <section className="lg:col-span-12 bg-white dark:bg-card-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mood Heatmap</h3>
              <p className="text-sm text-gray-500">Emotional frequency across the year</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-100 dark:bg-white/5 rounded-[1px]"></div>
                <div className="w-3 h-3 bg-primary/40 rounded-[1px]"></div>
                <div className="w-3 h-3 bg-primary rounded-[1px]"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[800px] grid grid-cols-12 gap-4">
              {Array.from({ length: 12 }).map((_, monthIndex) => {
                const date = new Date(new Date().getFullYear(), monthIndex, 1);
                const monthName = date.toLocaleString('default', { month: 'short' });
                const daysInMonth = new Date(new Date().getFullYear(), monthIndex + 1, 0).getDate();

                return (
                  <div key={monthName} className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">{monthName}</span>
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                        const currentDayStr = new Date(new Date().getFullYear(), monthIndex, dayIndex + 1).toDateString();
                        const entry = stats.heatmap.find(h => new Date(h.date).toDateString() === currentDayStr);
                        const intensity = entry ? entry.intensity : 0;

                        return (
                          <div
                            key={dayIndex}
                            className={`aspect-square rounded-[2px] transition-all hover:scale-125 hover:z-10 relative cursor-pointer ${intensity === 0 ? 'bg-gray-100 dark:bg-white/5' :
                              intensity <= 2 ? 'bg-rose-400' :
                                intensity === 3 ? 'bg-gray-300 dark:bg-gray-600' : // Neutral
                                  intensity === 4 ? 'bg-emerald-400' :
                                    'bg-amber-400' // Radiant (5)
                              }`}
                            title={`${monthName} ${dayIndex + 1}: ${intensity > 0 ? intensity : 'No entry'}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => setShowExportDialog(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined">download</span>
            Export Annual Report
          </button>
          <button className="flex items-center justify-center gap-2 bg-white dark:bg-card-dark border border-[#CCAB48] text-[#CCAB48] hover:bg-[#CCAB48] hover:text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-glow">
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
