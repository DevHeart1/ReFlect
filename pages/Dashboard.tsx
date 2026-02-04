import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoodChart } from '../components/MoodChart';
import { RecentEntries } from '../components/RecentEntries';
import { JournalEntry } from '../types';
import { generateDailyQuote, generateQuickPrompts, DailyQuote, QuickPrompt } from '../services/geminiService';
import { DEFAULT_PROFILE, MoodCheckin, getUserProfile } from '../utils/storage';
import { authService } from '../services/authService';

interface DashboardProps {
    entries: JournalEntry[];
    moods: MoodCheckin[];
}

export const Dashboard: React.FC<DashboardProps> = ({ entries, moods }) => {
    const navigate = useNavigate();
    const [quote, setQuote] = useState<DailyQuote | null>(null);
    const [quickPrompts, setQuickPrompts] = useState<QuickPrompt[] | null>(null);
    const [profile, setProfile] = useState(() => {
        // Initialize from local storage if available for instant render
        const { getUserProfile } = require('../utils/storage'); // Using require or we can import it at top if not there. 
        // Wait, Dashboard has it imported? Let's check imports.
        // Line 7 imports DEFAULT_PROFILE, MoodCheckin. Need to add getUserProfile.
        const local = getUserProfile();
        return (local && local.email !== 'guest@example.com') ? local : DEFAULT_PROFILE;
    });

    // Calculate Mood Metrics
    const moodMetrics = useMemo(() => {
        if (!moods || moods.length === 0) {
            return {
                currentState: 'Neutral',
                trend: 0,
                trendLabel: 'Steady'
            };
        }

        // Sort moods by date descending
        const sortedMoods = [...moods].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const currentState = sortedMoods[0].mood;

        // Calculate Trend (Avg of last 3 days vs previous 3 days)
        // Group by day first to avoid weighting one day with many entries too heavily?
        // Let's just do simple average of values for now for simplicity, or day-based.
        // Let's do simple average of last 3 entries vs previous 3 entries if available.
        // Better: Avg of last 3 days vs previous 3 days.

        // Helper to get day averages
        const getDayAvgs = () => {
            const dayMap = new Map<string, number[]>();
            sortedMoods.forEach(m => {
                const d = new Date(m.date).toDateString();
                if (!dayMap.has(d)) dayMap.set(d, []);
                dayMap.get(d)?.push(m.moodValue);
            });

            const days = Array.from(dayMap.entries()).map(([date, values]) => ({
                date: new Date(date),
                avg: values.reduce((a, b) => a + b, 0) / values.length
            })).sort((a, b) => b.date.getTime() - a.date.getTime()); // Descending
            return days;
        };

        const dayAvgs = getDayAvgs();

        let trend = 0;
        if (dayAvgs.length >= 2) {
            // Compare last 3 days (or fewer) to previous 3
            const currentPeriod = dayAvgs.slice(0, 3);
            const prevPeriod = dayAvgs.slice(3, 6); // next 3

            if (currentPeriod.length > 0 && prevPeriod.length > 0) {
                const curAvg = currentPeriod.reduce((a, b) => a + b.avg, 0) / currentPeriod.length;
                const prevAvg = prevPeriod.reduce((a, b) => a + b.avg, 0) / prevPeriod.length;

                // Diff percentage based on max value 5
                trend = Math.round(((curAvg - prevAvg) / 5) * 100);
            }
        }

        return {
            currentState,
            trend,
            trendLabel: trend > 0 ? 'Improving' : trend < 0 ? 'Declining' : 'Steady'
        };

    }, [moods]);


    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            // 1. Try local storage first for instant render
            try {
                const { getUserProfile } = await import('../utils/storage');
                const localProfile = getUserProfile();
                if (localProfile && localProfile.email !== 'guest@example.com') {
                    setProfile(localProfile);
                }
            } catch (e) { /* ignore */ }

            // 2. Then fetch fresh from Auth
            const user = await authService.getCurrentUser();
            if (user) {
                setProfile({
                    name: user.name,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    isPro: user.isPro
                });
            }
        };
        fetchProfile();

        // Listen for auth changes
        const handleAuthChange = () => {
            fetchProfile();
        };
        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('profile-updated', handleAuthChange);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('profile-updated', handleAuthChange);
        };
    }, []);

    useEffect(() => {
        const fetchAIContent = async () => {
            const [fetchedQuote, fetchedPrompts] = await Promise.all([
                generateDailyQuote(),
                generateQuickPrompts()
            ]);
            setQuote(fetchedQuote);
            setQuickPrompts(fetchedPrompts);
        };
        fetchAIContent();
    }, []);

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
            {/* 1. Header Section (Greeting) */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
                <div className="flex flex-col gap-1 max-w-2xl">
                    <h2 className="text-4xl font-black tracking-tight text-[#131516] dark:text-white leading-tight">
                        {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {profile.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Here's your daily overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                        Today: <span className="text-primary dark:text-primary-light font-bold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </span>
                    <button
                        onClick={() => navigate('/notifications')}
                        className="p-2 bg-white dark:bg-white/5 rounded-full text-gray-500 hover:text-primary transition-colors shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                </div>
            </section>

            {/* 2. Daily Quote Section (AI Generated) */}
            <section className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-xl animate-fade-in-up delay-75 shadow-sm">
                <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl mt-1">format_quote</span>
                    <div>
                        <p className="text-xl font-serif text-gray-800 dark:text-gray-200 italic leading-relaxed">
                            {quote ? `"${quote.quote}"` : <span className="animate-pulse">Loading...</span>}
                        </p>
                        <p className="text-sm font-bold text-gray-500 mt-2 tracking-wide uppercase">
                            — {quote?.author || 'AI'}
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Quick Links Section (New) */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-100">
                <button
                    onClick={() => navigate('/editor')}
                    className="flex flex-col items-center justify-center p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-2xl">edit_note</span>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">New Entry</span>
                </button>
                <button
                    onClick={() => navigate('/mood-tracker')}
                    className="flex flex-col items-center justify-center p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-2xl">sentiment_satisfied</span>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">Mood Tracker</span>
                </button>
                <button
                    onClick={() => navigate('/insights')}
                    className="flex flex-col items-center justify-center p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-2xl">insights</span>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">Insights</span>
                </button>
                <button
                    onClick={() => navigate('/templates')}
                    className="flex flex-col items-center justify-center p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-2xl">grid_view</span>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">Templates</span>
                </button>
            </section>

            {/* 4. Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Action Card (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Hero Card */}
                    <div className="group relative bg-card-light dark:bg-card-dark rounded-xl shadow-soft dark:shadow-none dark:border dark:border-gray-700 overflow-hidden hover:shadow-glow transition-all duration-300">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent dark:from-primary/20 pointer-events-none"></div>
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Image Section */}
                            <div
                                className="w-full md:w-2/5 h-48 md:h-auto bg-cover bg-center relative"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxYTFdR5UmvX9LJtaG8-DGCeRScpQhS9GhTxxvcHjZCJpkvONIhjaRQMXhuJBAcjFoeSqAj1luTpxoEkGj7EdpkzaWg_MfqTI-FwZu3VUhfkHmqU49XnPPQudIL7LyLOd6qwBaWefUDw5LQ3GKMB9wgVU91xPY-_ESjgYwrgIhsGeZzuHUSpY0GJUaD6Vx9wgfj4H9O-XkG-gwGicx2_zLES28MAJ4y6Wzb1pTMSHtRedUj1G6Ll7qpiFLWpWl7e4xpOyuxUpTUGtX')" }}
                            >
                                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-10">
                                <div className="flex items-center gap-2 mb-3 text-secondary font-semibold text-sm uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                    <span>Daily Focus</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to reflect?</h3>
                                <p className="text-gray-500 dark:text-gray-300 mb-6 leading-relaxed">Capture your thoughts or try an AI suggestion to get started with your mindfulness practice today.</p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <button
                                        onClick={() => navigate('/editor')}
                                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-primary/30 transform active:scale-95"
                                    >
                                        <span className="material-symbols-outlined">edit_note</span>
                                        New Entry
                                    </button>
                                    <button
                                        onClick={() => navigate('/templates')}
                                        className="flex items-center gap-1 text-sm font-semibold text-primary dark:text-white/80 hover:text-primary/80 dark:hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">grid_view</span>
                                        Browse Templates
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Chips (Dynamically Generated) */}
                    <div className="flex flex-wrap gap-3">
                        {quickPrompts ? quickPrompts.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(`/editor?prompt=${p.promptType}`)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card-dark rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group"
                            >
                                <span className={`material-symbols-outlined text-${p.color}-400 group-hover:text-${p.color}-500 text-[20px]`}>{p.icon}</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{p.text}</span>
                            </button>
                        )) : (
                            <span className="text-sm text-gray-400 animate-pulse">Loading prompts...</span>
                        )}
                    </div>
                </div>

                {/* Mood Widget (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full">
                    <button
                        onClick={() => navigate('/mood-tracker')}
                        className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-none dark:border dark:border-gray-700 h-full flex flex-col hover:shadow-md hover:border-primary/30 transition-all cursor-pointer text-left"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Weekly Flow</h3>
                                <p className="text-xs text-gray-500 mt-1">Emotional trend line</p>
                            </div>
                            {/* Dynamic Trend Badge */}
                            <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${moodMetrics.trend > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                moodMetrics.trend < 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                    'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                }`}>
                                <span className="material-symbols-outlined text-[14px]">
                                    {moodMetrics.trend > 0 ? 'trending_up' : moodMetrics.trend < 0 ? 'trending_down' : 'trending_flat'}
                                </span>
                                {moodMetrics.trend > 0 ? '+' : ''}{moodMetrics.trend}%
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-end gap-2">
                            <div className="mb-2">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{moodMetrics.currentState}</span>
                                <span className="text-sm text-gray-400 ml-2">Current State</span>
                            </div>
                            {/* Chart Area */}
                            <div className="relative h-40 w-full mt-4 -ml-2 shrink-0">
                                <MoodChart moods={moods} />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 font-medium mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Entries Section */}
            <RecentEntries entries={entries} onNewEntry={() => navigate('/editor')} />
        </div>
    );
};
