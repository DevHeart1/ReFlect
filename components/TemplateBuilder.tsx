import React, { useState } from 'react';
import { Template, TemplateBlock } from '../types';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface TemplateBuilderProps {
  onBack: () => void;
  onSave: (template: Template) => void;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ onBack, onSave }) => {
  const [templateName, setTemplateName] = useState('New Template');
  const [category, setCategory] = useState('General');
  const [blocks, setBlocks] = useState<TemplateBlock[]>([
    { id: '1', type: 'mood', title: 'How are you feeling?' },
    { id: '2', type: 'question', title: 'What is your main focus today?' },
  ]);
  const [selectedColor, setSelectedColor] = useState('text-blue-500');
  const [selectedIcon, setSelectedIcon] = useState('edit_note');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const colors = [
    { name: 'Blue', class: 'text-blue-500', bg: 'bg-blue-500', theme: { text: 'text-blue-500', bg: 'bg-card-light dark:bg-card-dark', iconBg: 'bg-blue-50 dark:bg-blue-500/10', groupHoverText: 'group-hover:text-blue-500', gradient: 'from-blue-500/5' } },
    { name: 'Amber', class: 'text-amber-500', bg: 'bg-amber-500', theme: { text: 'text-amber-500', bg: 'bg-card-light dark:bg-card-dark', iconBg: 'bg-amber-50 dark:bg-amber-500/10', groupHoverText: 'group-hover:text-amber-500', gradient: 'from-amber-500/5' } },
    { name: 'Pink', class: 'text-pink-500', bg: 'bg-pink-500', theme: { text: 'text-pink-500', bg: 'bg-card-light dark:bg-card-dark', iconBg: 'bg-pink-50 dark:bg-pink-500/10', groupHoverText: 'group-hover:text-pink-500', gradient: 'from-pink-500/5' } },
    { name: 'Indigo', class: 'text-indigo-500', bg: 'bg-indigo-500', theme: { text: 'text-indigo-500', bg: 'bg-card-light dark:bg-card-dark', iconBg: 'bg-indigo-50 dark:bg-indigo-500/10', groupHoverText: 'group-hover:text-indigo-500', gradient: 'from-indigo-500/5' } },
    { name: 'Emerald', class: 'text-emerald-500', bg: 'bg-emerald-500', theme: { text: 'text-emerald-500', bg: 'bg-card-light dark:bg-card-dark', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', groupHoverText: 'group-hover:text-emerald-500', gradient: 'from-emerald-500/5' } },
  ];

  const addBlock = (type: TemplateBlock['type']) => {
    const newBlock: TemplateBlock = {
      id: Date.now().toString(),
      type,
      title: type === 'question' ? 'New Question' : type === 'checklist' ? 'New Checklist' : type === 'mood' ? 'Mood Check' : 'Free Text Area',
      items: type === 'checklist' ? ['Item 1'] : undefined
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlockTitle = (id: string, title: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, title } : b));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      setBlocks(newBlocks);
    }
  };

  // Checklist Item Management
  const addChecklistItem = (blockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.items) {
        return { ...b, items: [...b.items, 'New Item'] };
      }
      return b;
    }));
  };

  const updateChecklistItem = (blockId: string, itemIndex: number, text: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.items) {
        const newItems = [...b.items];
        newItems[itemIndex] = text;
        return { ...b, items: newItems };
      }
      return b;
    }));
  };

  const removeChecklistItem = (blockId: string, itemIndex: number) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.items) {
        return { ...b, items: b.items.filter((_, idx) => idx !== itemIndex) };
      }
      return b;
    }));
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name.");
      return;
    }

    // Find theme based on selected color
    const theme = colors.find(c => c.class === selectedColor)?.theme || colors[0].theme;

    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      title: templateName,
      description: `${category} template with ${blocks.length} blocks.`,
      category,
      icon: selectedIcon, // Use emoji or icon name
      colorTheme: theme,
      blocks: blocks
    };
    onSave(newTemplate);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedIcon(emojiData.emoji);
    setShowIconPicker(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden animate-fade-in-up">
      {/* Settings Panel */}
      <div className="w-full lg:w-80 bg-card-light dark:bg-card-dark border-r border-gray-100 dark:border-gray-800 flex flex-col overflow-y-auto z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#131516] dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            Template Settings
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Name</label>
              <input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border-transparent focus:border-primary focus:bg-white dark:focus:bg-card-dark focus:ring-0 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                type="text"
                placeholder="e.g. Weekly Review"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border-transparent focus:border-primary focus:bg-white dark:focus:bg-card-dark focus:ring-0 transition-all font-medium text-gray-900 dark:text-white text-sm"
              >
                <option>Mindfulness</option>
                <option>Productivity</option>
                <option>Emotional Growth</option>
                <option>General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Appearance</label>
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-12 w-12 rounded-xl bg-primary/10 ${selectedColor} flex items-center justify-center border-2 border-current relative`}>
                  {selectedIcon.match(/^[a-z_]+$/) ? (
                    <span className="material-symbols-outlined text-2xl">{selectedIcon}</span>
                  ) : (
                    <span className="text-2xl">{selectedIcon}</span>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="px-4 py-2 bg-gray-50 dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    Change Icon
                  </button>
                  {showIconPicker && (
                    <div className="absolute top-full left-0 mt-2 z-50 shadow-xl rounded-xl overflow-hidden">
                      <div className="fixed inset-0 z-40" onClick={() => setShowIconPicker(false)}></div>
                      <div className="relative z-50">
                        <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.AUTO} width={300} height={400} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.class)}
                    className={`w-8 h-8 rounded-full ${c.bg} hover:scale-110 transition-transform ${selectedColor === c.class ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                AI Features (Coming Soon)
              </label>
              <div className="flex items-center justify-between mb-4 opacity-50 pointer-events-none">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Sentiment Analysis</p>
                  <p className="text-xs text-gray-500">Track emotional tone over time</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark relative overflow-hidden">

        {/* Editor Toolbar */}
        <div className="bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="text-sm font-medium text-gray-400">Editing:</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{templateName || 'Untitled'}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              Save Template
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-3xl mx-auto">

            {/* Add Block Grid */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 ml-1">Add Block</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => addBlock('question')} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-2 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">help</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Question</span>
                </button>
                <button onClick={() => addBlock('mood')} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-500 mb-2 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">sentiment_satisfied</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Mood</span>
                </button>
                <button onClick={() => addBlock('checklist')} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 mb-2 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">check_box</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Checklist</span>
                </button>
                <button onClick={() => addBlock('free_text')} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-500 mb-2 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">short_text</span>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Free Text</span>
                </button>
              </div>
            </div>

            {/* Blocks List */}
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id} className="group bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-1 hover:ring-2 ring-primary/50 transition-all flex gap-0 animate-fade-in-up">
                  <div className="w-10 flex flex-col items-center justify-center gap-1 border-r border-gray-50 dark:border-gray-800 mr-2">
                    <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="text-gray-300 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-300">
                      <span className="material-symbols-outlined">keyboard_arrow_up</span>
                    </button>
                    <span className="material-symbols-outlined text-gray-300 text-sm">drag_handle</span>
                    <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="text-gray-300 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-300">
                      <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </button>
                  </div>
                  <div className="flex-1 py-4 pr-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`material-symbols-outlined text-lg ${block.type === 'mood' ? 'text-amber-500' :
                              block.type === 'question' ? 'text-blue-500' :
                                block.type === 'checklist' ? 'text-emerald-500' : 'text-gray-500'
                            }`}>
                            {block.type === 'mood' ? 'sentiment_satisfied' :
                              block.type === 'question' ? 'help' :
                                block.type === 'checklist' ? 'check_box' : 'short_text'}
                          </span>
                          <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                            {block.type === 'mood' ? 'Mood Picker' :
                              block.type === 'question' ? 'Question' :
                                block.type === 'checklist' ? 'Checklist' : 'Free Text'}
                          </span>
                        </div>
                        <input
                          className="text-lg font-bold text-gray-900 dark:text-white bg-transparent border-0 border-b border-transparent hover:border-gray-200 focus:border-primary focus:ring-0 p-0 w-full transition-colors placeholder-gray-400"
                          type="text"
                          value={block.title}
                          onChange={(e) => updateBlockTitle(block.id, e.target.value)}
                        />
                      </div>
                      <button onClick={() => removeBlock(block.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Remove Block">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>

                    {/* Preview Content based on Type */}
                    {block.type === 'mood' && (
                      <div className="flex gap-4 opacity-50 pointer-events-none grayscale">
                        <div className="h-10 w-10 rounded-full bg-red-100"></div>
                        <div className="h-10 w-10 rounded-full bg-orange-100"></div>
                        <div className="h-10 w-10 rounded-full bg-yellow-100"></div>
                        <div className="h-10 w-10 rounded-full bg-green-100"></div>
                        <div className="h-10 w-10 rounded-full bg-emerald-100"></div>
                      </div>
                    )}
                    {block.type === 'question' && (
                      <div className="w-full h-24 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <span className="text-sm text-gray-400">User answer input preview</span>
                      </div>
                    )}
                    {block.type === 'checklist' && block.items && (
                      <div className="space-y-2">
                        {block.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 group/item">
                            <input className="rounded border-gray-300 text-primary focus:ring-primary" disabled type="checkbox" />
                            <input
                              className="text-sm bg-transparent border-none p-0 focus:ring-0 text-gray-600 dark:text-gray-300 w-full border-b border-transparent focus:border-gray-300"
                              type="text"
                              value={item}
                              onChange={(e) => updateChecklistItem(block.id, idx, e.target.value)}
                            />
                            <button onClick={() => removeChecklistItem(block.id, idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        ))}
                        <button onClick={() => addChecklistItem(block.id)} className="flex items-center gap-2 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-gray-400 hover:text-primary text-sm">add</span>
                          <span className="text-sm text-gray-400 hover:text-primary italic">Add checklist item...</span>
                        </button>
                      </div>
                    )}
                    {block.type === 'free_text' && (
                      <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Drop Zone Placeholder */}
            {blocks.length === 0 && (
              <div className="mt-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-3xl mb-1">post_add</span>
                <span className="text-sm font-medium">Start adding blocks from above</span>
              </div>
            )}

            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
