import { MoodCheckin } from './storage';

export interface MoodStats {
    total: number;
    streak: number;
    topMoods: { mood: string; count: number; percentage: number }[];
    distribution: { mood: string; count: number }[];
    heatmap: { date: string; intensity: number }[];
}

export const analyzeMoods = (checkins: MoodCheckin[]): MoodStats => {
    const total = checkins.length;

    if (total === 0) {
        return {
            total: 0,
            streak: 0,
            topMoods: [],
            distribution: [],
            heatmap: []
        };
    }

    // --- Streak Calculation ---
    let streak = 0;
    if (total > 0) {
        const today = new Date().setHours(0, 0, 0, 0);
        const dates = checkins.map(c => new Date(c.date).setHours(0, 0, 0, 0));
        const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b - a);

        // Check if the most recent entry is today or yesterday to perform streak calc
        if (uniqueDates.length > 0) {
            if (uniqueDates[0] === today) {
                streak = 1;
                for (let i = 0; i < uniqueDates.length - 1; i++) {
                    const current = uniqueDates[i];
                    const next = uniqueDates[i + 1];
                    const diff = (current - next) / (1000 * 60 * 60 * 24);
                    if (diff === 1) streak++;
                    else break;
                }
            } else if (uniqueDates[0] === today - 86400000) {
                streak = 1; // Started/Continued yesterday
                for (let i = 0; i < uniqueDates.length - 1; i++) {
                    const current = uniqueDates[i];
                    const next = uniqueDates[i + 1];
                    const diff = (current - next) / (1000 * 60 * 60 * 24);
                    if (diff === 1) streak++;
                    else break;
                }
            } else {
                streak = 0;
            }
        }
    }

    // --- Distribution & Top Moods ---
    const counts: Record<string, number> = {};
    checkins.forEach(c => {
        counts[c.mood] = (counts[c.mood] || 0) + 1;
    });

    const distribution = Object.entries(counts).map(([mood, count]) => ({ mood, count }));

    const topMoods = distribution
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(item => ({
            ...item,
            percentage: Math.round((item.count / total) * 100)
        }));

    // --- Heatmap (Last 365 Days) --- 
    // Simplified for this demo: grouping by day
    const heatmap = checkins.map(c => ({
        date: c.date,
        intensity: c.moodValue
    }));

    return {
        total,
        streak,
        topMoods,
        distribution,
        heatmap
    };
};
