import React, { useState } from 'react';

export const DailyMoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const moods = [
    { label: 'Radiant', icon: 'sunny', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-400', ring: 'ring-amber-400' },
    { label: 'Content', icon: 'sentiment_satisfied', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-400', ring: 'ring-emerald-400' },
    { label: 'Neutral', icon: 'sentiment_neutral', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-700', border: 'border-gray-400', ring: 'ring-gray-400' },
    { label: 'Low', icon: 'rainy', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-400', ring: 'ring-blue-400' },
    { label: 'Distressed', icon: 'thunderstorm', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-400', ring: 'ring-rose-400' },
  ];

  const secondaryEmotions = ['Anxious', 'Excited', 'Tired', 'Grateful', 'Frustrated', 'Inspired'];
  
  const factors = [
    { label: 'Sleep', icon: 'bedtime', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
    { label: 'Exercise', icon: 'fitness_center', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    { label: 'Social', icon: 'groups', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
    { label: 'Work', icon: 'work', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:px-10 md:py-10 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Daily Check-in</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Take a moment to reflect and track your emotional well-being.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Today</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Tracker Column */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
          
          {/* Mood Selection */}
          <section className="bg-card-light dark:bg-card-dark rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">How are you feeling today?</h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-4">
              {moods.map((mood) => (
                <button 
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-2 focus:outline-none"
                >
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-lg border-2 
                    ${mood.bg} 
                    ${selectedMood === mood.label ? `${mood.border} ring-2 ring-offset-2 ${mood.ring} dark:ring-offset-card-dark` : 'border-transparent'} 
                    ${selectedMood === mood.label ? 'scale-105' : ''}
                  `}>
                    <span className={`material-symbols-outlined text-5xl ${mood.color}`}>{mood.icon}</span>
                  </div>
                  <span className={`font-bold transition-colors ${selectedMood === mood.label ? 'text-primary dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Details Section */}
          <section className="bg-card-light dark:bg-card-dark rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-8">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>
              Mood Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Secondary Emotions */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Secondary Emotions</label>
                <div className="flex flex-wrap gap-2">
                  {secondaryEmotions.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-lg border transition-all 
                        ${selectedTags.includes(tag) 
                          ? 'bg-primary/10 border-primary text-primary font-medium' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary/50'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button className="w-8 h-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>

              {/* Factors */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">What's affecting you?</label>
                <div className="grid grid-cols-2 gap-3">
                  {factors.map(factor => (
                    <button 
                      key={factor.label}
                      onClick={() => toggleFactor(factor.label)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left group transition-colors
                        ${selectedFactors.includes(factor.label)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${factor.color}`}>
                        <span className="material-symbols-outlined text-lg">{factor.icon}</span>
                      </div>
                      <span className={`text-sm font-bold ${selectedFactors.includes(factor.label) ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {factor.label}
                      </span>
                      {selectedFactors.includes(factor.label) && (
                        <span className="material-symbols-outlined text-primary text-sm ml-auto">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Note Area */}
            <div className="mt-8">
              <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Quick Note</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-primary focus:ring-primary h-24 resize-none p-4 text-gray-700 dark:text-gray-300 placeholder:text-gray-400 text-sm" 
                placeholder="Add any thoughts about your mood..."
              ></textarea>
            </div>

            {/* Save Action */}
            <div className="mt-8 flex justify-end">
              <button className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
                <span className="material-symbols-outlined">save</span>
                Save Entry
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="col-span-1 lg:col-span-4">
          <section className="bg-card-light dark:bg-card-dark rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700/50 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Entries</h3>
              <button className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wide">View All</button>
            </div>
            
            <div className="relative pl-4 border-l border-gray-200 dark:border-gray-700 space-y-8 pb-4">
              
              {/* Entry 1 */}
              <div className="relative pl-6 group cursor-pointer">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-white dark:ring-card-dark"></div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-gray-400">09:30 AM</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-400" title="Social"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-400" title="Work"></span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">Feeling Content</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Had a productive morning meeting. Felt really heard by the team.</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">Productive</span>
                </div>
              </div>

              {/* Entry 2 */}
              <div className="relative pl-6 group cursor-pointer">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-white dark:ring-card-dark"></div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-gray-400">Yesterday, 8:00 PM</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Exercise"></span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">Radiant Evening</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Great yoga session. Feeling very connected and peaceful.</p>
              </div>

              {/* Entry 3 */}
              <div className="relative pl-6 group cursor-pointer">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white dark:ring-card-dark"></div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-gray-400">Yesterday, 2:00 PM</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" title="Work"></span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">Neutral State</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Just a regular afternoon. Nothing special happening, bit bored.</p>
              </div>

               {/* Entry 4 */}
               <div className="relative pl-6 group cursor-pointer">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-rose-400 ring-4 ring-white dark:ring-card-dark"></div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-gray-400">Oct 22, 10:15 AM</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" title="Sleep"></span>
                  </div>
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">Distressed</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Bad sleep last night. Feeling groggy and irritable.</p>
              </div>

            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="bg-primary/5 rounded-xl p-4 flex gap-3 items-start">
                <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
                <div>
                  <p className="text-xs font-bold text-primary uppercase mb-1">Insight</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    You report feeling <span className="font-bold text-emerald-600 dark:text-emerald-400">Content</span> 80% of the time after Exercise.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
