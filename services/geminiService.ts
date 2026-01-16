import { GoogleGenAI } from "@google/genai";

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Only initialize AI if API key is provided
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateMindfulnessPrompt = async (): Promise<string> => {
  // Return fallback if no API key is configured
  if (!ai) {
    console.warn("No Gemini API key configured. Using fallback prompt.");
    return "What is one small thing that brought you joy today?";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a short, thoughtful, and unique journaling prompt for someone looking to practice mindfulness today. Keep it under 20 words.',
      config: {
        systemInstruction: "You are a gentle, empathetic mindfulness coach.",
      }
    });
    return response.text || "What is one small thing that brought you joy today?";
  } catch (error) {
    console.error("Failed to generate prompt:", error);
    return "Reflect on a moment of stillness you experienced recently.";
  }
};

export const generateGratitudePrompt = async (): Promise<string> => {
  // Return fallback if no API key is configured
  if (!ai) {
    console.warn("No Gemini API key configured. Using fallback prompt.");
    return "What made you smile today?";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a short, inspiring gratitude journaling prompt. Less than 20 words.',
      config: {
        systemInstruction: "You are a warm, encouraging mindfulness companion.",
      }
    });
    return response.text || "What made you smile today?";
  } catch (error) {
    console.error("Failed to generate gratitude prompt:", error);
    return "List three things that brought you comfort today.";
  }
};
