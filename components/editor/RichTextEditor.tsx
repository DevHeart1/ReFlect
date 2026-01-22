import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { Node, mergeAttributes } from '@tiptap/core';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import Typography from '@tiptap/extension-typography';
import { AutoCapitalize } from './extensions/AutoCapitalize';

import { EditorToolbar } from './EditorToolbar';
import { YouTubeModal } from './YouTubeModal';
import { CameraModal } from './CameraModal';

import { Extension } from '@tiptap/core';

// --- Custom Font Size Extension ---
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {}
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run()
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run()
            },
        }
    },
});

// --- Custom Video Node ---
const VideoNode = Node.create({
    name: 'video',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'video',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(HTMLAttributes, { controls: 'true', class: 'w-full max-h-[400px] rounded-xl my-4' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(({ node }) => (
            <NodeViewWrapper className="my-4">
                <video controls src={node.attrs.src} className="w-full max-h-[400px] rounded-xl border border-gray-100 dark:border-gray-700 bg-black" />
            </NodeViewWrapper>
        ))
    },
});

// --- Custom Audio Extension ---
const AudioNode = Node.create({
    name: 'audio',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'audio',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['audio', mergeAttributes(HTMLAttributes, { controls: 'true' })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(({ node }) => (
            <NodeViewWrapper className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">mic</span>
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Voice Note</p>
                    <audio controls src={node.attrs.src} className="w-full h-8" />
                </div>
            </NodeViewWrapper>
        ))
    },
});

// --- Custom Mood Node ---
// --- Custom Mood Node ---
const MoodNode = Node.create({
    name: 'moodPicker',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            selection: {
                default: 0,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'mood-picker',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['mood-picker', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(({ node, updateAttributes }) => {
            const selection = node.attrs.selection;

            // Exact match from DailyMoodTracker.tsx
            const moods = [
                { value: 1, label: 'Distressed', icon: 'thunderstorm', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-400', ring: 'ring-rose-400' },
                { value: 2, label: 'Low', icon: 'rainy', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-400', ring: 'ring-blue-400' },
                { value: 3, label: 'Neutral', icon: 'sentiment_neutral', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-700', border: 'border-gray-400', ring: 'ring-gray-400' },
                { value: 4, label: 'Content', icon: 'sentiment_satisfied', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-400', ring: 'ring-emerald-400' },
                { value: 5, label: 'Radiant', icon: 'sunny', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-400', ring: 'ring-amber-400' },
            ];

            return (
                <NodeViewWrapper className="my-6 p-6 bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4 items-center justify-center select-none data-[selected=true]:ring-2 ring-primary/20 transition-all">
                    <div className="flex flex-wrap justify-center gap-4">
                        {moods.map((mood) => {
                            const isSelected = selection === mood.value;
                            return (
                                <button
                                    key={mood.value}
                                    onClick={() => updateAttributes({ selection: mood.value })}
                                    className={`group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1 focus:outline-none`}
                                    title={mood.label}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2
                                        ${mood.bg} 
                                        ${isSelected ? `${mood.border} ring-2 ring-offset-2 ${mood.ring} dark:ring-offset-card-dark scale-110 shadow-md` : 'border-transparent opacity-70 hover:opacity-100'} 
                                    `}>
                                        <span className={`material-symbols-outlined text-2xl ${mood.color}`}>{mood.icon}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {mood.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </NodeViewWrapper>
            )
        })
    },
});

interface RichTextEditorProps {
    content: string;
    onUpdate: (content: string) => void;
    onEditorReady?: (editor: any) => void;
    placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    content,
    onUpdate,
    onEditorReady,
    placeholder = 'Start writing...'
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [showYoutubeModal, setShowYoutubeModal] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Underline,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image', 'video'],
            }),
            Youtube.configure({
                controls: false,
                nocookie: true,
            }),
            AudioNode,
            VideoNode,
            MoodNode,
            Typography,
            AutoCapitalize,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());
        },
        onCreate: ({ editor }) => {
            if (onEditorReady) onEditorReady(editor);
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[60vh] text-xl md:text-2xl leading-relaxed font-serif text-gray-700 dark:text-gray-200',
            },
        },
    });

    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            if (editor.isEmpty) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);


    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const src = event.target?.result as string;
                    if (editor) {
                        editor.chain().focus().setImage({ src }).run();
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleVideoUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                editor?.chain().focus().insertContent({
                    type: 'video',
                    attrs: { src: url }
                }).run();
            }
        };
        input.click();
    };

    const handleAudioUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                editor?.chain().focus().insertContent({
                    type: 'audio',
                    attrs: { src: url }
                }).run();
            }
        };
        input.click();
    };

    const handleCameraCapture = () => {
        setShowCameraModal(true);
    };

    const handleCameraImage = (src: string) => {
        if (editor) {
            editor.chain().focus().setImage({ src }).run();
        }
    };

    const handleYoutubeEmbed = () => {
        setShowYoutubeModal(true);
    };

    const handleYoutubeInsert = (url: string) => {
        if (editor) {
            editor.commands.setYoutubeVideo({ src: url });
        }
    };

    const handleVoiceRecord = async () => {
        if (isRecording) {
            // Stop recording
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                chunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunksRef.current.push(e.data);
                    }
                };

                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    editor?.chain().focus().insertContent({
                        type: 'audio',
                        attrs: { src: url }
                    }).run();

                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access microphone. Please ensure permissions are granted.");
            }
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <EditorToolbar
                editor={editor}
                onImageUpload={handleImageUpload}
                onVideoUpload={handleVideoUpload}
                onAudioUpload={handleAudioUpload}
                onYoutubeEmbed={handleYoutubeEmbed}
                onCameraCapture={handleCameraCapture}
                onVoiceRecord={handleVoiceRecord}
                isRecording={isRecording}
            />
            <EditorContent editor={editor} />

            <YouTubeModal
                isOpen={showYoutubeModal}
                onClose={() => setShowYoutubeModal(false)}
                onInsert={handleYoutubeInsert}
            />

            <CameraModal
                isOpen={showCameraModal}
                onClose={() => setShowCameraModal(false)}
                onCapture={handleCameraImage}
            />
        </div>
    );
};
