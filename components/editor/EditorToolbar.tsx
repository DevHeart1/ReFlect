import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface EditorToolbarProps {
    editor: Editor | null;
    onImageUpload: () => void;
    onVideoUpload: () => void;
    onAudioUpload: () => void;
    onYoutubeEmbed: () => void;
    onCameraCapture: () => void;
    onVoiceRecord: () => void;
    isRecording: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    editor,
    onImageUpload,
    onVideoUpload,
    onAudioUpload,
    onYoutubeEmbed,
    onCameraCapture,
    onVoiceRecord,
    isRecording
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
    const [showMediaMenu, setShowMediaMenu] = useState(false);

    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const toggleMediaMenu = () => setShowMediaMenu(!showMediaMenu);

    return (
        <div className={`p-2 bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 transition-all duration-300 flex flex-nowrap items-center gap-1 overflow-x-auto no-scrollbar`}>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors mr-2"
                title={isCollapsed ? "Expand Toolbar" : "Collapse Toolbar"}
            >
                <span className="material-symbols-outlined">{isCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</span>
            </button>

            {!isCollapsed && (
                <>
                    {/* Font Family */}
                    <div className="relative shrink-0">
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
                                    <button onClick={() => setFont('Manrope, sans-serif')} className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-sans">Manrope (Default)</button>
                                    <button onClick={() => setFont('Merriweather, serif')} className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-serif">Merriweather</button>
                                    <button onClick={() => setFont('Lobster, cursive')} className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-[Lobster]">Lobster</button>
                                    <button onClick={() => setFont('Roboto Mono, monospace')} className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-mono">Monospace</button>
                                    <button onClick={() => setFont('cursive')} className="px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 font-serif italic">Cursive</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Font Size */}
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-1"
                            title="Font Size"
                        >
                            <span className="w-5 text-center">{editor.getAttributes('textStyle').fontSize?.replace('px', '') || '16'}</span>
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                        {showFontSizeMenu && (
                            <div className="absolute top-full left-0 mt-1 py-1 w-20 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 flex flex-col max-h-48 overflow-y-auto">
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowFontSizeMenu(false)}
                                ></div>
                                <div className="relative z-50 flex flex-col">
                                    {['12', '14', '16', '18', '20', '24', '30', '36', '48', '60', '72'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                editor.chain().focus().setFontSize(`${size}px`).run();
                                                setShowFontSizeMenu(false);
                                            }}
                                            className={`px-3 py-1.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${editor.getAttributes('textStyle').fontSize === `${size}px` ? 'bg-primary/10 text-primary' : ''
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0"></div>

                    {/* Alignments */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        icon="format_align_left"
                        tooltip="Align Left"
                        className="shrink-0"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        icon="format_align_center"
                        tooltip="Align Center"
                        className="shrink-0"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        icon="format_align_right"
                        tooltip="Align Right"
                        className="shrink-0"
                    />

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0"></div>

                    {/* Basic Style */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon="format_bold"
                        tooltip="Bold"
                        className="shrink-0"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon="format_italic"
                        tooltip="Italic"
                        className="shrink-0"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        icon="format_underlined"
                        tooltip="Underline"
                        className="shrink-0"
                    />

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0"></div>

                    {/* Headings */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        icon="title"
                        tooltip="Heading 1"
                        className="shrink-0"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        icon="format_h2"
                        tooltip="Heading 2"
                        className="shrink-0"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        icon="format_h3"
                        tooltip="Heading 3"
                        className="shrink-0"
                    />

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0"></div>

                    {/* Lists */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        icon="format_list_bulleted"
                        tooltip="Bullet List"
                        className="shrink-0"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        icon="format_list_numbered"
                        tooltip="Ordered List"
                        className="shrink-0"
                    />

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0"></div>

                    {/* Media Menu */}
                    <div className="relative shrink-0">
                        <ToolbarButton
                            onClick={toggleMediaMenu}
                            icon="add_photo_alternate"
                            tooltip="Insert Media"
                            isActive={showMediaMenu}
                        />
                        {showMediaMenu && (
                            <div className="absolute top-10 left-0 z-50">
                                <div className="fixed inset-0 z-40" onClick={() => setShowMediaMenu(false)}></div>
                                <div className="relative z-50 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 flex flex-col gap-1 w-48">
                                    <button onClick={() => { onImageUpload(); setShowMediaMenu(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm text-left">
                                        <span className="material-symbols-outlined text-gray-500">image</span>
                                        Image Upload
                                    </button>
                                    <button onClick={() => { onVideoUpload(); setShowMediaMenu(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm text-left">
                                        <span className="material-symbols-outlined text-gray-500">movie</span>
                                        Video Upload
                                    </button>
                                    <button onClick={() => { onAudioUpload(); setShowMediaMenu(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm text-left">
                                        <span className="material-symbols-outlined text-gray-500">audio_file</span>
                                        Audio Upload
                                    </button>
                                    <button onClick={() => { onYoutubeEmbed(); setShowMediaMenu(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm text-left">
                                        <span className="material-symbols-outlined text-red-500">play_circle</span>
                                        YouTube Embed
                                    </button>
                                    <button onClick={() => { onCameraCapture(); setShowMediaMenu(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm text-left">
                                        <span className="material-symbols-outlined text-gray-500">photo_camera</span>
                                        Camera Capture
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Emoji */}
                    <div className="relative shrink-0">
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

                    <div className="flex-1 min-w-4"></div>

                    {/* Voice */}
                    <button
                        onClick={onVoiceRecord}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all shrink-0 whitespace-nowrap ${isRecording
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
                </>
            )}
        </div>
    );
};

