import Dexie, { Table } from 'dexie';
import { JournalEntry, Template } from '../types';
import { AppSettings, UserProfile, MoodCheckin, DEFAULT_SETTINGS, DEFAULT_PROFILE } from './storage';

export class ReflectDatabase extends Dexie {
    journalEntries!: Table<JournalEntry, string>;
    moodCheckins!: Table<MoodCheckin, string>;
    settings!: Table<AppSettings & { id: string }, string>;
    profile!: Table<UserProfile & { id: string }, string>;
    templates!: Table<Template, string>;

    constructor() {
        super('ReflectDB');
        this.version(1).stores({
            journalEntries: 'id, date, type, mood',
            moodCheckins: 'id, date, mood, moodValue',
            settings: 'id',
            profile: 'id',
            templates: 'id, category'
        });
    }
}

export const db = new ReflectDatabase();

export const initDatabase = async (initialTemplates?: Template[]) => {
    // Check if data exists, if not, try to migrate from localStorage or seed defaults
    const profileCount = await db.profile.count();

    if (profileCount === 0) {
        // Migrate Profile
        const localProfile = localStorage.getItem('reflect_user_profile');
        const profileData = localProfile ? JSON.parse(localProfile) : DEFAULT_PROFILE;
        await db.profile.put({ ...profileData, id: 'current' });

        // Migrate Settings
        const localSettings = localStorage.getItem('reflect_app_settings');
        const settingsData = localSettings ? JSON.parse(localSettings) : DEFAULT_SETTINGS;
        await db.settings.put({ ...settingsData, id: 'global' });

        // Migrate Moods
        const localMoods = localStorage.getItem('reflect_mood_checkins');
        if (localMoods) {
            const moods = JSON.parse(localMoods);
            await db.moodCheckins.bulkPut(moods);
        }

        // Migrate Entries
        const localEntries = localStorage.getItem('reflect_journal_entries');
        if (localEntries) {
            const entries = JSON.parse(localEntries);
            await db.journalEntries.bulkPut(entries);
        }
    }

    // Seed Templates if empty
    if (initialTemplates && (await db.templates.count() === 0)) {
        await db.templates.bulkPut(initialTemplates);
    }
};
