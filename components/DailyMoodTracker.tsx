import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/db';
import { generateMoodInsights, generatePatternInsights } from '../services/geminiService';
import { MoodChart } from './MoodChart';

import { MoodCheckin } from '../utils/storage';

interface DailyMoodTrackerProps {
  moods: MoodCheckin[];
}

export const DailyMoodTracker: React.FC<DailyMoodTrackerProps> = ({ moods }) => {
  const [insight, setInsight] = useState("Analyzing your recent emotional patterns...");
  const [patternData, setPatternData] = useState<{ weeklyInsight: string; topFactorInsight: string } | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  const recentMoods = moods.slice(0, 50);

  useEffect(() => {
    if (recentMoods.length > 0) {
      setIsInsightLoading(true);

      // Generate general insight
      generateMoodInsights(recentMoods).then(text => {
        setInsight(text);
      });

      // Generate pattern stats
      generatePatternInsights(recentMoods).then(data => {
        setPatternData(data);
        setIsInsightLoading(false);
      }).catch(() => setIsInsightLoading(false));
    }
  }, [recentMoods.length]); // Only re-run if count changes to avoid thrashing

  // Helper for colors
  const getMoodRingColor = (moodLabel: string) => {
    if (moodLabel === 'Radiant') return 'bg-amber-400';
    if (moodLabel === 'Content') return 'bg-emerald-400';
    if (moodLabel === 'Neutral') return 'bg-gray-400';
    if (moodLabel === 'Low') return 'bg-blue-400';
    return 'bg-rose-400';
  };

  return (
    <div className="flex-1 overflow-y-auto w-full p-4 lg:p-10 animate-fade-in-up pb-24 lg:pb-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#131516] dark:text-white">Mood Tracker</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your emotional journey, automatically analyzed from your journal entries.
          </p>
        </header>

        {/* AI Insight banner - Responsive & Visible */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 md:p-6 rounded-2xl border border-primary/20 flex flex-col md:flex-row gap-4 items-start relative overflow-hidden">
          {isInsightLoading && (
            <div className="absolute top-2 right-2">
              <span className="material-symbols-outlined text-primary animate-spin">refresh</span>
            </div>
          )}
          <span className="material-symbols-outlined text-primary text-3xl shrink-0">auto_awesome</span>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">AI Mood Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-1 text-sm md:text-base">
              {insight || "Keep journaling to unlock deeper insights about your emotional patterns."}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-soft dark:shadow-none dark:border dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Trend</h3>
            <div className="h-64 w-full">
              <MoodChart />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-soft dark:shadow-none dark:border dark:border-gray-800 flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Primary Drivers</h3>
              {patternData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      Weekly Pattern
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">{patternData.weeklyInsight}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-sm">psychology</span>
                      Top Factor
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">{patternData.topFactorInsight}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-3xl mb-2">bar_chart</span>
                    <p>Log a few more entries to see patterns</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Mood List */}
        <section className="bg-card-light dark:bg-card-dark rounded-2xl shadow-soft dark:shadow-none dark:border dark:border-gray-800 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6">Recent Mood History</h3>
          <div className="space-y-6">
            {recentMoods.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex gap-4 items-start">
                <div className={`w-3 h-3 mt-1.5 rounded-full shrink-0 ${getMoodRingColor(entry.mood)}`}></div>
                <div>
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{entry.mood}</span>
                    <span className="text-xs text-gray-400">• {new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                  {entry.note && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 italic">"{entry.note}"</p>}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {entry.factors.map(f => (
                      <span key={f} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {recentMoods.length === 0 && <p className="text-gray-400 text-sm">No mood history available.</p>}
          </div>
        </section>

      </div>
    </div>
  );
};
