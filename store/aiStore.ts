import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AIState {
    // knowledge base
    dailyContext: string[]; // summaries of today's entries
    sentimentTrend: string; // 'positive', 'neutral', 'negative'

    // deep reflect session
    isDeepReflectMode: boolean;
    deepReflectStage: 'morning' | 'afternoon' | 'evening' | 'summary';
    deepReflectResponses: string[];

    // goal tracking
    longTermGoal: string;
    goalStatus: { status: 'on_track' | 'needs_attention' | 'at_risk'; insight: string; suggestion: string } | null;

    // actions
    setDeepReflectMode: (isActive: boolean) => void;
    setDeepReflectStage: (stage: 'morning' | 'afternoon' | 'evening' | 'summary') => void;
    addDailyContext: (context: string) => void;
    addDeepReflectResponse: (response: string) => void;
    resetDeepReflect: () => void;
    setLongTermGoal: (goal: string) => void;
    setGoalStatus: (status: { status: 'on_track' | 'needs_attention' | 'at_risk'; insight: string; suggestion: string }) => void;
}

export const useAIStore = create<AIState>()(
    persist(
        (set) => ({
            dailyContext: [],
            sentimentTrend: 'neutral',
            isDeepReflectMode: false,
            deepReflectStage: 'morning',
            deepReflectResponses: [],
            longTermGoal: '',
            goalStatus: null,

            setDeepReflectMode: (isActive) => set({ isDeepReflectMode: isActive }),
            setDeepReflectStage: (stage) => set({ deepReflectStage: stage }),
            addDailyContext: (context) => set((state) => ({ dailyContext: [...state.dailyContext, context] })),
            addDeepReflectResponse: (response) => set((state) => ({ deepReflectResponses: [...state.deepReflectResponses, response] })),
            resetDeepReflect: () => set({ deepReflectResponses: [], deepReflectStage: 'morning' }),
            setLongTermGoal: (goal) => set({ longTermGoal: goal }),
            setGoalStatus: (status) => set({ goalStatus: status }),
        }),
        {
            name: 'reflect-ai-storage', // unique name
        }
    )
);
