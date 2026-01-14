import React, { useState } from 'react';

// --- Sub-Components for each Step ---

const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6 animate-fade-in-up">
    {/* Background Blobs */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute top-[20%] -right-[10%] w-[35vw] h-[35vw] bg-[#CCAB48]/10 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] bg-primary/5 rounded-full blur-[150px]"></div>
    </div>

    <div className="w-full max-w-6xl bg-white dark:bg-card-dark rounded-[2.5rem] shadow-2xl shadow-primary/5 overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[640px]">
      {/* Image Side */}
      <div className="lg:w-1/2 relative overflow-hidden bg-primary/5 order-2 lg:order-1 group">
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 pointer-events-none"></div>
        <img 
          alt="Person peacefully journaling" 
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-[2s] ease-out" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_9WEPlQLnxcLd9Smz_XtLTHjAWFOdViOltVzeZun0cKRjzp5f4ZJO4DWAiDE3GqbhY08t1YHHa_PzT-rPDWw14E7-Nb3-_R7L4lst7rmllEOUo5yahfj9bpR7LJw38xROTUSWUrSQTwpnpplHPml05EVzJZh88wQ5WB_LsJJgRmF_S5ANu7lvgflzXJm6Vn4Ik-Cc4Isbq_yHy1-YkNBBm6KRaXm4691D-F1u80nXSObaX2xH7X7WODazCqTr2VBlQfrmhLUvDZmr"
        />
        <div className="absolute bottom-0 left-0 p-10 z-20 w-full bg-gradient-to-t from-[#2a5e6f]/90 to-transparent">
          <div className="flex items-center gap-2 text-white/90 mb-3">
            <span className="material-symbols-outlined text-[#CCAB48] text-lg">auto_awesome</span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#CCAB48]">Mindfulness</span>
          </div>
          <p className="text-white text-xl font-medium italic leading-relaxed">"The best way to capture moments is to pay attention. This is how we cultivate mindfulness."</p>
        </div>
      </div>

      {/* Content Side */}
      <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center text-center lg:text-left order-1 lg:order-2">
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-10">
          <div className="bg-primary/10 dark:bg-white/10 p-2.5 rounded-xl text-primary dark:text-white shadow-sm">
            <span className="material-symbols-outlined text-3xl">spa</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-primary dark:text-white">Re-Flect</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#131516] dark:text-white leading-[1.1] mb-6">
          Welcome to <br/>
          <span className="text-primary">Re-Flect</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
          Start your journey of self-discovery today. Document your thoughts, analyze your emotions with AI, and find clarity in the stillness of your mind.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2">
          <button 
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group w-full sm:w-auto transform hover:-translate-y-0.5"
          >
            Let's Get Started
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
        <div className="mt-auto pt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span className="material-symbols-outlined text-lg">lock</span>
            <span>Encrypted & Private</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span className="material-symbols-outlined text-lg">psychology</span>
            <span>AI Analysis</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GoalsStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const goals = [
    { id: 'stress', title: 'Reduce Stress', icon: 'self_improvement', desc: 'Find calm in chaos and learn techniques to manage daily anxiety effectively.', iconBg: 'bg-blue-50 dark:bg-primary/20', iconColor: 'text-primary' },
    { id: 'gratitude', title: 'Practice Gratitude', icon: 'volunteer_activism', desc: 'Build a habit of thankfulness to shift your perspective towards positivity.', iconBg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-400' },
    { id: 'mood', title: 'Track Mood Patterns', icon: 'mood', desc: 'Understand your emotional triggers and discover trends in your well-being.', iconBg: 'bg-indigo-50 dark:bg-indigo-900/20', iconColor: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'growth', title: 'Personal Growth', icon: 'psychology_alt', desc: 'Reflect on your personal journey, set intentions, and foster self-development.', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-display animate-fade-in-up">
      <header className="w-full px-8 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-xl select-none">
          <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-lg text-primary dark:text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">spa</span>
          </div>
          <span>Re-Flect</span>
        </div>
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Step 2 of 4</div>
      </header>
      
      <div className="w-full max-w-xl mx-auto px-6 mb-8 md:mb-12">
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '25%' }}></div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto px-6 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#131516] dark:text-white mb-4 tracking-tight">What brings you here?</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">Select the goals that matter most to you. We'll personalize your daily reflection prompts based on your choices.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl">
          {goals.map((goal) => (
            <div 
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`group relative cursor-pointer bg-white dark:bg-card-dark p-6 rounded-2xl border-2 shadow-soft hover:shadow-lg transition-all duration-200 flex items-start gap-5 h-full
                ${selectedGoals.includes(goal.id) 
                  ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                  : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
            >
              <div className={`w-14 h-14 rounded-xl ${goal.iconBg} ${goal.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-3xl">{goal.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{goal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{goal.desc}</p>
              </div>
              {selectedGoals.includes(goal.id) && (
                <div className="absolute top-6 right-6 text-primary transition-all animate-fade-in-up">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      
      <footer className="w-full max-w-5xl mx-auto px-6 py-8 flex items-center justify-end border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={onNext}
          disabled={selectedGoals.length === 0}
          className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};

const PrivacyStep: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => (
  <div className="bg-background-light dark:bg-background-dark text-[#131516] dark:text-[#f1f3f3] h-screen flex flex-col overflow-hidden relative animate-fade-in-up">
    {/* Background effects */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-[#CCAB48]/5 rounded-full blur-[80px]"></div>
    </div>

    <header className="relative z-10 w-full max-w-6xl mx-auto p-6 md:p-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 dark:bg-white/10 p-2 rounded-lg text-primary dark:text-white">
          <span className="material-symbols-outlined">spa</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-primary dark:text-white">Re-Flect</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 3 of 4</span>
        <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/2 rounded-full"></div>
        </div>
      </div>
    </header>

    <main className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10">
      <div className="w-full max-w-5xl bg-card-light dark:bg-card-dark rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        {/* Left Panel */}
        <div className="md:w-5/12 bg-primary p-10 text-white relative flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#CCAB48]/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          <div className="relative z-10 mt-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">Unlock deeper insights.</h1>
            <p className="text-lg text-primary-100/90 font-medium leading-relaxed">
              Let our secure AI companion help you find patterns in your thoughts and navigate your emotional journey with clarity.
            </p>
          </div>
          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#CCAB48] text-3xl">shield_lock</span>
              <div>
                <h3 className="font-bold text-lg mb-1">Privacy First Design</h3>
                <p className="text-sm text-white/80 leading-snug">
                  Your journal is sacred. All AI analysis is end-to-end encrypted and strictly private. We never sell your data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Features Setup</h2>
            <p className="text-gray-500 dark:text-gray-400">Customize how Re-Flect assists your mindfulness practice.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="group flex items-start gap-5 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-white/5 hover:border-primary/30 hover:bg-white dark:hover:bg-card-dark hover:shadow-md transition-all cursor-default">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Sentiment Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Automatically detect emotional tones in your entries to visualize mood trends over time.
                </p>
              </div>
            </div>
            
            <div className="group flex items-start gap-5 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-white/5 hover:border-[#CCAB48]/40 hover:bg-white dark:hover:bg-card-dark hover:shadow-md transition-all cursor-default">
              <div className="w-14 h-14 rounded-xl bg-[#CCAB48]/10 text-[#CCAB48] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <span className="material-symbols-outlined text-3xl">auto_fix_high</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Personalized Prompts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Receive tailored journaling questions based on your recent emotional analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between py-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-gray-900 dark:text-white text-lg">Opt-in to AI Insights</span>
                <span className="text-xs text-gray-500 font-medium">You can disable this at any time in Settings</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary transition-colors duration-300"></div>
              </label>
            </div>
            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={onBack}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={onNext}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Next Step
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

const FinalStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="bg-background-light dark:bg-background-dark text-[#131516] dark:text-[#f1f3f3] h-screen flex flex-col items-center justify-center relative overflow-hidden animate-fade-in-up">
    {/* Background Blobs */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#CCAB48]/5 rounded-full blur-3xl"></div>
    </div>
    
    <div className="absolute top-8 left-8 z-20 flex items-center gap-2 opacity-80">
      <div className="bg-primary/10 dark:bg-white/10 p-1.5 rounded-lg text-primary dark:text-white">
        <span className="material-symbols-outlined text-2xl">spa</span>
      </div>
      <span className="font-bold text-lg tracking-tight text-primary dark:text-white">Re-Flect</span>
    </div>

    <main className="relative z-10 w-full max-w-lg px-6">
      <div className="bg-card-light dark:bg-card-dark rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 p-8 md:p-10 text-center space-y-8 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold tracking-widest uppercase">
            <span className="text-[#CCAB48]">Setup Complete</span>
            <span className="text-primary dark:text-white">100%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-secondary to-primary w-full h-full rounded-full shadow-[0_0_10px_rgba(204,171,72,0.4)] animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
          </div>
        </div>

        <div className="py-4 flex justify-center items-center relative">
          <div className="absolute w-32 h-32 border border-[#CCAB48]/20 rounded-full animate-ping opacity-20"></div>
          <div className="absolute w-24 h-24 bg-[#CCAB48]/10 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-white dark:bg-card-dark rounded-full p-4 shadow-glow border border-[#CCAB48]/10 z-10">
            <span className="material-symbols-outlined text-6xl text-[#CCAB48]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 border-4 border-white dark:border-card-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-base font-bold">check</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-[#131516] dark:text-white">You're all set!</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            We've personalized your dashboard based on your goals. Your mindfulness journey begins now.
          </p>
        </div>

        <div className="bg-background-light dark:bg-background-dark/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 text-left flex gap-4 transition-all hover:border-[#CCAB48]/30">
          <div className="shrink-0 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light h-10 w-10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">lightbulb</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-1">Did you know?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Reflecting on your emotions for just 5 minutes a day can reduce stress levels by up to 30% over time.
            </p>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="w-full bg-primary hover:bg-[#234e5d] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          <span>Go to Dashboard</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
      
      <p className="mt-8 text-xs text-center text-gray-400 dark:text-gray-600">
        Having trouble? <a className="underline hover:text-primary transition-colors" href="#">Restart Setup</a>
      </p>
    </main>
  </div>
);

// --- Main Flow Component ---

interface OnboardingFlowProps {
    onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    switch (step) {
        case 0:
            return <WelcomeStep onNext={handleNext} />;
        case 1:
            return <GoalsStep onNext={handleNext} />;
        case 2:
            return <PrivacyStep onNext={handleNext} onBack={handleBack} />;
        case 3:
            return <FinalStep onComplete={onComplete} />;
        default:
            return null;
    }
};
