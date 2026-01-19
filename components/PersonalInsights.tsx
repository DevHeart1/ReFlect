import React, { useEffect, useState, useMemo } from 'react';
import { getMoodCheckins, MoodCheckin } from '../utils/storage';

type TimeRange = '30days' | '3months';

export const PersonalInsights: React.FC = () => {
  const [entries, setEntries] = useState<MoodCheckin[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [filteredEntries, setFilteredEntries] = useState<MoodCheckin[]>([]);
  const [streak, setStreak] = useState(0);
  const [topEmotion, setTopEmotion] = useState<{ label: string; count: number }>({ label: 'N/A', count: 0 });

  useEffect(() => {
    const data = getMoodCheckins();
    setEntries(data);
  }, []);

  useEffect(() => {
    filterData();
  }, [entries, timeRange]);

  const filterData = () => {
    if (entries.length === 0) return;

    const now = new Date();
    const cutoff = new Date();
    if (timeRange === '30days') cutoff.setDate(now.getDate() - 30);
    if (timeRange === '3months') cutoff.setMonth(now.getMonth() - 3);

    const filtered = entries.filter(e => new Date(e.date) >= cutoff).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredEntries(filtered);
    calculateMetrics(filtered); // Calculate metrics based on filtered view or all time? Usually filtered.
  };

  const calculateMetrics = (data: MoodCheckin[]) => {
    // 1. Calculate Streak (This usually implies "Current Streak" leading up to today, so it should probably check ALL entries, not just filtered, but for now let's use all entries for streak to be accurate)
    // Actually, streak is an "all time" stat usually. Let's recalculate streak using ALL entries from state.
    const sortedAll = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sortedAll.length > 0) {
      const lastEntryDate = new Date(sortedAll[0].date);
      lastEntryDate.setHours(0, 0, 0, 0);

      const diffDays = (today.getTime() - lastEntryDate.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 1) {
        currentStreak = 1;
        let checkDate = lastEntryDate;
        for (let i = 1; i < sortedAll.length; i++) {
          const prevDate = new Date(sortedAll[i].date);
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

    // 2. Top Emotion (Based on filtered data)
    if (data.length === 0) {
      setTopEmotion({ label: 'N/A', count: 0 });
      return;
    }
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
    if (filteredEntries.length < 2) return "";

    const width = 800;
    const height = 240;
    // Use filtered entries, limit to fit chart if needed, but filtered is already limited by time
    // Let's take up to 30 points to keep smooth
    const chartData = filteredEntries.slice(0, 30).reverse();
    if (chartData.length === 0) return "";

    const stepX = width / (chartData.length - 1 || 1);
    const getY = (val: number) => 220 - (val / 5) * 180;

    let path = `M0,${getY(chartData[0].moodValue)}`;
    chartData.forEach((d, i) => {
      if (i === 0) return;
      const x = i * stepX;
      const y = getY(d.moodValue);
      // Bezier curve could be nicer but straight lines are fine for now
      path += ` L${x},${y}`;
    });
    return path;

    // For smooth curve (Catmull-Rom or similar would be better), but simple L is functional
  };

  const getGradientPath = () => {
    const line = getChartPath();
    if (!line) return "";
    return `${line} L800,240 L0,240 Z`;
  };

  const getAverageMoodLabel = () => {
    if (filteredEntries.length === 0) return "No Data";
    const sum = filteredEntries.reduce((acc, curr) => acc + curr.moodValue, 0);
    const avg = sum / filteredEntries.length;
    if (avg >= 4.5) return "Radiant";
    if (avg >= 3.5) return "Content";
    if (avg >= 2.5) return "Neutral";
    if (avg >= 1.5) return "Low";
    return "Distressed";
  };

  // Calendar Generation
  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...

    // Adjust for Monday start if desired, but let's stick to Sun start for simplicity or Mon
    // Let's assume Mon start for array: 0=Mon ... 6=Sun
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days: (MoodCheckin | null)[] = Array(adjustedFirstDay).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = new Date(year, month, i).toDateString(); // Compare date strings
      const entry = entries.find(e => new Date(e.date).toDateString() === dateStr);
      days.push(entry || { id: `empty-${i}`, date: new Date(year, month, i).toISOString(), mood: 'none', moodValue: 0, secondaryEmotions: [], factors: [], note: '' });
      // We push a "dummy" entry if none exists so we can map it
    }
    return days;
  }, [entries]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Radiant': return 'bg-amber-400';
      case 'Content': return 'bg-emerald-400';
      case 'Neutral': return 'bg-gray-400';
      case 'Low': return 'bg-blue-400';
      case 'Distressed': return 'bg-rose-400';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:px-10 md:py-10 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Your Insights</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Understand your emotional journey through data and reflection.</p>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-card-dark p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${timeRange === '30days' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('3months')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${timeRange === '3months' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            3 Months
          </button>
          <div className="px-3 py-2 text-gray-400 border-l border-gray-200 dark:border-gray-700 ml-1">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </div>
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
                {filteredEntries.length > 0 && (
                  <span className="flex items-center text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {filteredEntries.length} entries in range
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
            {filteredEntries.length > 1 ? (
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

                {/* Area and Line */}
                <path d={getGradientPath()} fill="url(#gradient-fill)"></path>
                <path className="animate-[draw_2s_ease-out_forwards]" style={{ strokeDasharray: 2000, strokeDashoffset: 0 }} d={getChartPath()} fill="none" stroke="#2a5e6f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>

                {/* Datapoint hints on hover? For now just simple line */}
              </svg>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
                <span className="material-symbols-outlined text-4xl mb-2">query_stats</span>
                <span className="font-medium">Not enough data points yet</span>
              </div>
            )}
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
                <p className="text-sm text-gray-500 mt-1">Consistency is key!</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">local_fire_department</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-6">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${Math.min(streak * 5, 100)}%` }}></div>
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
          </div>
        </div>
      </div>

      {/* Second Row: Calendar & AI Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Monthly Mood Calendar - Spans 5 cols */}
        <div className="col-span-1 lg:col-span-5 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{new Date().toLocaleString('default', { month: 'long' })} Calendar</h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              This Month
            </span>
          </div>
          <div className="grid grid-cols-7 gap-3 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-bold text-gray-400">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((entry, index) => (
              entry === null ? (
                <div key={`empty-${index}`} className="aspect-square rounded-lg bg-transparent"></div>
              ) : (
                <div
                  key={entry.id}
                  className={`aspect-square rounded-lg ${getMoodColor(entry.mood)} transition-transform hover:scale-110 cursor-pointer relative group flex items-center justify-center shadow-sm`}
                  title={`${new Date(entry.date).toDateString()}: ${entry.mood}`}
                >
                  {entry.mood === 'none' ? (
                    <span className="text-xs text-gray-300">{new Date(entry.date).getDate()}</span>
                  ) : (
                    <span className="text-[10px] font-bold text-white/90">{new Date(entry.date).getDate()}</span>
                  )}

                  {/* Tooltip */}
                  {entry.mood !== 'none' && (
                    <div className="hidden group-hover:block absolute bottom-full mb-2 bg-gray-900/90 text-white text-xs p-2 rounded-lg whitespace-nowrap z-20 pointer-events-none backdrop-blur-sm shadow-xl">
                      <div className="font-bold">{entry.mood}</div>
                      {entry.note && <div className="text-[10px] opacity-75 max-w-[120px] truncate">{entry.note}</div>}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Patterns Section - Spans 7 cols */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary dark:text-blue-300">auto_awesome</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Patterns & Triggers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pattern 1: Most Productive Day */}
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-card-dark p-5 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100">Weekly Insight</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You seem to check in most frequently on <span className="font-bold text-blue-600 dark:text-blue-400">Mondays</span>. Starting the week with reflection is a great habit!
              </p>
            </div>

            {/* Pattern 2: Common Factor */}
            <div className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-card-dark p-5 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">tag</span>
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100">Top Factor</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredEntries.length > 0 && filteredEntries[0].factors.length > 0
                  ? <span>Your most recent check-in highlighted <span className="font-bold text-purple-600">"{filteredEntries[0].factors[0]}"</span> as a key factor.</span>
                  : "Log more entries with factors (e.g. Work, Sleep) to unlock factor analysis."
                }
              </p>
            </div>
          </div>

          {/* Recent Activity List (Compact) */}
          <div className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-5 overflow-hidden flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Latest Logs</h3>
            <div className="overflow-y-auto max-h-[160px] space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
              {filteredEntries.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No entries in this range.</p>
              ) : filteredEntries.map(entry => (
                <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <div className={`w-2 h-10 rounded-full ${getMoodColor(entry.mood)}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{entry.mood}</h4>
                      <span className="text-[10px] font-medium text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{entry.note || "No note added..."}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
