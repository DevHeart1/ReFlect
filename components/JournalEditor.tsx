import React, { useState } from 'react';
import { generateMindfulnessPrompt } from '../services/geminiService';

interface JournalEditorProps {
  onBack: () => void;
  onSave: (title: string, content: string) => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ onBack, onSave }) => {
  const [content, setContent] = useState('The morning light is hitting the desk in a way that makes everything feel simpler today. I\'ve been feeling a bit overwhelmed with the project deadline approaching, but taking a moment to just sit here and breathe is helping.\n\nMy goal for today isn\'t to finish everything, but to make steady progress without anxiety.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([
    'You mentioned "anxiety" about the deadline. What is the smallest step you can take right now?',
    'How does your body feel when you think about making steady progress?'
  ]);

  const handleRefreshPrompts = async () => {
    setIsGenerating(true);
    try {
      const p1 = await generateMindfulnessPrompt();
      const p2 = await generateMindfulnessPrompt();
      setPrompts([p1, p2]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-background-light dark:bg-background-dark text-[#131516] dark:text-gray-100 font-display animate-fade-in-up">
      {/* Editor Main Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-transparent shrink-0">
          <div className="flex items-center gap-3">
             <button 
                onClick={onBack}
                className="p-2 -ml-2 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Back to Dashboard"
             >
                <span className="material-symbols-outlined">arrow_back</span>
             </button>
             <div className="flex flex-col">
                <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Morning Reflection</h2>
                <p className="text-gray-400 text-xs font-medium">Last saved just now</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm hidden sm:flex">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>Focus Mode</span>
            </button>
            <button 
                onClick={() => onSave("Morning Reflection", content)}
                className="flex items-center justify-center gap-2 h-9 px-6 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              <span>Save Entry</span>
            </button>
          </div>
        </header>

        {/* Editor Scroll Container */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar pb-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-12 py-10">
            {/* Page Heading (Date) */}
            <div className="flex flex-col gap-1 mb-8">
              <p className="text-primary tracking-wide text-sm font-bold uppercase opacity-80">Thursday</p>
              <div className="flex items-baseline gap-4">
                <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold font-serif leading-tight">October 24, 2023</h1>
              </div>
              <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <p>10:42 AM</p>
                <span className="mx-1">•</span>
                <p>{content.split(/\s+/).filter(Boolean).length} words</p>
              </div>
            </div>

            {/* Editor Text Area */}
            <div className="w-full relative group">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-200 font-serif placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:ring-0 resize-none outline-none editor-textarea selection:bg-primary/20 min-h-[60vh]" 
                placeholder="Start writing... clear your mind."
              />
              {/* Floating Type Indicator */}
              <div className="absolute -left-8 top-2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 text-gray-300 hidden lg:block">
                <span className="material-symbols-outlined text-xl">edit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Toolbar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4 pointer-events-none">
          <div className="flex items-center justify-between bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl shadow-float p-2 pointer-events-auto ring-1 ring-black/5">
            <div className="flex items-center gap-1">
              <button className="flex flex-col items-center justify-center w-16 h-14 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all text-gray-500 hover:text-primary group">
                <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">favorite</span>
                <span className="text-[10px] font-medium">Gratitude</span>
              </button>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
              <button className="flex flex-col items-center justify-center w-16 h-14 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all text-gray-500 hover:text-primary group">
                <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">self_improvement</span>
                <span className="text-[10px] font-medium">Mindful</span>
              </button>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
              <button className="flex flex-col items-center justify-center w-16 h-14 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all text-gray-500 hover:text-primary group">
                <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">flag</span>
                <span className="text-[10px] font-medium">Goals</span>
              </button>
            </div>
            <button className="flex items-center justify-center size-10 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: AI Assistant */}
      <aside className="w-[340px] hidden xl:flex flex-col bg-card-light dark:bg-card-dark/50 border-l border-gray-100 dark:border-gray-800 relative z-10 shrink-0">
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 className="text-[#131516] dark:text-white text-base font-bold">Insight Companion</h3>
          </div>
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Real-time Sentiment Analysis */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Vibe</p>
            <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
              {/* Decorative gradient blur */}
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">spa</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Calm & Focused</p>
                  <p className="text-xs text-gray-500">Stability detected</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                <div className="bg-green-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>Anxious</span>
                <span>Neutral</span>
                <span>Serene</span>
              </div>
            </div>
          </div>

          {/* Follow-up Prompts */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deepen Your Thought</p>
              <button 
                onClick={handleRefreshPrompts}
                disabled={isGenerating}
                className="text-primary text-[10px] font-bold hover:underline disabled:opacity-50"
              >
                {isGenerating ? 'Thinking...' : 'Refresh'}
              </button>
            </div>
            
            {prompts.map((prompt, index) => (
               <div key={index} className="bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex gap-3">
                  <div className={`mt-0.5 ${index === 0 ? 'text-accent' : 'text-blue-400'}`}>
                    <span className="material-symbols-outlined text-lg">{index === 0 ? 'lightbulb' : 'water_drop'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug mb-2">{prompt}</p>
                    <div className="flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Reflect on this</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats/Widgets */}
          <div className="flex flex-col gap-3 mt-auto">
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">Writing Streak</p>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-display">12</span>
                  <span className="text-sm text-gray-500 font-medium">days</span>
                </div>
                <div className="flex gap-1 mb-1">
                  <div className="w-1.5 h-3 bg-primary/30 rounded-full"></div>
                  <div className="w-1.5 h-4 bg-primary/40 rounded-full"></div>
                  <div className="w-1.5 h-3 bg-primary/30 rounded-full"></div>
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <div className="w-1.5 h-4 bg-primary/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};