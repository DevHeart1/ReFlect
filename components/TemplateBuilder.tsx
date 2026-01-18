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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Template | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleSave = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name.");
      return;
    }

    // Find theme based on selected color
    const theme = colors.find(c => c.class === selectedColor)?.theme || colors[0].theme;

    const template: Template = {
      id: `custom-${Date.now()}`,
      title: templateName,
      description: `${category} template with ${blocks.length} blocks.`,
      category,
      icon: selectedIcon, // Use emoji or icon name
      colorTheme: theme,
      blocks: blocks
    };

    setNewTemplate(template);
    setShowSuccessModal(true);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedIcon(emojiData.emoji);
    setShowIconPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#191919] relative overflow-hidden font-sans">

      {/* Top Navigation Bar */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#191919]/80 backdrop-blur-md z-30 transition-all">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="text-sm font-medium text-gray-400">/ Templates / <span className="text-gray-900 dark:text-gray-200">{templateName || 'Untitled'}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded shadow-sm hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-3xl mx-auto px-12 py-12 pb-32 min-h-[calc(100vh-3.5rem)] flex flex-col relative group/page">

          {/* Header Section (Cover, Icon, Title) */}
          <div className="group/header relative mb-8 animate-fade-in-up">
            {/* Icon Trigger */}
            <div className="relative mb-6">
              <button
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="text-7xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors cursor-pointer select-none"
              >
                {selectedIcon.match(/^[a-z_]+$/) ? (
                  <span className="material-symbols-outlined text-7xl text-gray-800 dark:text-gray-200">{selectedIcon}</span>
                ) : (
                  <span>{selectedIcon}</span>
                )}
              </button>
              {showIconPicker && (
                <div className="absolute top-full left-0 mt-2 z-50">
                  <div className="fixed inset-0 z-40" onClick={() => setShowIconPicker(false)}></div>
                  <div className="relative z-50 shadow-xl rounded-xl overflow-hidden">
                    <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.AUTO} width={300} height={400} />
                  </div>
                </div>
              )}
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Untitled"
              className="w-full text-4xl font-bold text-[#37352f] dark:text-gray-100 placeholder:text-gray-300 bg-transparent border-none p-0 focus:ring-0 resize-none font-display mb-4"
            />

            {/* Metadata Row (Category, Color) */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2 group/meta relative">
                <span className="material-symbols-outlined text-[18px] text-gray-400">folder_open</span>
                <span className="font-medium">Category:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent border-none p-0 pr-6 focus:ring-0 text-gray-900 dark:text-gray-200 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 transition-colors"
                >
                  <option>Mindfulness</option>
                  <option>Productivity</option>
                  <option>Emotional Growth</option>
                  <option>General</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-gray-400">palette</span>
                <span className="font-medium">Theme:</span>
                <div className="flex gap-1">
                  {colors.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.class)}
                      className={`w-4 h-4 rounded-full ${c.bg} ${selectedColor === c.class ? 'ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600' : 'opacity-50 hover:opacity-100'}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-gray-800 mt-6 box-border"></div>
          </div>

          {/* Blocks Area */}
          <div className="flex flex-col gap-[2px]">
            {blocks.map((block, index) => (
              <div key={block.id} className="group/block relative flex items-start -ml-10 pl-2 pr-2 py-1 hover:bg-gray-50 dark:hover:bg-[#202020] rounded transition-colors">

                {/* Hover Gutter (Drag Handle & Actions) */}
                <div className="absolute left-0 top-1.5 w-8 flex items-center justify-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                  <div className="flex items-center">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5 disabled:opacity-30"><span className="material-symbols-outlined text-[14px] text-gray-400">keyboard_arrow_up</span></button>
                      <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5 disabled:opacity-30"><span className="material-symbols-outlined text-[14px] text-gray-400">keyboard_arrow_down</span></button>
                    </div>
                    <button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 text-gray-400 rounded transition-colors" title="Delete Block">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Block Content */}
                <div className="flex-1 w-full pl-2">
                  {/* Block Logic Render */}
                  {block.type === 'question' && (
                    <div className="mb-2">
                      <input
                        value={block.title}
                        onChange={(e) => updateBlockTitle(block.id, e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-lg font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-300 focus:ring-0 focus:bg-gray-100 dark:focus:bg-gray-800 px-2 -mx-2 rounded"
                        placeholder="Type a question..."
                      />
                      <div className="mt-1 px-3 py-2 text-sm text-gray-400 italic bg-gray-50/50 dark:bg-gray-800/20 rounded border border-transparent border-dashed">Empty answer block</div>
                    </div>
                  )}

                  {block.type === 'mood' && (
                    <div className="mb-2">
                      <input
                        value={block.title}
                        onChange={(e) => updateBlockTitle(block.id, e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-base font-medium text-gray-700 dark:text-gray-300 placeholder-gray-300 focus:ring-0 focus:bg-gray-100 dark:focus:bg-gray-800 px-2 -mx-2 rounded"
                        placeholder="Mood tracker title..."
                      />
                      <div className="mt-2 flex gap-3 opacity-50 pointer-events-none grayscale-[0.5]">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>)}
                      </div>
                    </div>
                  )}

                  {block.type === 'checklist' && (
                    <div className="mb-2">
                      <input
                        value={block.title}
                        onChange={(e) => updateBlockTitle(block.id, e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-lg font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-300 focus:ring-0 focus:bg-gray-100 dark:focus:bg-gray-800 px-2 -mx-2 rounded mb-2"
                        placeholder="Checklist title..."
                      />
                      {block.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-1 group/item">
                          <div className="w-4 h-4 rounded-[3px] border-2 border-gray-300 dark:border-gray-600"></div>
                          <input
                            value={item}
                            onChange={(e) => updateChecklistItem(block.id, idx, e.target.value)}
                            className="flex-1 bg-transparent border-none p-0 text-sm text-gray-700 dark:text-gray-300 focus:ring-0 border-b border-transparent focus:border-gray-300 placeholder-gray-300"
                            placeholder="List item"
                          />
                          <button onClick={() => removeChecklistItem(block.id, idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100"><span className="material-symbols-outlined text-[14px]">close</span></button>
                        </div>
                      ))}
                      <button onClick={() => addChecklistItem(block.id)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary mt-1">
                        <span className="material-symbols-outlined text-[14px]">add</span> New item
                      </button>
                    </div>
                  )}

                  {block.type === 'free_text' && (
                    <div className="mb-2">
                      <input
                        value={block.title}
                        onChange={(e) => updateBlockTitle(block.id, e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-xl font-bold text-gray-900 dark:text-white placeholder-gray-300 focus:ring-0 focus:bg-gray-100 dark:focus:bg-gray-800 px-2 -mx-2 rounded"
                        placeholder="Heading..."
                      />
                      <p className="text-gray-400 text-sm mt-1 px-1">Free text area...</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Add Menu (Bottom) */}
            <div className="mt-4 relative group/add">
              <div className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors cursor-pointer group/btn" onClick={() => setShowAddMenu(!showAddMenu)}>
                <span className="material-symbols-outlined text-2xl group-hover/btn:bg-primary/10 rounded p-1 transition-all">add</span>
                <span className="text-sm font-medium">Click to add a block</span>
              </div>

              {showAddMenu && (
                <div className="absolute top-8 left-0 w-64 bg-white dark:bg-[#202020] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 z-50 animate-fade-in-up">
                  <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)}></div>
                  <div className="relative z-50">
                    <div className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Basic Blocks</div>
                    <button onClick={() => { addBlock('question'); setShowAddMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left">
                      <span className="material-symbols-outlined text-blue-500">help</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Question</div>
                        <div className="text-[10px] text-gray-500">A clear prompt for reflection</div>
                      </div>
                    </button>
                    <button onClick={() => { addBlock('mood'); setShowAddMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left">
                      <span className="material-symbols-outlined text-amber-500">sentiment_satisfied</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Mood</div>
                        <div className="text-[10px] text-gray-500">Track emotional state</div>
                      </div>
                    </button>
                    <button onClick={() => { addBlock('checklist'); setShowAddMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left">
                      <span className="material-symbols-outlined text-emerald-500">check_box</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Checklist</div>
                        <div className="text-[10px] text-gray-500">To-do items or habits</div>
                      </div>
                    </button>
                    <button onClick={() => { addBlock('free_text'); setShowAddMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left">
                      <span className="material-symbols-outlined text-gray-500">short_text</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Free Text</div>
                        <div className="text-[10px] text-gray-500">Open writing space</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && newTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-[#202020] rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up text-center border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4 mx-auto">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Template Created!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              <strong>{newTemplate.title}</strong> has been added to your collection.
            </p>
            <button
              onClick={() => {
                if (newTemplate) {
                  onSave(newTemplate);
                }
              }}
              className="w-full py-3 rounded-lg font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Go to Templates
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
