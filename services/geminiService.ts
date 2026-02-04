import { GoogleGenAI } from "@google/genai";
import { Groq } from "groq-sdk";
import { TemplateBlock } from "../types";
import { db } from "../utils/db";

// Get API key from Vite environment variables
// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

// Initialize AI with Thinking Model Configuration
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Initialize Groq
const groq = groqApiKey ? new Groq({
  apiKey: groqApiKey,
  dangerouslyAllowBrowser: true
}) : null;

const MODEL_NAME = 'gemini-1.5-flash'; // Using stable flash model for better quotas
const DEFAULT_CONFIG = {
  responseMimeType: 'text/plain',
} as any;


// --- Generic Helper ---

const generateContentWithGroq = async (prompt: string, systemInstruction?: string, jsonMode: boolean = false): Promise<string> => {
  if (!groq) {
    console.warn("Groq API key not configured for fallback.");
    throw new Error("Gemini quota exceeded and Groq fallback unavailable.");
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemInstruction || "You are a helpful assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "qwen/qwen3-32b",
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 0.95,
      stream: false,
      response_format: jsonMode ? { type: "json_object" } : undefined
    });

    const content = chatCompletion.choices[0]?.message?.content || "";
    return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  } catch (err) {
    console.error("Groq API Error:", err);
    throw err;
  }
};

const getContextString = async (): Promise<string> => {
  try {
    // Fetch last 5 journal entries
    const recentEntries = await db.journalEntries.orderBy('date').reverse().limit(5).toArray();

    // Fetch last 5 mood checkins
    const recentMoods = await db.moodCheckins.orderBy('date').reverse().limit(5).toArray();

    let context = "USER CONTEXT (Recent History):\n";

    if (recentEntries.length > 0) {
      context += "Recent Journals:\n";
      recentEntries.forEach(e => {
        context += `- [${new Date(e.date).toLocaleDateString()}] ${e.title}: ${e.excerpt}\n`;
      });
    }

    if (recentMoods.length > 0) {
      context += "\nRecent Moods:\n";
      recentMoods.forEach(m => {
        context += `- [${new Date(m.date).toLocaleDateString()}] Mood: ${m.mood} (Val: ${m.moodValue}). Factors: ${m.factors.join(', ')}. Note: "${m.note}"\n`;
      });
    }

    return context;
  } catch (e) {
    console.warn("Failed to retrieve context:", e);
    return "";
  }
};

const generateContent = async (prompt: string, systemInstruction?: string, jsonMode: boolean = false): Promise<string> => {
  if (!ai) {
    console.warn("No Gemini API key configured.");
    // Try Groq if Gemini key is missing but Groq key is present? 
    // The requirement says "since we exceed our quota in gemini...i want it to switch", implying fallback.
    // But if ai is null, maybe skipping straight to fallback is good too?
    // For now, adhere to existing behavior for missing key, but maybe fallback logic checks error.
    // If !ai, existing code returns "".
    if (groq) {
      console.warn("Switching to Groq as Gemini is not configured.");
      return generateContentWithGroq(prompt, systemInstruction, jsonMode);
    }
    return "";
  }

  try {
    let finalSystemInstruction = systemInstruction || "";

    // Inject context if not explicitly disabled (could add flag later if needed)
    // For now, we always try to add context for main generation tasks
    const context = await getContextString();
    if (context) {
      finalSystemInstruction += `\n\n${context}\n\nIMPORTANT: Use the above USER CONTEXT to personalize your response. Refer to specific details (e.g., "Since you felt sad yesterday...") if relevant.`;
    }

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
        systemInstruction: finalSystemInstruction,
      }
    });
    // Error said: Type 'String' has no call signatures. So it is a property.
    // Error said: Type 'String' has no call signatures. So it is a property.
    const text = response.text?.toString() || "";
    // Remove structure thinking blocks if present
    return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
  } catch (error: any) {
    // Check for 429 or quota exceeded
    // Common Gemini 429 error structure involves status or code
    if (
      error?.status === 429 ||
      error?.code === 429 ||
      error?.toString().includes('RESOURCE_EXHAUSTED') ||
      error?.toString().includes('Quota exceeded') ||
      error?.message?.includes('429')
    ) {
      console.warn("Gemini quota exceeded (429), switching to Groq fallback...", error);
      return await generateContentWithGroq(prompt, systemInstruction, jsonMode);
    }

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

export interface MoodAnalysis {
  mood: string;
  moodValue: number;
  factors: string[];
  secondaryEmotions: string[];
  color: string;
}

export const extractMoodFromJournal = async (text: string): Promise<MoodAnalysis> => {
  // Default fallback
  const fallback: MoodAnalysis = {
    mood: 'Neutral',
    moodValue: 3,
    factors: [],
    secondaryEmotions: [],
    color: 'text-gray-500'
  };

  if (!ai || !text.trim() || text.length < 10) return fallback;

  const prompt = `
  Analyze this journal entry and extract emotional data.
  Entry: "${text}"

  Return a JSON object with:
  1. mood: Primary emotion (One of: Radiant, Content, Neutral, Low, Distressed, Anxious, Angry, Excited, Grateful).
  2. moodValue: Integer 1-5 (1=Distressed, 5=Radiant).
  3. factors: Array of 1-3 strings identifying THE CAUSE (e.g. "Work", "Family", "Health", "Sleep", "Social").
  4. secondaryEmotions: Array of 1-2 subtle emotions (e.g. "Hopeful", "Tired").
  5. color: Tailwind text color class matching the mood (e.g. text-blue-500).
  `;

  try {
    const result = await generateContent(prompt, "You are an empathetic psychologist. Respond ONLY in JSON.", true);
    const parsed = JSON.parse(result);
    return {
      mood: parsed.mood || 'Neutral',
      moodValue: parsed.moodValue || 3,
      factors: parsed.factors || [],
      secondaryEmotions: parsed.secondaryEmotions || [],
      color: parsed.color || 'text-gray-500'
    };
  } catch (e) {
    console.error("Mood extraction failed", e);
    return fallback;
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

export interface PatternInsights {
  weeklyInsight: string;
  topFactorInsight: string;
}

export const generatePatternInsights = async (recentMoods: MoodCheckin[]): Promise<PatternInsights> => {
  if (!ai || recentMoods.length === 0) {
    return {
      weeklyInsight: 'Log more entries to unlock AI pattern detection.',
      topFactorInsight: 'Add factors to your mood entries to see what influences your well-being.'
    };
  }

  const moodSummary = recentMoods.slice(0, 10).map(m =>
    `Date: ${new Date(m.date).toLocaleDateString()} (${new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' })}) | Mood: ${m.mood} | Factors: ${m.factors.join(', ')}`
  ).join('\n');

  const prompt = `
  Analyze these mood check-ins to identify patterns:
  ${moodSummary}

  Generate TWO insights:
  1. weeklyInsight: A pattern about days of the week (e.g., "You feel happiest on weekends").
  2. topFactorInsight: The most impactful factor and why (e.g., "Sleep correlates strongly with positive moods").

  Return strictly JSON:
  {
    "weeklyInsight": "...",
    "topFactorInsight": "..."
  }
  `;

  try {
    const result = await generateContent(prompt, "You are an emotional pattern analyst. Respond ONLY in JSON.", true);
    return JSON.parse(result);
  } catch (e) {
    return {
      weeklyInsight: 'Keep logging to reveal your weekly patterns.',
      topFactorInsight: 'Your factors will reveal themselves with more data.'
    };
  }
};

export interface DailyQuote {
  quote: string;
  author: string;
}

export const generateDailyQuote = async (): Promise<DailyQuote> => {
  if (!ai) {
    return { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" };
  }

  const prompt = `
  Generate ONE inspirational quote related to mindfulness, self-reflection, gratitude, or personal growth.
  Return strictly JSON:
  {
    "quote": "...",
    "author": "..."
  }
  `;

  try {
    const result = await generateContent(prompt, "You are a wise philosopher. Respond ONLY in JSON.", true);
    return JSON.parse(result);
  } catch (e) {
    return { quote: "The mind is everything. What you think you become.", author: "Buddha" };
  }
};

export interface QuickPrompt {
  icon: string;
  color: string;
  text: string;
  promptType: string;
}

export const generateQuickPrompts = async (): Promise<QuickPrompt[]> => {
  if (!ai) {
    return [
      { icon: 'spark', color: 'purple', text: 'What is on your mind?', promptType: 'feeling' },
      { icon: 'bedtime', color: 'blue', text: 'Did you dream last night?', promptType: 'dream' },
      { icon: 'favorite', color: 'pink', text: 'Name something you are thankful for.', promptType: 'gratitude' }
    ];
  }

  const prompt = `
  Generate 3 SHORT journaling prompts (max 8 words each) for a mindfulness app.
  Return strictly JSON array:
  [
    { "icon": "spark", "color": "purple", "text": "...", "promptType": "feeling" },
    { "icon": "bedtime", "color": "blue", "text": "...", "promptType": "dream" },
    { "icon": "favorite", "color": "pink", "text": "...", "promptType": "gratitude" }
  ]
  `;

  try {
    const result = await generateContent(prompt, "You are a mindfulness coach. Respond ONLY in JSON.", true);
    return JSON.parse(result);
  } catch (e) {
    return [
      { icon: 'spark', color: 'purple', text: 'What is on your mind?', promptType: 'feeling' },
      { icon: 'bedtime', color: 'blue', text: 'Did you dream last night?', promptType: 'dream' },
      { icon: 'favorite', color: 'pink', text: 'Name something you are thankful for.', promptType: 'gratitude' }
    ];
  }
};

export const generateSentenceCompletion = async (context: string): Promise<string> => {
  if (!ai) return "";

  const prompt = `
    You are an AI writing assistant. Your job is to strictly COMPLETE the user's sentence.
    
    Context: "${context}"
    
    Rules:
    1. Continue the text EXACTLY where it left off. DO NOT REPEAT the last words of context.
    2. Maintain the user's voice (first person "I").
    3. Do NOT give advice or answer a question.
    4. If the sentence ends abruptly, finish it.
    5. If the sentence is complete, add a natural flowing next sentence.
    6. Keep it short (max 8 words).
    7. Return ONLY the completion text.
    `;

  try {
    // Use a quicker, lighter request if possible, but standard generateContent works.
    const result = await generateContent(prompt, "You are a helpful writing assistant. Complete the user's thought.", false);
    // Ensure no repetition of the end of the context if the model hallucinates it back
    let completion = result.replace(/^"/, '').replace(/"$/, '').trim();

    // Simple overlap check (naive)
    if (completion.toLowerCase().startsWith(context.slice(-5).toLowerCase())) {
      completion = completion.slice(context.slice(-5).length);
    }

    return completion;
  } catch {
    return "";
  }
}
