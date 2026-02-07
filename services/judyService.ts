import {
    GoogleGenAI,
    LiveServerMessage,
    Modality,
    Session,
    TurnCoverage,
} from '@google/genai';
import { JournalEntry } from '../types';
import { MoodCheckin } from '../utils/storage';

// Get API key from environment
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Live API Model
const LIVE_MODEL = 'models/gemini-2.5-flash-native-audio-preview-12-2025';

// Judy's therapeutic persona
const JUDY_SYSTEM_PROMPT = `You are Judy, a compassionate and skilled AI therapeutic companion. Your role is to provide supportive, evidence-based therapy using techniques from:
- Cognitive Behavioral Therapy (CBT)
- Mindfulness-Based Stress Reduction (MBSR)
- Dialectical Behavior Therapy (DBT)

Guidelines:
1. Always maintain a warm, empathetic, non-judgmental tone
2. Use active listening and reflect back what the user shares
3. When appropriate, gently challenge negative thought patterns
4. Offer grounding exercises when detecting distress
5. Celebrate progress and positive changes
6. Maintain therapeutic boundaries - you are an AI companion, not a replacement for professional help
7. If the user mentions self-harm, crisis, or severe distress, encourage them to seek professional help

You have access to the user's recent journal entries and mood data. Use this context to personalize your responses and track their emotional journey over time.

Speak naturally and conversationally. Keep responses concise but meaningful.`;

export interface JudySessionState {
    isConnected: boolean;
    isConnecting: boolean;
    isSpeaking: boolean;
    isListening: boolean;
    transcript: string[];
    error: string | null;
}

export interface JudyCallbacks {
    onConnectionChange: (connected: boolean) => void;
    onTranscriptUpdate: (transcript: string[]) => void;
    onAudioReceived: (audioData: string, mimeType: string) => void;
    onError: (error: string) => void;
    onSpeakingChange: (speaking: boolean) => void;
}

class JudyService {
    private session: Session | null = null;
    private ai: GoogleGenAI | null = null;
    private responseQueue: LiveServerMessage[] = [];
    private callbacks: JudyCallbacks | null = null;
    private transcript: string[] = [];
    private audioContext: AudioContext | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private audioStream: MediaStream | null = null;
    private isProcessing = false;

    constructor() {
        if (GEMINI_API_KEY) {
            this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        }
    }

    /**
     * Prepare therapy context from user's journal entries and mood data
     */
    prepareTherapyContext(entries: JournalEntry[], moods: MoodCheckin[]): string {
        // Get recent entries (last 7 days)
        const recentEntries = entries
            .filter(e => {
                const entryDate = new Date(e.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return entryDate >= weekAgo;
            })
            .slice(0, 5)
            .map(e => `[${e.date}] ${e.title}: ${e.excerpt}`)
            .join('\n');

        // Get recent moods
        const recentMoods = moods
            .slice(0, 7)
            .map(m => `[${new Date(m.date).toLocaleDateString()}] Mood: ${m.mood} (${m.moodValue}/5) - Factors: ${m.factors.join(', ')}`)
            .join('\n');

        // Calculate mood trend
        const avgMood = moods.length > 0
            ? moods.slice(0, 7).reduce((sum, m) => sum + m.moodValue, 0) / Math.min(moods.length, 7)
            : 3;

        const moodTrend = avgMood >= 4 ? 'positive' : avgMood >= 3 ? 'stable' : 'challenging';

        return `
USER CONTEXT (Use this to personalize the session):

Recent Journal Entries:
${recentEntries || 'No recent entries'}

Recent Mood Check-ins:
${recentMoods || 'No recent mood data'}

Current Mood Trend: ${moodTrend} (avg: ${avgMood.toFixed(1)}/5)

Use this context to understand the user's recent emotional state and personalize your therapeutic approach.
`;
    }

    /**
     * Connect to Gemini Live API and start session
     */
    async connect(
        entries: JournalEntry[],
        moods: MoodCheckin[],
        callbacks: JudyCallbacks
    ): Promise<boolean> {
        if (!this.ai) {
            callbacks.onError('Gemini API key not configured');
            return false;
        }

        this.callbacks = callbacks;
        this.transcript = [];

        try {
            // Prepare context
            const therapyContext = this.prepareTherapyContext(entries, moods);
            const fullSystemPrompt = `${JUDY_SYSTEM_PROMPT}\n\n${therapyContext}`;

            // Configure Live API session
            const config = {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: 'Zephyr', // Calm, soothing voice
                        }
                    }
                },
                realtimeInputConfig: {
                    turnCoverage: TurnCoverage.TURN_INCLUDES_ALL_INPUT,
                },
                systemInstruction: fullSystemPrompt,
                contextWindowCompression: {
                    triggerTokens: '25600',
                    slidingWindow: { targetTokens: '12800' },
                },
            };

            // Connect to Live API
            this.session = await this.ai.live.connect({
                model: LIVE_MODEL,
                callbacks: {
                    onopen: () => {
                        console.debug('[Judy] Session opened');
                        callbacks.onConnectionChange(true);
                    },
                    onmessage: (message: LiveServerMessage) => {
                        this.handleServerMessage(message);
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('[Judy] Error:', e.message);
                        callbacks.onError(e.message);
                    },
                    onclose: (e: CloseEvent) => {
                        console.debug('[Judy] Session closed:', e.reason);
                        callbacks.onConnectionChange(false);
                    },
                },
                config
            });

            // Send initial greeting
            this.session.sendClientContent({
                turns: [
                    'Please greet the user warmly and ask how they are feeling today. Keep it brief and natural.'
                ]
            });

            // Start processing responses
            this.startResponseProcessor();

            return true;
        } catch (error: any) {
            console.error('[Judy] Connection failed:', error);
            callbacks.onError(error.message || 'Failed to connect');
            return false;
        }
    }

    /**
     * Handle incoming server messages
     */
    private handleServerMessage(message: LiveServerMessage) {
        this.responseQueue.push(message);
    }

    /**
     * Process response queue
     */
    private async startResponseProcessor() {
        this.isProcessing = true;

        while (this.isProcessing && this.session) {
            const message = this.responseQueue.shift();

            if (message) {
                // Handle text content
                if (message.serverContent?.modelTurn?.parts) {
                    for (const part of message.serverContent.modelTurn.parts) {
                        // Handle text
                        if (part.text) {
                            this.transcript.push(`Judy: ${part.text}`);
                            this.callbacks?.onTranscriptUpdate([...this.transcript]);
                        }

                        // Handle audio
                        if (part.inlineData) {
                            this.callbacks?.onSpeakingChange(true);
                            this.callbacks?.onAudioReceived(
                                part.inlineData.data ?? '',
                                part.inlineData.mimeType ?? 'audio/pcm'
                            );
                        }
                    }
                }

                // Check for turn completion
                if (message.serverContent?.turnComplete) {
                    this.callbacks?.onSpeakingChange(false);
                }
            } else {
                // Wait before checking again
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }

    /**
     * Send text message to Judy
     */
    async sendMessage(text: string) {
        if (!this.session) {
            console.warn('[Judy] No active session');
            return;
        }

        // Add to transcript
        this.transcript.push(`You: ${text}`);
        this.callbacks?.onTranscriptUpdate([...this.transcript]);

        // Send to API
        this.session.sendClientContent({
            turns: [text]
        });
    }

    /**
     * Start capturing audio from microphone
     */
    async startAudioCapture(): Promise<boolean> {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new AudioContext({ sampleRate: 16000 });

            // Create media recorder
            this.mediaRecorder = new MediaRecorder(this.audioStream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0 && this.session) {
                    // Convert to base64 and send
                    const arrayBuffer = await event.data.arrayBuffer();
                    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

                    this.session.sendRealtimeInput({
                        data: base64,
                        mimeType: 'audio/webm;codecs=opus'
                    } as any);
                }
            };

            this.mediaRecorder.start(250); // Send chunks every 250ms
            return true;
        } catch (error: any) {
            console.error('[Judy] Audio capture failed:', error);
            this.callbacks?.onError('Microphone access denied');
            return false;
        }
    }

    /**
     * Stop audio capture
     */
    stopAudioCapture() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
        }
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    /**
     * Disconnect session
     */
    disconnect() {
        this.isProcessing = false;
        this.stopAudioCapture();

        if (this.session) {
            this.session.close();
            this.session = null;
        }

        this.responseQueue = [];
        this.transcript = [];
        this.callbacks = null;
    }

    /**
     * Check if API is available
     */
    isAvailable(): boolean {
        return !!this.ai;
    }
}

// Singleton instance
export const judyService = new JudyService();
