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

// --- Settings & Profile ---

export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timeZone: string;
    fontSize: number;
    highContrast: boolean;
    screenReader: boolean;
    // Privacy
    biometricEnabled: boolean;
    autoLockTimer: string;
    aiPersonalization: boolean;
    anonymousData: boolean;
    // Notifications
    dailyReminders: boolean;
    reminderTime: string;
    aiAlerts: boolean;
    emailSummaries: boolean;
    systemNotifications: boolean;
}

export interface UserProfile {
    name: string;
    email: string;
    avatarUrl: string;
    isPro: boolean;
}

const SETTINGS_KEY = 'reflect_app_settings';
const PROFILE_KEY = 'reflect_user_profile';

export const DEFAULT_SETTINGS: AppSettings = {
    theme: 'system',
    language: 'English (US)',
    timeZone: '(UTC-08:00) Pacific',
    fontSize: 2,
    highContrast: false,
    screenReader: false,
    biometricEnabled: true,
    autoLockTimer: '15 Minutes',
    aiPersonalization: true,
    anonymousData: false,
    dailyReminders: true,
    reminderTime: '20:00',
    aiAlerts: true,
    emailSummaries: false,
    systemNotifications: true
};

export const DEFAULT_PROFILE: UserProfile = {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTl5DKtYfek9G5GdtwQpurwPvAdBPXO6LSY36hAsHY0m7xTNZrUd0e620Hkl8NSFQBlbQXFQRlP3Of2DmydzlnuUxsfsZerVHfrl5IreHcp5HRi89WnvgEG2LZ-e9AZFoBllf4b8LX5RASB6P-yvuPhNU6Tfkv7UDgjmQMz2Oeom77Rg30sbW8AOUXh6IbJ5WtkcahJRsPGvRNCIAGZOkqntuIIKwKyNC-mTJA-PEumaay9IYs7LbRhAowE5u6hBZ8XuTDiyKWYnVg',
    isPro: true
};

export const getAppSettings = (): AppSettings => {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
        return DEFAULT_SETTINGS;
    }
};

export const saveAppSettings = (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getUserProfile = (): UserProfile => {
    try {
        const data = localStorage.getItem(PROFILE_KEY);
        return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch (e) {
        return DEFAULT_PROFILE;
    }
};

export const saveUserProfile = (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('profile-updated'));
};

export const clearUserSession = () => {
    // Clear all app-related data
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(MOOD_CHECKINS_KEY);
    localStorage.removeItem(STORAGE_KEY);
    // Force reload to reset state
    window.location.reload();
};
