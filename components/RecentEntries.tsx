import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '../types';

interface RecentEntriesProps {
  entries: JournalEntry[];
  onNewEntry: () => void;
}

export const RecentEntries: React.FC<RecentEntriesProps> = ({ entries, onNewEntry }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Entries</h3>
        <button
          onClick={() => navigate('/entries')}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
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
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
              {entry.excerpt.replace(/<[^>]*>/g, '')}
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

        {/* Add New Placeholder */}
        <button
          onClick={onNewEntry}
          className="bg-white dark:bg-card-dark p-5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-white/5 transition-all min-h-[200px]"
        >
          <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">add</span>
          </div>
          <p className="font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">Log a past moment</p>
          <p className="text-xs text-gray-400 mt-1">Add an entry for a previous date</p>
        </button>
      </div>
    </div>
  );
};
