import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { generateMindfulnessPrompt, generateThoughts, analyzeSentiment } from '../services/geminiService';
import { RichTextEditor } from './editor/RichTextEditor';
import { Template } from '../types';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/db';
import { calculateJournalStreak } from '../utils/analytics';
import { getUserProfile } from '../utils/storage';

interface JournalEditorProps {
  onBack: () => void;
  onSave: (title: string, content: string) => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ onBack, onSave }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Real Data Integration
  const entries = useLiveQuery(() => db.journalEntries.toArray()) || [];
  const writingStreak = calculateJournalStreak(entries);
  const userProfile = getUserProfile();

  // AI State
  const [prompts, setPrompts] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState({ label: 'Neutral', score: 50, color: 'text-gray-500' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPromptsLoading, setIsPromptsLoading] = useState(true);

  const editorRef = useRef<any>(null);

  // Initialize Prompts on Mount
  useEffect(() => {
    const initPrompts = async () => {
      try {
        setIsPromptsLoading(true);
        // Generate two initial thought-provokers
        const p1 = await generateThoughts();
        const p2 = await generateThoughts();
        setPrompts([p1, p2]);
      } catch (e) {
        console.warn("Failed to init prompts", e);
        setPrompts(["What is on your mind right now?", "Describe your current environment."]);
      } finally {
        setIsPromptsLoading(false);
      }
    };
    initPrompts();
  }, []);

  // ... (Keep existing template loading logic) ...
  // Handle URL Prompts and Templates
  useEffect(() => {
    const template = location.state?.template as Template | undefined;
    const promptType = searchParams.get('prompt');

    if (template) {
      setTitle(template.title);
      let initialContent = '';

      if (template.blocks) {
        initialContent = template.blocks.map(block => {
          switch (block.type) {
            case 'question':
              return `<h3>${block.title}</h3><p></p>`;
            case 'mood':
              return `<h3>${block.title}</h3><mood-picker></mood-picker><p></p>`;
            case 'checklist':
              const items = block.items?.map(item => `<li>${item}</li>`).join('') || '';
              return `<h3>${block.title}</h3><ul>${items}</ul>`;
            case 'free_text':
              return `<h3>${block.title}</h3><p></p>`;
            default:
              return '';
          }
        }).join('');
      } else {
        if (template.id === 'gratitude') {
          initialContent = "<h2>Today I am grateful for:</h2><ol><li><p></p></li><li><p></p></li><li><p></p></li></ol>";
        } else if (template.id === 'morning') {
          initialContent = "<h3>Morning Intentions</h3><p>Today I want to focus on...</p>";
        } else {
          initialContent = `<p>${template.description}</p>`;
        }
      }
      setContent(initialContent);
    } else if (promptType) {
      if (promptType === 'feeling') {
        setTitle('Morning Check-in');
        setContent("<p>Right now, I'm feeling...</p>");
      } else if (promptType === 'dream') {
        setTitle('Dream Journal');
        setContent("<p>Last night I dreamt about...</p>");
      } else if (promptType === 'gratitude') {
        setTitle('Daily Gratitude');
        setContent("<h2>Today I am grateful for:</h2><ol><li><p></p></li><li><p></p></li><li><p></p></li></ol>");
      }
    } else {
      // Default Title based on time of day
      const hour = new Date().getHours();
      if (hour < 12) setTitle('Morning Reflection');
      else if (hour < 18) setTitle('Afternoon Thoughts');
      else setTitle('Evening Unwind');
    }
  }, [searchParams, location.state]);

  const handleRefreshPrompts = async () => {
    setIsGenerating(true);
    try {
      // Generate prompts based on current content context
      const plainText = content.replace(/<[^>]+>/g, '');
      const p1 = await generateThoughts(plainText);
      const p2 = await generateThoughts(plainText); // Can be optimized to single call returning multiple if service supported it
      setPrompts([p1, p2]);
    } catch (e) {
      console.error(e);
      setPrompts([
        "What is taking up the most space in your mind right now?",
        "Describe a moment today that made you smile."
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Analyze sentiment periodically or on demand
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (content.length > 50) {
        setIsAnalyzing(true);
        const plainText = content.replace(/<[^>]+>/g, '');
        const result = await analyzeSentiment(plainText);
        setSentiment(result);
        setIsAnalyzing(false);
      }
    }, 2000); // Debounce analysis

    return () => clearTimeout(timeoutId);
  }, [content]);

  const insertText = (text: string) => {
    if (editorRef.current) {
      editorRef.current.chain().focus().insertContent(text).run();
    }
  };

  const handlePromptClick = (prompt: string) => {
    insertText(`<p><strong>Reflection:</strong> ${prompt}</p>`);
  };

  // Simple word count estimation from HTML
  const getWordCount = () => {
    const text = content.replace(/<[^>]*>/g, ' '); // Strip tags
    return text.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="flex h-full w-full bg-background-light dark:bg-background-dark text-[#131516] dark:text-gray-100 font-display animate-fade-in-up">
      {/* Editor Main Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden transition-all duration-300">
        {/* Header */}
        <header className={`flex items-center justify-between px-6 lg:px-8 py-4 border-b border-transparent shrink-0 ${isFocusMode ? 'opacity-0 hover:opacity-100 transition-opacity' : ''}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight bg-transparent focus:outline-none focus:border-b border-primary/50"
                placeholder="Entry Title..."
              />
              <p className="text-gray-400 text-xs font-medium">Auto-saving as {userProfile.name}...</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`flex items-center justify-center gap-2 h-9 px-4 rounded-lg border text-sm font-bold transition-colors shadow-sm hidden sm:flex ${isFocusMode ? 'bg-primary text-white border-primary' : 'bg-card-light dark:bg-card-dark border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">{isFocusMode ? 'fullscreen_exit' : 'visibility'}</span>
              <span>Focus Mode</span>
            </button>
            <button
              onClick={() => onSave(title || 'Untitled Entry', content)}
              className="flex items-center justify-center gap-2 h-9 px-6 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              <span>Save Entry</span>
            </button>
          </div>
        </header>

        {/* Editor Scroll Container */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar pb-32">
          <div className={`max-w-3xl mx-auto px-6 lg:px-12 py-10 transition-all duration-500 ${isFocusMode ? 'scale-105' : ''}`}>
            {/* Page Heading (Date) */}
            <div className={`flex flex-col gap-1 mb-8 ${isFocusMode ? 'opacity-50 hover:opacity-100 transition-opacity' : ''}`}>
              <p className="text-primary tracking-wide text-sm font-bold uppercase opacity-80">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <div className="flex items-baseline gap-4">
                <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl lg:text-5xl font-bold font-serif leading-tight">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <p>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <span className="mx-1">•</span>
                <p>{getWordCount()} words</p>
              </div>
            </div>

            {/* Editor Text Area Replacement */}
            <div className="w-full relative group">
              <RichTextEditor
                content={content}
                onUpdate={setContent}
                onEditorReady={(editor) => editorRef.current = editor}
              />
            </div>
          </div>
        </div>

        {/* Floating Bottom Toolbar */}
        {!isFocusMode && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4 pointer-events-none animate-fade-in-up">
            <div className="flex items-center justify-between bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl shadow-float p-2 pointer-events-auto ring-1 ring-black/5">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => insertText("<p>I am grateful for: </p>")}
                  className="flex flex-col items-center justify-center w-16 h-14 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all text-gray-500 hover:text-primary group"
                >
                  <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">favorite</span>
                  <span className="text-[10px] font-medium">Gratitude</span>
                </button>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <button
                  onClick={() => insertText("<p>Reviewing this moment mindfully: </p>")}
                  className="flex flex-col items-center justify-center w-16 h-14 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all text-gray-500 hover:text-primary group"
                >
                  <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">self_improvement</span>
                  <span className="text-[10px] font-medium">Mindful</span>
                </button>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <button
                  onClick={() => insertText("<p>My goal for today/tomorrow is: </p>")}
                  className="flex flex-col items-center justify-center w-16 h-14 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all text-gray-500 hover:text-primary group"
                >
                  <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">flag</span>
                  <span className="text-[10px] font-medium">Goals</span>
                </button>
              </div>
              <button
                onClick={() => insertText(`<p><strong>[${new Date().toLocaleTimeString()}]</strong> </p>`)}
                className="flex items-center justify-center size-10 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition-transform"
                title="Add Timestamp"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: AI Assistant */}
      {!isFocusMode && (
        <aside className="w-[340px] hidden xl:flex flex-col bg-card-light dark:bg-card-dark/50 border-l border-gray-100 dark:border-gray-800 relative z-10 shrink-0 animate-fade-in-right">
          <div className="flex items-center justify-between p-6 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <h3 className="text-[#131516] dark:text-white text-base font-bold">Insight Companion</h3>
            </div>
            <button onClick={() => setIsFocusMode(true)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Hide Sidebar">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Real-time Sentiment Analysis */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Vibe</p>
                {isAnalyzing && <span className="text-[10px] text-primary animate-pulse">Analyzing...</span>}
              </div>
              <div className="bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                {/* Decorative gradient blur based on sentiment color */}
                <div className={`absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 opacity-10 rounded-full blur-2xl transition-all ${sentiment.color.replace('text-', 'bg-')}`}></div>

                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className={`size-10 rounded-full flex items-center justify-center ${sentiment.color.replace('text-', 'bg-').replace('500', '50')} ${sentiment.color}`}>
                    <span className="material-symbols-outlined">
                      {sentiment.score > 70 ? 'sentiment_very_satisfied' : sentiment.score > 40 ? 'sentiment_satisfied' : 'sentiment_dissatisfied'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{sentiment.label}</p>
                    <p className="text-xs text-gray-500">{sentiment.score}% Intensity</p>
                  </div>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-1000 ${sentiment.color.replace('text-', 'bg-')}`}
                    style={{ width: `${sentiment.score}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* Follow-up Prompts */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deepen Your Thought</p>
                <button
                  onClick={handleRefreshPrompts}
                  disabled={isGenerating || isPromptsLoading}
                  className="text-primary text-[10px] font-bold hover:underline disabled:opacity-50"
                >
                  {isGenerating ? 'Thinking...' : 'Refresh'}
                </button>
              </div>

              {isPromptsLoading ? (
                <div className="space-y-3">
                  <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                  <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse delay-75"></div>
                </div>
              ) : prompts.length > 0 ? (
                prompts.map((prompt, index) => (
                  <div
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 ${index === 0 ? 'text-accent' : 'text-blue-400'}`}>
                        <span className="material-symbols-outlined text-lg">{index === 0 ? 'lightbulb' : 'water_drop'}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug mb-2">{prompt}</p>
                        <div className="flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Click to add</span>
                          <span className="material-symbols-outlined text-sm">add</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400">
                  <p className="text-xs">No prompts available...</p>
                </div>
              )}
            </div>

            {/* Stats/Widgets */}
            <div className="flex flex-col gap-3 mt-auto">
              {writingStreak > 0 ? (
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                  <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">Writing Streak</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-display">{writingStreak}</span>
                      <span className="text-sm text-gray-500 font-medium ml-1">days</span>
                    </div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1.5 rounded-full ${i < Math.min(writingStreak, 5) ? 'bg-primary h-4' : 'bg-primary/20 h-2'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                  <span className="material-symbols-outlined text-gray-400 mb-1">history_edu</span>
                  <p className="text-xs font-bold text-gray-500">Start your streak today!</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};