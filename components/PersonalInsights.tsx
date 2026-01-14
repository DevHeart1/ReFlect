import React from 'react';

export const PersonalInsights: React.FC = () => {
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
                <span className="text-3xl font-extrabold text-primary dark:text-blue-300">Generally Positive</span>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                  +12%
                </span>
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
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">12 Days</p>
                <p className="text-sm text-gray-500 mt-1">Personal best: 28 days</p>
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
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">Gratitude</p>
                <p className="text-sm text-gray-500 mt-1">Logged 8 times this month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary dark:text-blue-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">favorite</span>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded text-gray-600 dark:text-gray-300">#family</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded text-gray-600 dark:text-gray-300">#work</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Calendar & AI Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Mood Calendar - Spans 5 cols */}
        <div className="col-span-1 lg:col-span-5 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mood Calendar</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-7 gap-3 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-bold text-gray-400">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {/* Calendar Grid Items - Using opacity for "heatmap" intensity or colors for mood types */}
            <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800"></div> {/* Empty/Prev Month */}
            <div className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800"></div> {/* Empty/Prev Month */}
            <div className="aspect-square rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer group relative">
               <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20">Calm</div>
            </div>
            <div className="aspect-square rounded-lg bg-primary/40 hover:bg-primary/50 transition-colors cursor-pointer"></div>
            <div className="aspect-square rounded-lg bg-primary hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"></div>
            <div className="aspect-square rounded-lg bg-accent/60 hover:bg-accent/70 transition-colors cursor-pointer"></div>
            <div className="aspect-square rounded-lg bg-primary/30 hover:bg-primary/40 transition-colors cursor-pointer"></div>
            <div className="aspect-square rounded-lg bg-primary/60 hover:bg-primary/70 transition-colors cursor-pointer"></div>
            <div className="aspect-square rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer"></div>
            <div className="aspect-square rounded-lg bg-accent/40 hover:bg-accent/50 transition-colors cursor-pointer"></div>
            <div className="aspect-square rounded-lg bg-primary/80 hover:bg-primary/90 transition-colors cursor-pointer"></div>
            <div className="aspect-square rounded-lg bg-primary hover:bg-primary/90 transition-colors cursor-pointer border-2 border-white dark:border-gray-600 shadow-md transform scale-105"></div>
            <div className="aspect-square rounded-lg bg-primary/40 hover:bg-primary/50 transition-colors cursor-pointer"></div>
            <div className="aspect-square rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"></div>
            {[15, 16, 17, 18, 19, 20, 21].map((day) => (
              <div key={day} className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center text-xs text-gray-400">{day}</div>
            ))}
          </div>
          <div className="flex justify-start gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs text-gray-500">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/30"></div>
              <span className="text-xs text-gray-500">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent/60"></div>
              <span className="text-xs text-gray-500">Mixed</span>
            </div>
          </div>
        </div>

        {/* AI Patterns & Triggers - Spans 7 cols */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary dark:text-blue-300">auto_awesome</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Patterns & Triggers</h3>
          </div>
          
          {/* Pattern Card 1 */}
          <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 flex gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-100">Productivity Spike</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                You tend to write longer, more detailed entries on <span className="font-bold text-primary dark:text-blue-300">Tuesdays</span>. This correlates with your highest reported mood scores for the week.
              </p>
            </div>
          </div>
          
          {/* Pattern Card 2 */}
          <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 flex gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined">nature_people</span>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-100">Nature Connection</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                The tag <span className="font-bold text-emerald-600 dark:text-emerald-400">'Calm'</span> appears in 85% of entries where you also mention "walking" or "trees". Outdoor activity is a strong anchor for you.
              </p>
            </div>
          </div>
          
          {/* Pattern Card 3 */}
          <div className="bg-card-light dark:bg-card-dark p-5 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700/50 flex gap-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined">bedtime</span>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-100">Sleep Correlation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Lower mood entries often follow mentions of "late nights". Consider reviewing your evening routine on Sundays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
