import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MoodChart } from './components/MoodChart';
import { RecentEntries } from './components/RecentEntries';
import { JournalModal } from './components/JournalModal';
import { TemplatesView } from './components/TemplatesView';
import { TemplateBuilder } from './components/TemplateBuilder';
import { PrivacySettings } from './components/PrivacySettings';
import { YearReport } from './components/YearReport';
import { JournalEditor } from './components/JournalEditor';
import { PersonalInsights } from './components/PersonalInsights';
import { DailyMoodTracker } from './components/DailyMoodTracker';
import { SignIn } from './components/SignIn';
import { OnboardingFlow } from './components/Onboarding';
import { JournalEntry, ViewState } from './types';

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
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
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
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleSignIn = () => {
    // Existing user flow -> Dashboard
    setIsAuthenticated(true);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleSignUp = () => {
    // New user flow -> Onboarding
    setIsAuthenticated(true);
    setCurrentView(ViewState.ONBOARDING);
  };

  const handleOnboardingComplete = () => {
    setCurrentView(ViewState.DASHBOARD);
  };

  const renderContent = () => {
    if (currentView === ViewState.ONBOARDING) {
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    }

    // Main App Views
    if (currentView === ViewState.TEMPLATES) {
      return <TemplatesView onCreateCustom={() => setCurrentView(ViewState.TEMPLATE_BUILDER)} />;
    }
    if (currentView === ViewState.TEMPLATE_BUILDER) {
      return (
        <TemplateBuilder 
          onBack={() => setCurrentView(ViewState.TEMPLATES)}
          onSave={() => {
            alert("Template Saved!");
            setCurrentView(ViewState.TEMPLATES);
          }}
        />
      );
    }
    if (currentView === ViewState.SETTINGS) {
      return <PrivacySettings />;
    }
    if (currentView === ViewState.YEAR_REPORT) {
      return <YearReport />;
    }
    if (currentView === ViewState.INSIGHTS) {
      return <PersonalInsights />;
    }
    if (currentView === ViewState.EDITOR) {
      return (
        <JournalEditor 
          onBack={() => setCurrentView(ViewState.DASHBOARD)}
          onSave={handleSaveEntry}
        />
      );
    }
    if (currentView === ViewState.JOURNAL) {
      return <DailyMoodTracker />;
    }

    // Default Dashboard View
    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        {/* 1. Header Section (Greeting) */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
          <div className="flex flex-col gap-1 max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight text-[#131516] dark:text-white leading-tight">Good Morning, Alex</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Here's your daily overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              Today: <span className="text-primary dark:text-primary-light font-bold">Oct 24</span>
            </span>
            <button className="p-2 bg-white dark:bg-white/5 rounded-full text-gray-500 hover:text-primary transition-colors shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </section>

        {/* 2. Daily Quote Section (Dedicated) */}
        <section className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-xl animate-fade-in-up delay-75 shadow-sm">
            <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl mt-1">format_quote</span>
                <div>
                    <p className="text-xl font-serif text-gray-800 dark:text-gray-200 italic leading-relaxed">"The unexamined life is not worth living."</p>
                    <p className="text-sm font-bold text-gray-500 mt-2 tracking-wide uppercase">— Socrates</p>
                </div>
            </div>
        </section>

        {/* 3. Quick Links Section (New) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-100">
            <button 
                onClick={() => setCurrentView(ViewState.EDITOR)} 
                className="flex flex-col items-center justify-center p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all group"
            >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">edit_note</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">New Entry</span>
            </button>
            <button 
                onClick={() => setCurrentView(ViewState.JOURNAL)} 
                className="flex flex-col items-center justify-center p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all group"
            >
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">sentiment_satisfied</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">Mood Tracker</span>
            </button>
            <button 
                onClick={() => setCurrentView(ViewState.INSIGHTS)} 
                className="flex flex-col items-center justify-center p-6 bg-card-light dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all group"
            >
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">insights</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">Insights</span>
            </button>
            <button 
                onClick={() => setCurrentView(ViewState.TEMPLATES)} 
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
                      onClick={() => setCurrentView(ViewState.EDITOR)}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-primary/30 transform active:scale-95"
                    >
                      <span className="material-symbols-outlined">edit_note</span>
                      New Entry
                    </button>
                    <button 
                      onClick={() => setCurrentView(ViewState.TEMPLATES)}
                      className="flex items-center gap-1 text-sm font-semibold text-primary dark:text-white/80 hover:text-primary/80 dark:hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">grid_view</span>
                      Browse Templates
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Chips */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card-dark rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                <span className="material-symbols-outlined text-purple-400 group-hover:text-purple-500 text-[20px]">spark</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">How are you feeling right now?</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card-dark rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                <span className="material-symbols-outlined text-blue-400 group-hover:text-blue-500 text-[20px]">bedtime</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Record last night's dream</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card-dark rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                <span className="material-symbols-outlined text-pink-400 group-hover:text-pink-500 text-[20px]">favorite</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">List 3 things you're grateful for</span>
              </button>
            </div>
          </div>

          {/* Mood Widget (4 cols) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft dark:shadow-none dark:border dark:border-gray-700 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Weekly Flow</h3>
                  <p className="text-xs text-gray-500 mt-1">Emotional trend line</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +10%
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-end gap-2">
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Calm</span>
                  <span className="text-sm text-gray-400 ml-2">Current State</span>
                </div>
                {/* Chart Area */}
                <div className="relative h-40 w-full mt-4 -ml-2">
                  <MoodChart />
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
            </div>
          </div>

          {/* Recent Entries Section */}
          <RecentEntries entries={entries} onNewEntry={() => setCurrentView(ViewState.EDITOR)} />
        </div>
      </div>
    );
  };

  // Auth Guard
  if (!isAuthenticated) {
    return <SignIn onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }

  // If Onboarding, show without Sidebar
  if (currentView === ViewState.ONBOARDING) {
      return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-[#131516] dark:text-[#f1f3f3] overflow-hidden font-display">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-full relative z-10 w-full ${
        currentView === ViewState.TEMPLATE_BUILDER || currentView === ViewState.SETTINGS || currentView === ViewState.EDITOR
          ? 'overflow-hidden' 
          : 'overflow-y-auto'
      }`}>
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

        {renderContent()}
      </main>

      {/* Modals */}
      <JournalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
      />
    </div>
  );
};

export default App;