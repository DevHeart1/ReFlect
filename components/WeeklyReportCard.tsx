import React, { useState } from 'react';
import { WeeklyReport, generateWeeklyReport } from '../services/geminiService';
import { JournalEntry } from '../types';
import { MoodCheckin } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';


interface WeeklyReportCardProps {
    entries: JournalEntry[];
    moods: MoodCheckin[];
}

export const WeeklyReportCard: React.FC<WeeklyReportCardProps> = ({ entries, moods }) => {
    const [report, setReport] = useState<WeeklyReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        const data = await generateWeeklyReport(entries, moods);
        setReport(data);
        setIsLoading(false);
    };

    return (
        <div className="w-full bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-card-dark rounded-3xl p-6 md:p-8 border border-indigo-100 dark:border-indigo-900/30 shadow-lg relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-9xl text-indigo-500">psychology_alt</span>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-indigo-500">auto_awesome</span>
                            Weekly Inner Report
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">AI-Synthesized analysis of your last 7 days using Level 5 Thinking.</p>
                    </div>
                    {!report && (
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                                    Synthesizing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                                    Generate Report
                                </>
                            )}
                        </button>
                    )}
                </div>

                {report && (
                    <div className="animate-fade-in-up space-y-6">
                        {/* Themes & Triggers Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/60 dark:bg-card-dark/60 backdrop-blur-sm rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/20">
                                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Dominant Themes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {report.themes.map((t, i) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/60 dark:bg-card-dark/60 backdrop-blur-sm rounded-2xl p-4 border border-rose-100 dark:border-rose-900/20">
                                <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">Identified Triggers</h4>
                                <div className="flex flex-wrap gap-2">
                                    {report.triggers.map((t, i) => (
                                        <span key={i} className="px-3 py-1 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Validated Insight */}
                        <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border-l-4 border-indigo-500 shadow-sm">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase mb-2">
                                <span className="material-symbols-outlined text-lg">lightbulb</span>
                                Validated Insight
                            </h4>
                            <div className="text-lg text-gray-800 dark:text-gray-100 italic leading-relaxed">
                                <MarkdownRenderer content={report.insight} />
                            </div>
                        </div>

                        {/* Strategy & Audit */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">
                                    <span className="material-symbols-outlined text-lg">strategy</span>
                                    Strategic Proposal
                                </h4>
                                <div className="text-gray-800 dark:text-gray-200">
                                    <MarkdownRenderer content={report.strategy} />
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                                    <span className="material-symbols-outlined text-lg">verified_user</span>
                                    AI Self-Audit
                                </h4>
                                <div className="text-xs text-gray-500 leading-relaxed">
                                    <MarkdownRenderer content={report.selfAudit} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
