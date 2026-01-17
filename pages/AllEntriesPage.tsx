import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '../types';

interface AllEntriesPageProps {
    entries: JournalEntry[];
}

export const AllEntriesPage: React.FC<AllEntriesPageProps> = ({ entries }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterMood, setFilterMood] = useState<string>('all');

    // Get unique types and moods for filters
    const types = ['all', ...Array.from(new Set(entries.map(e => e.type)))];
    const moods = ['all', ...Array.from(new Set(entries.filter(e => e.mood).map(e => e.mood!)))];

    // Filter entries
    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || entry.type === filterType;
        const matchesMood = filterMood === 'all' || entry.mood === filterMood;
        return matchesSearch && matchesType && matchesMood;
    });

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Entries</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{filteredEntries.length} entries found</p>
                </div>
                <button
                    onClick={() => navigate('/editor')}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span className="font-medium">New Entry</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-1">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input
                                type="text"
                                placeholder="Search entries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        >
                            {types.map(type => (
                                <option key={type} value={type}>
                                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mood Filter */}
                    <div>
                        <select
                            value={filterMood}
                            onChange={(e) => setFilterMood(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        >
                            {moods.map(mood => (
                                <option key={mood} value={mood}>
                                    {mood === 'all' ? 'All Moods' : mood}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Entries Grid */}
            {filteredEntries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEntries.map((entry) => (
                        <div
                            key={entry.id}
                            onClick={() => navigate(`/entry/${entry.id}`)}
                            className="bg-card-light dark:bg-card-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`${entry.colorClass} p-2 rounded-lg transition-transform group-hover:scale-105`}>
                                    <span className="material-symbols-outlined text-[20px]">{entry.icon}</span>
                                </div>
                                <span className="text-xs font-medium text-gray-400">{entry.date}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{entry.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                                {entry.excerpt}
                            </p>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                    {entry.type}
                                </span>
                                {entry.mood && (
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        {entry.mood}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No entries found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};
