import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { JournalModal } from './components/JournalModal';
import { SignIn } from './components/SignIn';
import { OnboardingFlow } from './components/Onboarding';
import { SettingsLayout } from './components/SettingsLayout';
import { JournalEntry, Template } from './types';
import { getAppSettings, getUserProfile, MoodCheckin } from './utils/storage';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initDatabase } from './utils/db';
import { authService } from './services/authService';
import {
  Dashboard,
  MoodTrackerPage,
  InsightsPage,
  TemplatesPage,
  TemplateBuilderPage,
  EditorPage,
  SettingsPage,
  YearReportPage,
  EntryDetailPage,
  AllEntriesPage,
  NotificationsPage,
  GeneralSettingsPage,
  ProfileSettingsPage,
  DataManagementPage,
  NotificationSettingsPage
} from './pages';

// Initial Mock Data
const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    title: 'Evening Reflection',
    excerpt: 'Felt a bit overwhelmed today with work, but taking a walk helped clear my mind significantly...',
    content: '<p>Felt a bit overwhelmed today with work, but taking a walk helped clear my mind significantly. I need to remember to take breaks earlier in the day.</p>',
    date: 'Yesterday, 8:30 PM',
    tags: ['Journal', 'Tired'],
    type: 'journal',
    mood: 'Tired',
    icon: 'water_drop',
    colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
  },
  {
    id: '2',
    title: 'Morning Intentions',
    excerpt: 'Woke up feeling refreshed. Today I want to focus on being present during meetings and avoiding multitasking.',
    content: '<p>Woke up feeling refreshed. Today I want to focus on being present during meetings and avoiding multitasking. <strong>Focus works wonders.</strong></p>',
    date: 'Oct 22, 7:15 AM',
    tags: ['Journal', 'Optimistic'],
    type: 'journal',
    mood: 'Optimistic',
    icon: 'light_mode',
    colorClass: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300'
  }
];

const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'gratitude',
    title: 'Gratitude Journal',
    description: 'Cultivate positivity by listing three things you are thankful for today. A simple practice for a happier mind.',
    category: 'Mindfulness',
    icon: 'favorite',
    colorTheme: {
      bg: 'bg-card-light dark:bg-card-dark',
      text: 'text-pink-500',
      iconBg: 'bg-pink-50 dark:bg-pink-500/10',
      groupHoverText: 'group-hover:text-pink-500',
      gradient: 'from-pink-500/5',
    }
  },
  {
    id: 'morning',
    title: 'Morning Intentions',
    description: 'Start your day with purpose. Set clear goals and a positive mindset for the hours ahead.',
    category: 'Productivity',
    icon: 'wb_sunny',
    colorTheme: {
      bg: 'bg-card-light dark:bg-card-dark',
      text: 'text-amber-500',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      groupHoverText: 'group-hover:text-amber-500',
      gradient: 'from-amber-500/5',
    }
  },
  {
    id: 'reflection',
    title: 'Deep Reflection',
    description: 'Analyze complex emotions and situations with guided prompts to gain deeper personal insight.',
    category: 'Emotional Growth',
    icon: 'psychology',
    colorTheme: {
      bg: 'bg-card-light dark:bg-card-dark',
      text: 'text-indigo-500',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
      groupHoverText: 'group-hover:text-indigo-500',
      gradient: 'from-indigo-500/5',
    }
  },
  {
    id: 'goals',
    title: 'Goal Setting',
    description: 'Define what you want to achieve. Break down big dreams into actionable steps using the SMART framework.',
    category: 'Productivity',
    icon: 'flag',
    colorTheme: {
      bg: 'bg-card-light dark:bg-card-dark',
      text: 'text-emerald-500',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      groupHoverText: 'group-hover:text-emerald-500',
      gradient: 'from-emerald-500/5',
    }
  },
  {
    id: 'anxiety',
    title: 'Anxiety Relief',
    description: 'A safe space to unload worries. Use the 5-4-3-2-1 technique to ground yourself in the present moment.',
    category: 'Emotional Growth',
    icon: 'spa',
    colorTheme: {
      bg: 'bg-card-light dark:bg-card-dark',
      text: 'text-cyan-500',
      iconBg: 'bg-cyan-50 dark:bg-cyan-500/10',
      groupHoverText: 'group-hover:text-cyan-500',
      gradient: 'from-cyan-500/5',
    }
  },
  {
    id: 'retro',
    title: 'Daily Retrospective',
    description: 'Review your day before sleep. What went well? What could be improved? Clear your mind for rest.',
    category: 'Mindfulness',
    icon: 'history',
    colorTheme: {
      bg: 'bg-card-light dark:bg-card-dark',
      text: 'text-violet-500',
      iconBg: 'bg-violet-50 dark:bg-violet-500/10',
      groupHoverText: 'group-hover:text-violet-500',
      gradient: 'from-violet-500/5',
    }
  },
  {
    id: 'free',
    title: 'Free Write',
    description: 'No prompts, no structure. Just you and the blank page. Let your thoughts flow freely.',
    category: 'General',
    icon: 'edit_note',
    colorTheme: {
      bg: 'bg-card-light dark:bg-card-dark',
      text: 'text-slate-500 dark:text-slate-300',
      iconBg: 'bg-slate-100 dark:bg-slate-700/50',
      groupHoverText: 'group-hover:text-slate-500 dark:group-hover:text-slate-300',
      gradient: 'from-slate-500/5',
    }
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Supabase State
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [moods, setMoods] = useState<MoodCheckin[]>([]);
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES); // Default templates locally for now or fetch
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Initialize Auth & Data
  useEffect(() => {
    const init = async () => {
      // Check auth
      const session = await authService.getCurrentSession();
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      setIsAuthLoading(false);

      if (isAuth) {
        // Trigger Migration if needed
        try {
          const { migrateDataToSupabase } = await import('./utils/migration');
          await migrateDataToSupabase();
        } catch (e) {
          console.error("Migration failed", e);
        }

        // Fetch Data
        await fetchData();
      }
    };
    init();

    // Settings logic...
    const applySettings = () => {
      // ... (keep existing settings logic)
      const settings = getAppSettings();
      const root = window.document.documentElement;
      // 1. Theme
      root.classList.remove('light', 'dark');
      let effectiveTheme = settings.theme;
      if (effectiveTheme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        effectiveTheme = systemDark ? 'dark' : 'light';
      }
      root.classList.add(effectiveTheme);
      // 2. Font Size
      const fontSizes = { 1: '87.5%', 2: '100%', 3: '112.5%' };
      root.style.fontSize = fontSizes[settings.fontSize as keyof typeof fontSizes] || '100%';
      // 3. High Contrast
      if (settings.highContrast) root.classList.toggle('high-contrast', settings.highContrast);
      // 4. Screen Reader
      if (settings.screenReader) root.classList.toggle('screen-reader-optimized', settings.screenReader);
    };
    applySettings();

    const handleAuthChange = async () => {
      const session = await authService.getCurrentSession();
      setIsAuthenticated(!!session);
      if (session) await fetchData();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const fetchData = async () => {
    try {
      // Dynamic import to avoid cycles or ensure service is ready
      const { supabaseService } = await import('./services/supabaseService');
      const [fetchedEntries, fetchedMoods] = await Promise.all([
        supabaseService.getEntries(),
        supabaseService.getMoods()
      ]);
      setEntries(fetchedEntries);
      setMoods(fetchedMoods);

      // Optionally fetch templates from DB if you store them there
      // const fetchedTemplates = await supabaseService.getTemplates();
      // setTemplates(fetchedTemplates);
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
  };

  const handleSaveEntry = async (title: string, content: string, id?: string, moodData?: any) => {
    if (id) {
      await handleEditEntry(id, title, content, moodData);
      return;
    }
    // 1. Analyze Mood asynchronously
    let finalMoodData = moodData;

    if (!finalMoodData) {
      try {
        const { extractMoodFromJournal } = await import('./services/geminiService');
        const analysis = await extractMoodFromJournal(content);
        finalMoodData = analysis;
      } catch (error) {
        console.error("Auto-mood analysis failed:", error);
        finalMoodData = {
          mood: 'Neutral',
          moodValue: 3,
          factors: [] as string[],
          secondaryEmotions: [] as string[],
          color: 'text-gray-500'
        };
      }
    }

    // 2. Create Journal Entry
    // 2. Create Journal Entry
    const currentUser = await authService.getCurrentUser();
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(), // Ensure UUID for Postgres
      userId: currentUser?.id || 'anonymous',
      title: title,
      excerpt: content.replace(/<[^>]+>/g, '').substring(0, 100) + '...',
      content: content,
      date: new Date().toISOString(),
      tags: ['Journal', ...finalMoodData.secondaryEmotions],
      type: 'journal',
      mood: finalMoodData.mood,
      icon: 'spa',
      colorClass: `bg-opacity-10 ${finalMoodData.color.replace('text-', 'bg-')} ${finalMoodData.color}`
    };

    try {
      const { supabaseService } = await import('./services/supabaseService');
      await supabaseService.addEntry(newEntry);

      // 3. Save Mood Check-in
      await supabaseService.addMood({
        id: crypto.randomUUID(),
        user_id: newEntry.userId, // Matches schema snake_case if I passed it raw, but let's check interface
        date: newEntry.date,
        mood: finalMoodData.mood,
        moodValue: finalMoodData.moodValue,
        secondaryEmotions: finalMoodData.secondaryEmotions,
        factors: finalMoodData.factors,
        note: 'Auto-generated from journal entry'
      } as any); // Type assertion for now, need to align interfaces

      // Refresh Data
      await fetchData();
    } catch (e) {
      console.error("Failed to save entry", e);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { supabaseService } = await import('./services/supabaseService');
      await supabaseService.deleteEntry(id);
      await fetchData();
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  const handleEditEntry = async (id: string, title: string, content: string, moodData?: any) => {
    try {
      const { supabaseService } = await import('./services/supabaseService');

      // Prepare updates
      const updates: any = {
        title,
        excerpt: content.replace(/<[^>]+>/g, '').substring(0, 100) + '...',
        content
      };

      if (moodData) {
        updates.mood = moodData.mood;
        updates.colorClass = `bg-opacity-10 ${moodData.color.replace('text-', 'bg-')} ${moodData.color}`;
      }

      await supabaseService.updateEntry(id, updates);

      // Also update linked Mood Checkin if possible
      if (moodData) {
        // Find the entry first to get the date
        const existingEntry = entries.find(e => e.id === id);
        if (existingEntry) {
          await supabaseService.updateMoodByDate(existingEntry.date, moodData);
        }
      }

      await fetchData();
    } catch (e) {
      console.error("Failed to update", e);
    }
  };

  const handleAddTemplate = async (newTemplate: Template) => {
    // Keep templates local or DB? 
    // For now, let's keep basic templates array state + local persistence if needed
    // or just append to state
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setShowOnboarding(false);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Auth Guard
  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }

  // If Onboarding, show without Sidebar
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-background-light dark:bg-background-dark text-[#131516] dark:text-[#f1f3f3] overflow-hidden font-display">
        <Sidebar
          isOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full relative z-10 w-full">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-white">spa</span>
              <span className="font-bold text-lg text-primary dark:text-white">Re-Flect</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </header>

          {/* Routes */}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard entries={entries} moods={moods} />} />
              <Route path="/mood-tracker" element={<MoodTrackerPage moods={moods} />} />
              <Route path="/insights" element={<InsightsPage entries={entries} moods={moods} />} />
              <Route path="/templates" element={<TemplatesPage templates={templates} onAddTemplate={handleAddTemplate} />} />
              <Route path="/templates/builder" element={<TemplateBuilderPage onSaveNewTemplate={handleAddTemplate} />} />
              <Route path="/editor" element={<EditorPage onSave={handleSaveEntry} />} />

              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="general" replace />} />
                <Route path="general" element={<GeneralSettingsPage />} />
                <Route path="profile" element={<ProfileSettingsPage />} />
                <Route path="privacy" element={<SettingsPage />} />
                <Route path="data" element={<DataManagementPage />} />
                <Route path="notifications" element={<NotificationSettingsPage />} />
              </Route>

              <Route path="/year-report" element={<YearReportPage moods={moods} />} />
              <Route path="/entry/:id" element={<EntryDetailPage entries={entries} onDelete={handleDeleteEntry} onEdit={handleEditEntry} />} />
              <Route path="/entries" element={<AllEntriesPage entries={entries} />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        {/* Modals */}
        <JournalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEntry}
        />
      </div>
    </Router>
  );
};

export default App;