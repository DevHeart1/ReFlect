import { GoogleGenAI } from "@google/genai";
import { TemplateBlock } from "../types";

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize AI with Thinking Model Configuration
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = 'gemini-3-flash-preview'; // Using the latest stable flash model
const DEFAULT_CONFIG = {
  thinkingConfig: {
    thinkingLevel: 'HIGH' as const,
  },
  // mediaResolution can sometimes be tricky with strict types, usually 'MEDIA_RESOLUTION_LOW' is correct but let's try avoiding the explicit cast if it fails or use the string directly.
  // Actually, checking standard usage, let's keep it simple.
  responseMimeType: 'text/plain',
} as any; // Temporary loose typing to bypass the specific SDK enum conflict if imports are missing

// --- Generic Helper ---

const generateContent = async (prompt: string, systemInstruction?: string, jsonMode: boolean = false): Promise<string> => {
  if (!ai) {
    console.warn("No Gemini API key configured.");
    return "";
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        ...DEFAULT_CONFIG,
        responseMimeType: jsonMode ? 'application/json' : 'text/plain',
        systemInstruction: systemInstruction,
      }
    });
    // Error said: Type 'String' has no call signatures. So it is a property.
    return response.text?.toString() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// --- Specific Features ---

export const generateThoughts = async (context: string = ""): Promise<string> => {
  if (!ai) return "What is one small thing that brought you joy today?";

  // If context is provided (e.g. from editor), generate a specific follow-up
  const specificPrompt = context
    ? `Based on this journal entry: "${context}", generate a single, deep, insightful follow-up question to help the user dig deeper. Keep it under 20 words.`
    : "Generate a short, thoughtful, and unique journaling prompt for gratitude or mindfulness. Keep it under 20 words.";

  try {
    return await generateContent(specificPrompt, "You are an empathetic mindfulness coach.");
  } catch {
    return "Reflect on a moment of stillness you experienced recently.";
  }
};

export const generateMindfulnessPrompt = async (): Promise<string> => {
  return generateThoughts();
};

export const generateGratitudePrompt = async (): Promise<string> => {
  if (!ai) return "What made you smile today?";
  try {
    return await generateContent(
      "Generate a short, inspiring gratitude journaling prompt. Less than 20 words.",
      "You are a warm, encouraging mindfulness companion."
    );
  } catch {
    return "List three things that brought you comfort today.";
  }
};

export const analyzeSentiment = async (text: string): Promise<{ label: string; score: number; color: string }> => {
  if (!ai || !text.trim()) return { label: 'Neutral', score: 50, color: 'text-gray-500' };

  const prompt = `Analyze the sentiment of this text: "${text}". 
    Return a JSON object with:
    - label: A short 1-2 word emotion label (e.g., "Anxious", "Calm", "Joyful").
    - score: A number 0-100 representing intensity.
    - color: A tailwind text color class that matches the emotion (e.g., "text-red-500", "text-blue-500", "text-green-500", "text-amber-500").`;

  try {
    const result = await generateContent(prompt, "You are an emotion analyzer. Respond ONLY in JSON.", true);
    const parsed = JSON.parse(result);
    return {
      label: parsed.label || 'Neutral',
      score: parsed.score || 50,
      color: parsed.color || 'text-gray-500'
    };
  } catch {
    return { label: 'Neutral', score: 50, color: 'text-gray-500' };
  }
};

export const generateTemplateStructure = async (description: string): Promise<TemplateBlock[]> => {
  if (!ai) return [];

  const prompt = `Create a journaling template based on this description: "${description}".
    Return a JSON array of blocks. Each block should have:
    - id: A unique string ID.
    - type: One of "question", "mood", "checklist", "free_text".
    - title: The label/question for the block.
    - items: (Optional) Array of strings if type is "checklist".
    `;

  try {
    const result = await generateContent(prompt, "You are a creative journal template designer. Respond ONLY in JSON.", true);
    const parsed = JSON.parse(result);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Template generation failed", e);
    return [];
  }
};


export interface MoodCheckin {
  id: string;
  date: string;
  mood: string;
  moodValue: number;
  secondaryEmotions: string[];
  factors: string[];
  note: string;
}

export const generateMoodInsights = async (recentMoods: MoodCheckin[]): Promise<string> => {
  if (!ai || recentMoods.length === 0) {
    return "Consistent tracking unlocks AI insights about your emotional patterns.";
  }

  // Summarize the data for the prompt to save tokens/make it readable
  const summary = recentMoods.map(m =>
    `${new Date(m.date).toLocaleDateString()}: ${m.mood} (${m.secondaryEmotions.join(', ')}) - Factors: ${m.factors.join(', ')}. Note: "${m.note}"`
  ).join('\n');

  const prompt = `Based on these recent mood check-ins:\n${summary}\n\nProvide a single, short (2 sentences max), empathetic insight or observation about the user's emotional trends. Focus on patterns or positive reinforcement.`;

  try {
    return await generateContent(prompt, "You are an insightful and empathetic therapist assistant.");
  } catch {
    return "Notice how your mood shifts throughout the week? Keep tracking to see more patterns.";
  }
};

export const generateYearlySummary = async (stats: any): Promise<string> => {
  if (!ai) return "Keep documenting your journey to unlock deeper insights.";

  // We can pass a simplified version of stats
  const prompt = `Generate a warm, celebratory yearly summary (approx 30-40 words) for a user's year in review.
    Stats:
    - Total Entries: ${stats.total}
    - Top Mood: ${stats.topMoods[0]?.mood || 'N/A'}
    - Streak: ${stats.streak} days
    - Key Themes: ${stats.topMoods.map((m: any) => m.mood).join(', ')}
    
    Make it personal and encouraging.`;

  try {
    return await generateContent(prompt, "You are a warm, encouraging life coach.");
  } catch {
    return `You have logged ${stats.total} entries this year. Keep documenting your journey to unlock deeper insights.`;
  }
};

export interface WeeklyReport {
  weekStarting: string;
  themes: string[];
  triggers: string[];
  insight: string;
  strategy: string;
  selfAudit: string;
}

export const generateWeeklyReport = async (entries: any[], moods: any[]): Promise<WeeklyReport | null> => {
  if (!ai || (entries.length === 0 && moods.length === 0)) return null;

  // Prepare context
  const entryText = entries.map(e => `[${new Date(e.date).toLocaleDateString()}] ${e.title}: ${e.excerpt}`).join('\n');
  const moodText = moods.map(m => `[${new Date(m.date).toLocaleDateString()}] Mood: ${m.mood} (Val: ${m.moodValue}) - Factors: ${m.factors.join(', ')}`).join('\n');

  const prompt = `
  Perform a deep, multi-level psychological analysis on this user's week to generate a "Weekly Inner Report".
  
  DATA:
  Journal Entries:
  ${entryText}

  Mood Logs:
  ${moodText}

  Thinking Process (Simulate this internally):
  Level 1: Understanding - What happened?
  Level 2: Pattern Recognition - What repeats?
  Level 3: Insight Generation - Why does it happen?
  Level 4: Strategy Proposal - What to do next?
  Level 5: Self-Audit - Verify alignment.

  OUTPUT:
  Return strictly a JSON object with this structure:
  {
    "weekStarting": "${new Date().toLocaleDateString()}",
    "themes": ["Theme 1", "Theme 2"],
    "triggers": ["Trigger 1", "Trigger 2"],
    "insight": "A profound observation about the user's emotional state (Level 3).",
    "strategy": "A concrete, actionable strategy for next week (Level 4).",
    "selfAudit": "A brief meta-comment on confidence level of this analysis."
  }
  `;

  try {
    const result = await generateContent(prompt, "You are an expert psychologist AI agent. Respond ONLY in valid JSON.", true);
    return JSON.parse(result);
  } catch (e) {
    console.error("Weekly report generation failed", e);
    return null;
  }
};

export const generateDeepReflectPrompt = async (stage: string, context: string): Promise<string> => {
  if (!ai) return "What is on your mind right now?";

  const prompt = `
  Generate a deep, specific reflection question for the "${stage}" of the day.
  Context from previous entries today: "${context}".
  
  The question should:
  1. Be relevant to the time of day (Morning: Intentions/Dreams, Afternoon: Progress/Stress, Evening: Review/Unwind).
  2. Connect to the user's previous context if available.
  3. Be short (under 25 words).
  `;

  try {
    return await generateContent(prompt, "You are a thoughtful journaling companion.");
  } catch {
    return "What is the most important thing to focus on right now?";
  }
};

export const synthesizeDeepReflectSession = async (responses: string[]): Promise<string> => {
  if (!ai || responses.length === 0) return "Keep journaling to see a summary of your day.";

  const prompt = `
  Synthesize these journal entries from throughout the day into a cohesive narrative summary (max 3 sentences).
  Entries:
  ${responses.join('\n')}
  `;

  try {
    return await generateContent(prompt, "You are a biographer summarizing a day in the life.");
  } catch {
    return "You've captured some meaningful moments today. Read them back to see your journey.";
  }
};

export interface GoalAnalysis {
  status: 'on_track' | 'needs_attention' | 'at_risk';
  insight: string;
  suggestion: string;
}

export const evaluateGoalProgress = async (goal: string, recentMoods: any[]): Promise<GoalAnalysis> => {
  if (!ai || !goal) return { status: 'on_track', insight: 'Keep pushing towards your goal.', suggestion: 'Stay consistent.' };

  const moodSummary = recentMoods.slice(0, 5).map(m => `Mood: ${m.mood}, Note: ${m.note}`).join('\n');

  const prompt = `
  Evaluate the user's progress towards their goal: "${goal}" based on their last 5 mood entries.
  Mood Data:
  ${moodSummary}

  Determine:
  1. Status (on_track, needs_attention, at_risk)
  2. Insight (Why?)
  3. Suggestion (What to do?)

  Return strictly JSON:
  {
    "status": "on_track",
    "insight": "...",
    "suggestion": "..."
  }
  `;

  try {
    const result = await generateContent(prompt, "You are a goal accountability coach. Respond ONLY in JSON.", true);
    return JSON.parse(result);
  } catch (e) {
    return { status: 'on_track', insight: 'Consistency is key.', suggestion: 'Keep tracking your progress.' };
  }
};
