import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface EditorToolbarProps {
    editor: Editor | null;
    onImageUpload: () => void;
    onVoiceRecord: () => void;
    isRecording: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    editor,
    onImageUpload,
    onVoiceRecord,
    isRecording
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showFontMenu, setShowFontMenu] = useState(false);

    if (!editor) {
        return null;
    }

    const onEmojiClick = (emojiData: EmojiClickData) => {
        editor.chain().focus().insertContent(emojiData.emoji).run();
        setShowEmojiPicker(false);
    };

    const ToolbarButton = ({
        onClick,
        isActive = false,
        icon,
        tooltip,
        className = ''
    }: {
        onClick: () => void;
        isActive?: boolean;
        icon: string;
        tooltip: string;
        className?: string;
    }) => (
        <button
            onClick={onClick}
            title={tooltip}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                } ${className}`}
        >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </button>
    );

    const setFont = (font: string) => {
        editor.chain().focus().setFontFamily(font).run();
        setShowFontMenu(false);
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 transition-all duration-300">
            {/* Fonts */}
            <div className="relative">
                <button
                    onClick={() => setShowFontMenu(!showFontMenu)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <span>Font</span>
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
                {showFontMenu && (
                    <div className="absolute top-full left-0 mt-1 py-1 w-40 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 flex flex-col">
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowFontMenu(false)}
                        ></div>
                        <div className="relative z-50 flex flex-col">
                            <button
                                onClick={() => setFont('Inter, sans-serif')}
                                className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-sans"
                            >
                                Sans Serif
                            </button>
                            <button
                                onClick={() => setFont('serif')}
                                className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-serif"
                            >
                                Serif
                            </button>
                            <button
                                onClick={() => setFont('monospace')}
                                className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-mono"
                            >
                                Monospace
                            </button>
                            <button
                                onClick={() => setFont('cursive')}
                                className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-serif italic"
                            >
                                Cursive
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            {/* Text Style */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                icon="format_bold"
                tooltip="Bold"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                icon="format_italic"
                tooltip="Italic"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                icon="format_underlined"
                tooltip="Underline"
            />

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                icon="title"
                tooltip="Heading 1 (Big)"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon="format_h2"
                tooltip="Heading 2 (Medium)"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                icon="format_h3"
                tooltip="Heading 3 (Small)"
            />

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                icon="format_list_bulleted"
                tooltip="Bullet List"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                icon="format_list_numbered"
                tooltip="Ordered List"
            />

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

            {/* Media */}
            <ToolbarButton
                onClick={onImageUpload}
                icon="image"
                tooltip="Insert Image"
            />

            <div className="relative">
                <ToolbarButton
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    icon="sentiment_satisfied"
                    tooltip="Emoji"
                    isActive={showEmojiPicker}
                />
                {showEmojiPicker && (
                    <div className="absolute top-10 left-0 z-50">
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowEmojiPicker(false)}
                        ></div>
                        <div className="relative z-50 shadow-xl rounded-xl overflow-hidden">
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                theme={Theme.AUTO}
                                width={300}
                                height={400}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1"></div>

            {/* Voice */}
            <button
                onClick={onVoiceRecord}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${isRecording
                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                        : 'bg-primary/5 text-primary hover:bg-primary/10'
                    }`}
            >
                <span className="material-symbols-outlined text-[20px]">
                    {isRecording ? 'mic_off' : 'mic'}
                </span>
                <span className="text-xs font-bold">
                    {isRecording ? 'Recording...' : 'Voice Note'}
                </span>
            </button>
        </div>
    );
};
