import React, { useState } from 'react';
import { generateMindfulnessPrompt } from '../services/geminiService';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose, onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePrompt = async () => {
    setIsLoading(true);
    const newPrompt = await generateMindfulnessPrompt();
    setPrompt(newPrompt);
    setIsLoading(false);
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(prompt || "Daily Reflection", content);
    setPrompt('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#2d3135] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-[#2a5e6f]/5 to-transparent">
          <h2 className="text-xl font-bold text-[#2a5e6f] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">edit_note</span>
            New Journal Entry
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col gap-4">
          
          {/* AI Prompt Section */}
          <div className="bg-[#fafaf9] dark:bg-[#232629] p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <label className="text-xs font-bold text-[#CCAB48] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                AI Suggestion
              </label>
              <button 
                onClick={handleGeneratePrompt}
                disabled={isLoading}
                className="text-xs text-[#2a5e6f] dark:text-[#5faec7] hover:underline font-medium disabled:opacity-50"
              >
                {isLoading ? 'Thinking...' : 'Get New Prompt'}
              </button>
            </div>
            {prompt ? (
              <p className="text-gray-700 dark:text-gray-200 font-medium italic">"{prompt}"</p>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm">Need inspiration? Click 'Get New Prompt' to start your reflection.</p>
            )}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts here..."
            className="w-full h-64 p-4 bg-transparent border-0 focus:ring-0 text-gray-800 dark:text-gray-100 text-lg resize-none placeholder-gray-300 dark:placeholder-gray-600"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#232629]/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-6 py-2.5 rounded-lg font-medium bg-[#2a5e6f] text-white hover:bg-[#2a5e6f]/90 transition-colors shadow-lg shadow-[#2a5e6f]/20 disabled:opacity-50 disabled:shadow-none"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};
