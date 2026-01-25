import { db } from './db';
import { supabaseService } from '../services/supabaseService';
import { authService } from '../services/authService';

export const migrateDataToSupabase = async () => {
    const user = await authService.getCurrentUser();
    if (!user) return;

    // 1. Check if we have local entries
    const localEntriesCount = await db.journalEntries.count();
    const localMoodsCount = await db.moodCheckins.count();

    if (localEntriesCount === 0 && localMoodsCount === 0) {
        console.log("No local data to migrate.");
        return;
    }

    // 2. Check if we already have cloud entries (to avoid duplicates or re-migration)
    // Simple check: if cloud is empty, migrate everything.
    // robust check would be comparing IDs or a "migrated" flag in local DB.
    // For MVP, let's assume if cloud is empty, we push.
    const cloudEntries = await supabaseService.getEntries();
    if (cloudEntries.length > 0) {
        console.log("Cloud already has data. Skipping bulk migration to avoid duplicates.");
        // In a real app, we might prompt the user or do a smarter merge.
        return;
    }

    console.log("Starting migration...");

    // 3. Migrate Journal Entries
    const entries = await db.journalEntries.toArray();
    for (const entry of entries) {
        // Prepare entry for Supabase (e.g. ensure userId matches current user)
        const newEntry = {
            ...entry,
            userId: user.id, // Overwrite local ID with real Auth ID if needed, 
            // but we should probably keep the entry.userId if it was 'anonymous' and now claimed
        };
        await supabaseService.addEntry(newEntry);
    }

    // 4. Migrate Moods
    const moods = await db.moodCheckins.toArray();
    for (const mood of moods) {
        await supabaseService.addMood({
            ...mood,
            user_id: user.id
            // Map any schema differences if necessary
        });
    }

    console.log("Migration complete!");
    // Optional: clear local DB or mark as migrated
};
