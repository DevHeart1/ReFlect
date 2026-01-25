import { supabase } from '../utils/supabaseClient';
import { JournalEntry, Template } from '../types';
import { MoodCheckin, AppSettings, UserProfile } from '../utils/storage';

export const supabaseService = {
    // --- Journal Entries ---
    async getEntries(): Promise<JournalEntry[]> {
        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        // Convert DB (snake_case) to App (camelCase)
        // journal_entry columns: id, user_id, title, content, mood, date, type, etc. (assuming we match columns broadly or map them)
        // IMPORTANT: We need to ensure the DB schema supports these columns.
        // Ideally we should have defined the DB columns to match the App types strictly or mapped them.
        // Let's assume for now we mapped columns:
        // user_id -> userId
        // mood_data -> mood (if we decided to use jsonb for complexity, but let's stick to simple mapping for now)

        return data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            title: d.title,
            content: d.content,
            excerpt: d.excerpt,
            date: d.date,
            tags: d.tags || [],
            type: d.type,
            mood: d.mood, // Assuming simple string column for now to match App
            icon: d.icon,
            colorClass: d.color_class, // snake_case in DB
        })) as JournalEntry[];
    },

    async addEntry(entry: JournalEntry) {
        const dbEntry = {
            id: entry.id,
            user_id: entry.userId,
            title: entry.title,
            content: entry.content,
            excerpt: entry.excerpt,
            date: entry.date,
            tags: entry.tags,
            type: entry.type,
            mood: entry.mood,
            icon: entry.icon,
            color_class: entry.colorClass // Map to snake_case
        };

        const { error } = await supabase
            .from('journal_entries')
            .upsert(dbEntry);

        if (error) throw error;
    },

    async updateEntry(id: string, updates: Partial<JournalEntry>) {
        // Map updates to snake_case
        const dbUpdates: any = { ...updates };
        if (updates.userId) { dbUpdates.user_id = updates.userId; delete dbUpdates.userId; }
        if (updates.colorClass) { dbUpdates.color_class = updates.colorClass; delete dbUpdates.colorClass; }

        const { error } = await supabase
            .from('journal_entries')
            .update(dbUpdates)
            .eq('id', id);

        if (error) throw error;
    },

    async deleteEntry(id: string) {
        const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Moods ---
    async getMoods(): Promise<MoodCheckin[]> {
        const { data, error } = await supabase
            .from('mood_checkins')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;

        return data.map((d: any) => ({
            id: d.id,
            date: d.date,
            mood: d.mood_label, // Map from DB
            moodValue: d.mood_score,
            secondaryEmotions: d.secondary_emotions || [],
            factors: d.factors || [],
            note: d.note
        })) as MoodCheckin[];
    },

    async addMood(mood: MoodCheckin & { user_id: string }) {
        const dbMood = {
            id: mood.id,
            user_id: mood.user_id,
            date: mood.date,
            mood_label: mood.mood,
            mood_score: mood.moodValue,
            secondary_emotions: mood.secondaryEmotions,
            factors: mood.factors,
            note: mood.note
        };

        const { error } = await supabase
            .from('mood_checkins')
            .upsert(dbMood);

        if (error) throw error;
    },

    // --- Profile & Settings ---
    // Syncs handled via profiles table triggers or direct updates
    async getUserSettings(userId: string): Promise<AppSettings | null> {
        const { data } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (!data) return null;

        // Map snake_case to camelCase
        return {
            theme: data.theme,
            language: data.language,
            timeZone: data.time_zone,
            fontSize: data.font_size,
            highContrast: data.high_contrast,
            screenReader: data.screen_reader,
            biometricEnabled: data.biometric_enabled,
            autoLockTimer: data.auto_lock_timer,
            aiPersonalization: data.ai_personalization,
            anonymousData: data.anonymous_data,
            dailyReminders: data.daily_reminders,
            reminderTime: data.reminder_time,
            aiAlerts: data.ai_alerts,
            emailSummaries: data.email_summaries,
            systemNotifications: data.system_notifications
        } as AppSettings;
    },

    async updateUserSettings(userId: string, settings: Partial<AppSettings>) {
        // Map back
        const dbSettings: any = {};
        const map: Record<string, string> = {
            timeZone: 'time_zone',
            fontSize: 'font_size',
            highContrast: 'high_contrast',
            screenReader: 'screen_reader',
            biometricEnabled: 'biometric_enabled',
            autoLockTimer: 'auto_lock_timer',
            aiPersonalization: 'ai_personalization',
            anonymousData: 'anonymous_data',
            dailyReminders: 'daily_reminders',
            reminderTime: 'reminder_time',
            aiAlerts: 'ai_alerts',
            emailSummaries: 'email_summaries',
            systemNotifications: 'system_notifications'
        };

        Object.keys(settings).forEach(key => {
            const dbKey = map[key] || key; // Default to key if not in map (e.g. theme, language)
            dbSettings[dbKey] = (settings as any)[key];
        });

        const { error } = await supabase
            .from('user_settings')
            .upsert({ user_id: userId, ...dbSettings });

        if (error) throw error;
    }
};
