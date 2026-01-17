import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { JournalModal } from './components/JournalModal';
import { SignIn } from './components/SignIn';
import { OnboardingFlow } from './components/Onboarding';
import { JournalEntry } from './types';
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
  NotificationsPage
} from './pages';

// Initial Mock Data
const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    title: 'Evening Reflection',
    excerpt: 'Felt a bit overwhelmed today with work, but taking a walk helped clear my mind significantly...',
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
    date: 'Oct 22, 7:15 AM',
    tags: ['Journal', 'Optimistic'],
    type: 'journal',
    mood: 'Optimistic',
    icon: 'light_mode',
    colorClass: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300'
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSaveEntry = (title: string, content: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: title,
      excerpt: content,
      date: 'Just now',
      tags: ['Journal', 'Reflective'],
      type: 'journal',
      mood: 'Calm',
      icon: 'spa',
      colorClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300'
    };
    setEntries([newEntry, ...entries]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleEditEntry = (id: string, title: string, content: string) => {
    setEntries(entries.map(entry =>
      entry.id === id
        ? { ...entry, title, excerpt: content }
        : entry
    ));
  };

  const handleSignIn = () => {
    // Existing user flow -> Dashboard
    setIsAuthenticated(true);
    setShowOnboarding(false);
  };

  const handleSignUp = () => {
    // New user flow -> Onboarding
    setIsAuthenticated(true);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Auth Guard
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
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
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
              <Route path="/" element={<Dashboard entries={entries} />} />
              <Route path="/mood-tracker" element={<MoodTrackerPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/templates/builder" element={<TemplateBuilderPage />} />
              <Route path="/editor" element={<EditorPage onSave={handleSaveEntry} />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/year-report" element={<YearReportPage />} />
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