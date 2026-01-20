import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { exportToJSON, exportToPDF } from '../utils/export';

export const YearReport: React.FC = () => {
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8 animate-fade-in-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#CCAB48]/20 pb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#CCAB48] font-bold text-sm tracking-[0.2em] uppercase">
            <span className="material-symbols-outlined text-sm">event</span>
            <span>Annual Insight 2023</span>
          </div>
          <h2 className="text-5xl font-black tracking-tight text-[#131516] dark:text-white leading-tight">Your Year in Reflection</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">A celebratory look at your emotional journey, personal growth, and consistency over the past twelve months.</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white dark:bg-card-dark p-4 rounded-2xl shadow-glow border border-[#CCAB48]/30 min-w-[140px]">
          <div className="relative">
            <span className="material-symbols-outlined text-5xl text-[#CCAB48]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white mt-1">365</span>
            </div>
          </div>
          <p className="text-xs font-bold text-[#CCAB48] mt-2 uppercase tracking-widest">Streak</p>
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
                "This year, you focused heavily on <span className="text-primary dark:text-blue-300">gratitude and resilience</span>. Your journey reflects a significant shift from reactive stress management to proactive mindfulness."
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Through 312 entries, our AI identified that your most transformative period occurred in May, where you prioritized deep work and meditation. You've successfully cultivated a vocabulary for nuanced emotions, moving beyond simple 'happy' or 'sad' to describe complex states like 'melancholic peace' and 'vibrant focus'.
              </p>
            </div>
          </div>
        </section>

        {/* Sentiment Distribution */}
        <section className="lg:col-span-4 bg-white dark:bg-card-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-soft flex flex-col items-center">
          <h3 className="text-lg font-bold mb-8 w-full text-gray-900 dark:text-white">Sentiment Distribution</h3>
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="stroke-[#CCAB48]" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="150.7 100.5" strokeWidth="12" transform="rotate(-90 50 50)"></circle>
              <circle className="stroke-primary" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="50.2 201" strokeDashoffset="-150.7" strokeWidth="12" transform="rotate(-90 50 50)"></circle>
              <circle className="stroke-[#94a3b8]" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="25.1 226.1" strokeDashoffset="-200.9" strokeWidth="12" transform="rotate(-90 50 50)"></circle>
              <circle className="stroke-[#e2e8f0]" cx="50" cy="50" fill="transparent" r="40" strokeDasharray="25.1 226.1" strokeDashoffset="-226.1" strokeWidth="12" transform="rotate(-90 50 50)"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-900 dark:text-white">60%</span>
              <span className="text-xs font-bold text-[#CCAB48] uppercase tracking-tighter">Joy</span>
            </div>
          </div>
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#CCAB48]"></div>
                <span className="text-sm font-medium">Joy</span>
              </div>
              <span className="text-sm font-bold">60%</span>
            </div>
            <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm font-medium">Calm</span>
              </div>
              <span className="text-sm font-bold">20%</span>
            </div>
            <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <span className="text-sm font-medium">Sadness</span>
              </div>
              <span className="text-sm font-bold">10%</span>
            </div>
          </div>
        </section>

        {/* Mood Heatmap */}
        <section className="lg:col-span-12 bg-white dark:bg-card-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mood Heatmap</h3>
              <p className="text-sm text-gray-500">Emotional frequency across all 12 months</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <span>Less Intense</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-primary/5 rounded"></div>
                <div className="w-3 h-3 bg-primary/20 rounded"></div>
                <div className="w-3 h-3 bg-primary/40 rounded"></div>
                <div className="w-3 h-3 bg-primary/60 rounded"></div>
                <div className="w-3 h-3 bg-primary/80 rounded"></div>
                <div className="w-3 h-3 bg-primary rounded"></div>
              </div>
              <span>More Intense</span>
            </div>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[800px] grid grid-cols-12 gap-6">
              {/* Jan */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">Jan</span>
                <div className="grid grid-cols-4 gap-1">
                  <div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/60"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/80"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/60"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/80"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/60"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/60"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/80"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/60"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/80"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div>
                </div>
              </div>
              {/* Feb */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">Feb</span>
                <div className="grid grid-cols-4 gap-1">
                  <div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/60"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/80"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/60"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/60"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/60"></div>
                  <div className="aspect-square rounded-[2px] bg-primary/40"></div><div className="aspect-square rounded-[2px] bg-primary/10"></div><div className="aspect-square rounded-[2px] bg-primary/20"></div><div className="aspect-square rounded-[2px] bg-primary/60"></div>
                </div>
              </div>
              {/* May (Highlight) */}
              <div className="flex flex-col gap-2 col-span-1">
                <span className="text-[10px] font-bold uppercase text-[#CCAB48] mb-1">May</span>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-[2px] ${i % 2 === 0 ? 'bg-primary' : 'bg-primary/80'}`}></div>
                  ))}
                </div>
              </div>
              {/* Placeholder */}
              <div className="flex flex-col gap-2 col-span-9 opacity-40 italic text-xs items-center justify-center border border-dashed border-gray-200 rounded-lg text-gray-400">
                <span>June - December data visualised similarly</span>
              </div>
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
    </div>
  );
};
