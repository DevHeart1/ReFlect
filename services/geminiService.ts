import { GoogleGenAI } from "@google/genai";
import { TemplateBlock } from "../types";

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize AI with Thinking Model Configuration
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODEL_NAME = 'gemini-2.0-flash-thinking-exp-01-21'; // Using the latest preview model
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

