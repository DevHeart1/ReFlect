import React, { useMemo } from 'react';
import { PersonalInsights } from '../components/PersonalInsights';
import { WeeklyReportCard } from '../components/WeeklyReportCard';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/db';
import { MoodCheckin } from '../services/geminiService'; // Ensure this type is imported correctly
// If MoodCheckin is only in service, use it. If it's in storage, import from storage.
// Checking previous files, MoodCheckin is exported from geminiService.ts (which is weird, usually types.ts or storage.ts)
// Wait, I saw MoodCheckin in geminiService.ts in Step 253.
// But it was also in storage.ts. I should prefer one or check if they are same.
// In Step 253 I added `export interface MoodCheckin` to geminiService.ts but it was already in storage.ts.
// I should rely on the storage.ts one to avoid duplicates if possible, or just use the one I imported in WeeklyReportCard.

export const InsightsPage: React.FC = () => {
    // Fetch last 7 days for the weekly report
    const recentEntries = useLiveQuery(() => db.journalEntries.orderBy('date').reverse().limit(10).toArray()) || [];
    const recentMoods = useLiveQuery(() => db.moodCheckins.orderBy('date').reverse().limit(14).toArray()) as unknown as MoodCheckin[] || [];

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <WeeklyReportCard entries={recentEntries} moods={recentMoods} />
            <PersonalInsights />
        </div>
    );
};
