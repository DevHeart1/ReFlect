import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateGratitudePrompt } from '../services/geminiService';



import { Template } from '../types';

interface TemplatesViewProps {
  templates: Template[];
  onAddTemplate: (template: Template) => void;
  onCreateCustom: () => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ templates, onAddTemplate, onCreateCustom }) => {
  // const [templates, setTemplates] = useState(TEMPLATES_DATA); // Removed local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Interaction States
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const categories = ['All', 'Mindfulness', 'Productivity', 'Emotional Growth', 'General'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const navigate = useNavigate();

  const handleArrowClick = (e: React.MouseEvent, template: Template) => {
    e.stopPropagation();
    setActiveTemplate(template);
    setShowConfirmModal(true);
  };

  const handleEditClick = (e: React.MouseEvent, template: Template) => {
    e.stopPropagation();
    setActiveTemplate(template);
    setEditTitle(template.title);
    setEditDescription(template.description);
    setShowEditModal(true);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Link copied to clipboard! Share this template with your friends.");
  };

  const handleGeneratePrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    const prompt = await generateGratitudePrompt();
    setGeneratedPrompt(prompt);
    setIsGenerating(false);
  };

  const handleSaveCustomTemplate = () => {
    if (!activeTemplate) return;

    const newTemplate: Template = {
      ...activeTemplate,
      id: `${activeTemplate.id}-custom-${Date.now()}`,
      title: editTitle,
      description: editDescription,
      category: 'General', // Default to General for custom
    };

    onAddTemplate(newTemplate);
    setShowEditModal(false);
    setActiveTemplate(null);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col min-h-full animate-fade-in-up relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#131516] dark:text-white mb-2 leading-tight">Customizable Templates</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Choose a structure for your thoughts or create your own.</p>
        </div>
        <button
          onClick={onCreateCustom}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Create New Template
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-8 sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-4 -mt-4">
        <div className="relative w-full lg:w-96 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-card-dark focus:ring-2 focus:ring-primary transition-all shadow-sm placeholder-gray-400 text-sm"
            placeholder="Search templates..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm
                ${selectedCategory === category
                  ? 'bg-primary text-white shadow-primary/20 shadow-md'
                  : 'bg-white dark:bg-card-dark ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {filteredTemplates.map((template) => {
          const isGratitude = template.id === 'gratitude';
          return (
            <div
              key={template.id}
              onClick={(e) => handleArrowClick(e, template)}
              className={`group bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col h-full
              ${isGratitude ? 'hover:scale-[1.02]' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${template.colorTheme.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-14 h-14 rounded-xl ${template.colorTheme.iconBg} ${template.colorTheme.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-3xl">{template.icon}</span>
                  </div>

                  {/* Action Buttons for Gratitude Card */}
                  {isGratitude && (
                    <div className="flex items-center gap-1 opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditClick(e, template)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                        title="Customize Template"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        onClick={handleShareClick}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                        title="Share Template"
                      >
                        <span className="material-symbols-outlined text-[20px]">share</span>
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{template.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-6 flex-grow">
                  {template.description}
                </p>

                {/* AI Prompt Section for Gratitude Card */}
                {isGratitude && (
                  <div className="mb-6">
                    {generatedPrompt ? (
                      <div className="bg-pink-50 dark:bg-pink-900/10 p-3 rounded-lg border border-pink-100 dark:border-pink-900/20 animate-fade-in-up">
                        <p className="text-xs font-bold text-pink-600 dark:text-pink-400 mb-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                          AI Suggestion
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{generatedPrompt}"</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleGeneratePrompt}
                        disabled={isGenerating}
                        className="w-full py-2 px-3 bg-gradient-to-r from-pink-50 to-white dark:from-pink-900/10 dark:to-transparent border border-pink-100 dark:border-pink-900/20 rounded-lg text-xs font-semibold text-pink-600 dark:text-pink-400 flex items-center justify-center gap-2 hover:shadow-sm transition-all"
                      >
                        <span className={`material-symbols-outlined text-[16px] ${isGenerating ? 'animate-spin' : ''}`}>
                          {isGenerating ? 'refresh' : 'auto_awesome'}
                        </span>
                        {isGenerating ? 'Generating...' : 'Get Gratitude Prompt'}
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{template.category}</span>
                  <button
                    onClick={(e) => handleArrowClick(e, template)}
                    className={`material-symbols-outlined text-gray-300 ${template.colorTheme.groupHoverText} transition-colors hover:scale-110`}
                  >
                    arrow_forward
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Create Custom Card */}
        <div
          onClick={onCreateCustom}
          className="bg-gray-50 dark:bg-card-dark/50 p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all h-full min-h-[280px]"
        >
          <div className="h-16 w-16 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-3xl transition-colors">add</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Create Custom</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 px-4">Build a reusable template with your own prompts</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && activeTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
          <div className="relative bg-white dark:bg-[#2d3135] rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4 mx-auto">
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">Start a new entry?</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              You are about to start a new <strong>{activeTemplate.title}</strong> entry. Ready to reflect?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeTemplate) {
                    navigate('/editor', { state: { template: activeTemplate } });
                  }
                  setShowConfirmModal(false);
                }}
                className="flex-1 py-2.5 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Start Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && activeTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white dark:bg-[#2d3135] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400">tune</span>
                Customize Template
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Template Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-500 text-[20px] mt-0.5">info</span>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Editing this template creates a new custom version in your library. The original will remain unchanged.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#232629]/50 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomTemplate}
                className="px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm"
              >
                Save as Custom Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
