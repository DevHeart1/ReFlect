import React from 'react';
import { PersonalInsights } from '../components/PersonalInsights';
import { WeeklyReportCard } from '../components/WeeklyReportCard';
import { JournalEntry } from '../types';
import { MoodCheckin } from '../utils/storage';

interface InsightsPageProps {
    entries: JournalEntry[];
    moods: MoodCheckin[];
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ entries, moods }) => {
    // Fetch last 7 days for the weekly report
    const recentEntries = entries.slice(0, 10);
    const recentMoods = moods.slice(0, 14);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <WeeklyReportCard entries={recentEntries} moods={recentMoods} />
            <PersonalInsights moods={moods} />
        </div>
    );
};
