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
        tooltip
    }: {
        onClick: () => void;
        isActive?: boolean;
        icon: string;
        tooltip: string
    }) => (
        <button
            onClick={onClick}
            title={tooltip}
            className={`p-2 rounded-lg transition-all ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
        >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 transition-all duration-300">
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
                tooltip="Heading 1"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon="format_h2"
                tooltip="Heading 2"
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
