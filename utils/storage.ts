import { JournalEntry } from '../types';

const STORAGE_KEY = 'reflect_journal_entries';
const MOOD_CHECKINS_KEY = 'reflect_mood_checkins';

// --- Types ---

export interface MoodCheckin {
    id: string;
    date: string; // ISO string
    mood: string; // Label: 'Radiant', 'Content', etc.
    moodValue: number; // 1-5
    secondaryEmotions: string[];
    factors: string[];
    note: string;
}

// --- Helpers ---

export const getMoodValue = (label: string): number => {
    const map: Record<string, number> = {
        'Distressed': 1,
        'Low': 2,
        'Neutral': 3,
        'Content': 4,
        'Radiant': 5,
    };
    return map[label] || 3;
};

// --- Storage Functions ---

export const getMoodCheckins = (): MoodCheckin[] => {
    try {
        const data = localStorage.getItem(MOOD_CHECKINS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error loading mood checkins', e);
        return [];
    }
};

export const saveMoodCheckin = (checkin: Omit<MoodCheckin, 'id' | 'date'>) => {
    const checkins = getMoodCheckins();
    const newCheckin: MoodCheckin = {
        ...checkin,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
    };

    // Prepend to array (newest first)
    const updated = [newCheckin, ...checkins];
    localStorage.setItem(MOOD_CHECKINS_KEY, JSON.stringify(updated));
    return newCheckin;
};

// Also basic journal helpers if needed later
export const getJournalEntries = (): JournalEntry[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error loading journal entries', e);
        return [];
    }
};
