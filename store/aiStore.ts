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

    // actions
    setDeepReflectMode: (isActive: boolean) => void;
    setDeepReflectStage: (stage: 'morning' | 'afternoon' | 'evening' | 'summary') => void;
    addDailyContext: (context: string) => void;
    addDeepReflectResponse: (response: string) => void;
    resetDeepReflect: () => void;
}

export const useAIStore = create<AIState>()(
    persist(
        (set) => ({
            dailyContext: [],
            sentimentTrend: 'neutral',
            isDeepReflectMode: false,
            deepReflectStage: 'morning',
            deepReflectResponses: [],

            setDeepReflectMode: (isActive) => set({ isDeepReflectMode: isActive }),
            setDeepReflectStage: (stage) => set({ deepReflectStage: stage }),
            addDailyContext: (context) => set((state) => ({ dailyContext: [...state.dailyContext, context] })),
            addDeepReflectResponse: (response) => set((state) => ({ deepReflectResponses: [...state.deepReflectResponses, response] })),
            resetDeepReflect: () => set({ deepReflectResponses: [], deepReflectStage: 'morning' }),
        }),
        {
            name: 'reflect-ai-storage', // unique name
        }
    )
);
