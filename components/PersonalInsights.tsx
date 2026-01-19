import React, { useEffect, useState } from 'react';
import { getMoodCheckins, MoodCheckin } from '../utils/storage';

export const PersonalInsights: React.FC = () => {
  const [entries, setEntries] = useState<MoodCheckin[]>([]);
  const [streak, setStreak] = useState(0);
  const [topEmotion, setTopEmotion] = useState<{ label: string; count: number }>({ label: 'N/A', count: 0 });

  useEffect(() => {
    const data = getMoodCheckins();
    setEntries(data);
    calculateMetrics(data);
  }, []);

  const calculateMetrics = (data: MoodCheckin[]) => {
    // Sort by date desc
    const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 1. Calculate Streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sorted.length > 0) {
      const lastEntryDate = new Date(sorted[0].date);
      lastEntryDate.setHours(0, 0, 0, 0);

      const diffDays = (today.getTime() - lastEntryDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 1) {
        currentStreak = 1;
        let checkDate = lastEntryDate;
        for (let i = 1; i < sorted.length; i++) {
          const prevDate = new Date(sorted[i].date);
          prevDate.setHours(0, 0, 0, 0);
          const gap = (checkDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
          if (gap === 1) {
            currentStreak++;
            checkDate = prevDate;
          } else if (gap === 0) continue;
          else break;
        }
      }
    }
    setStreak(currentStreak);

    // 2. Top Emotion
    const counts: Record<string, number> = {};
    data.forEach(e => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    let max = 0;
    let maxLabel = 'None';
    Object.entries(counts).forEach(([label, count]) => {
      if (count > max) { max = count; maxLabel = label; }
    });
    setTopEmotion({ label: maxLabel, count: max });
  };

  // Generate Chart Path
  const getChartPath = () => {
    if (entries.length < 2) return "";

    const width = 800;
    const height = 240;
    // Get last 14 days or so for the chart
    const chartData = entries.slice(0, 14).reverse();
    if (chartData.length === 0) return "";

    const stepX = width / (chartData.length - 1 || 1);
    const getY = (val: number) => 220 - (val / 5) * 180;

    let path = `M0,${getY(chartData[0].moodValue)}`;
    chartData.forEach((d, i) => {
      if (i === 0) return;
      const x = i * stepX;
      const y = getY(d.moodValue);
      path += ` L${x},${y}`;
    });
    return path;
  };

  const getGradientPath = () => {
    const line = getChartPath();
    if (!line) return "";
    return `${line} L800,240 L0,240 Z`;
  };

  const getAverageMoodLabel = () => {
    if (entries.length === 0) return "No Data";
    const sum = entries.reduce((acc, curr) => acc + curr.moodValue, 0);
    const avg = sum / entries.length;
    if (avg >= 4.5) return "Radiant";
    if (avg >= 3.5) return "Content";
    if (avg >= 2.5) return "Neutral";
    if (avg >= 1.5) return "Low";
    return "Distressed";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:px-10 md:py-10 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Your Insights</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Understand your emotional journey through data and reflection.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-card-dark p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button className="px-4 py-2 text-sm font-bold rounded-lg bg-primary text-white shadow-sm transition-all hover:bg-primary/90">
            Last 30 Days
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            3 Months
          </button>
          <button className="px-3 py-2 text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">

        {/* Sentiment Trend Graph (Hero) - Spans 8 cols */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6 z-10">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Emotional Trajectory</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-primary dark:text-blue-300">{getAverageMoodLabel()}</span>
                {entries.length > 0 && (
                  <span className="flex items-center text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    Last 14 entries
                  </span>
                )}
              </div>
            </div>
            <button className="text-gray-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>

          {/* Chart Area */}
          <div className="relative w-full h-[240px] z-10">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 240">
              <defs>
                <linearGradient id="gradient-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2a5e6f" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#2a5e6f" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line className="text-gray-100 dark:text-gray-700" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="40" y2="40"></line>
              <line className="text-gray-100 dark:text-gray-700" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="120" y2="120"></line>
              <line className="text-gray-100 dark:text-gray-700" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>

              {/* Area Fill */}
              <path d="M0,240 L0,180 C50,160 100,190 150,150 C200,110 250,60 300,80 C350,100 400,120 450,90 C500,60 550,30 600,50 C650,70 700,90 750,70 C780,58 800,50 800,50 L800,240 Z" fill="url(#gradient-fill)"></path>

              {/* Main Line */}
              <path className="animate-[draw_2s_ease-out_forwards]" style={{ strokeDasharray: 2000, strokeDashoffset: 0 }} d="M0,180 C50,160 100,190 150,150 C200,110 250,60 300,80 C350,100 400,120 450,90 C500,60 550,30 600,50 C650,70 700,90 750,70 C780,58 800,50 800,50" fill="none" stroke="#2a5e6f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>

              {/* Interaction Points (Mocked) */}
              <circle className="fill-white dark:fill-card-dark stroke-primary stroke-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" cx="300" cy="80" r="6"></circle>
              <circle className="fill-white dark:fill-card-dark stroke-primary stroke-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" cx="600" cy="50" r="6"></circle>
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2 px-1">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>

        {/* Key Metrics Cards - Spans 4 cols */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Top Stat */}
          <div className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col justify-center">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Streak</p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{streak} Days</p>
                <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">local_fire_department</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-6">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          {/* Bottom Stat */}
          <div className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col justify-center">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Top Emotion</p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white text-ellipsis overflow-hidden">{topEmotion.label}</p>
                <p className="text-sm text-gray-500 mt-1">Logged {topEmotion.count} times</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary dark:text-blue-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">favorite</span>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              {/* Optional: Add hashtags if we had them calculated */}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Calendar & AI Patterns */}
      {/* Recent Activity List (Replacing Calendar for now as it's easier to verification functional state) */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Logged Moods</h3>
          {entries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No mood entries found. Go to Dashboard to log your first mood!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map(entry => (
                <div key={entry.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
                    <div className="flex gap-1">
                      {entry.factors.map(f => (
                        <span key={f} className="w-2 h-2 rounded-full bg-blue-400" title={f}></span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-2xl ${entry.mood === 'Radiant' ? 'text-amber-500' : entry.mood === 'Distressed' ? 'text-rose-500' : 'text-primary'}`}>●</span>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">{entry.mood}</h4>
                  </div>
                  {entry.note && <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">"{entry.note}"</p>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.secondaryEmotions.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
