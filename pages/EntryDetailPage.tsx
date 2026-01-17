import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JournalEntry } from '../types';

interface EntryDetailPageProps {
    entries: JournalEntry[];
    onDelete: (id: string) => void;
    onEdit: (id: string, title: string, content: string) => void;
}

export const EntryDetailPage: React.FC<EntryDetailPageProps> = ({ entries, onDelete, onEdit }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    const entry = entries.find(e => e.id === id);

    React.useEffect(() => {
        if (entry) {
            setEditedTitle(entry.title);
            setEditedContent(entry.excerpt);
        }
    }, [entry]);

    if (!entry) {
        return (
            <div className="p-6 lg:p-10 max-w-4xl mx-auto">
                <div className="text-center py-20">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">error</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Entry Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">The entry you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        onEdit(entry.id, editedTitle, editedContent);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this entry?')) {
            onDelete(entry.id);
            navigate('/');
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="font-medium">Back</span>
                </button>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                <span className="font-medium">Edit</span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                <span className="font-medium">Delete</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Entry Card */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`${entry.colorClass} p-3 rounded-xl`}>
                            <span className="material-symbols-outlined text-2xl">{entry.icon}</span>
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary outline-none pb-2"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{entry.title}</h1>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{entry.date}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                            {entry.type}
                        </span>
                        {entry.mood && (
                            <span className={`px-3 py-1 ${entry.colorClass} rounded-full text-xs font-bold uppercase tracking-wide`}>
                                {entry.mood}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isEditing ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full min-h-[400px] text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-y"
                            placeholder="Write your thoughts..."
                        />
                    ) : (
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {entry.excerpt}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                            <span>Last edited: {entry.date}</span>
                        </div>
                        <div className="flex gap-4">
                            {entry.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-xs font-medium">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
