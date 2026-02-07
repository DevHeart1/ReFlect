import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JournalEntry } from '../types';
import { MoodCheckin } from '../utils/storage';
import { judyService, JudySessionState, JudyCallbacks } from '../services/judyService';

interface JudyPageProps {
    entries: JournalEntry[];
    moods: MoodCheckin[];
}

export const JudyPage: React.FC<JudyPageProps> = ({ entries, moods }) => {
    // Session state
    const [sessionState, setSessionState] = useState<JudySessionState>({
        isConnected: false,
        isConnecting: false,
        isSpeaking: false,
        isListening: false,
        transcript: [],
        error: null,
    });

    // Text input for manual typing
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    // Audio playback
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioQueueRef = useRef<AudioBuffer[]>([]);
    const isPlayingRef = useRef(false);

    // Transcript scroll ref
    const transcriptRef = useRef<HTMLDivElement>(null);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [sessionState.transcript]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            judyService.disconnect();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    /**
     * Play audio data received from Judy
     */
    const playAudio = useCallback(async (audioData: string, mimeType: string) => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
            }

            // Decode base64 audio
            const binaryString = atob(audioData);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // For PCM audio, we need to create a proper WAV buffer
            if (mimeType.includes('L16') || mimeType.includes('pcm')) {
                // Parse sample rate from mimeType
                const rateMatch = mimeType.match(/rate=(\d+)/);
                const sampleRate = rateMatch ? parseInt(rateMatch[1]) : 24000;

                // Create audio buffer from PCM data
                const audioBuffer = audioContextRef.current.createBuffer(1, bytes.length / 2, sampleRate);
                const channelData = audioBuffer.getChannelData(0);

                for (let i = 0; i < bytes.length / 2; i++) {
                    // Convert 16-bit PCM to float
                    const sample = (bytes[i * 2] | (bytes[i * 2 + 1] << 8));
                    channelData[i] = sample < 32768 ? sample / 32768 : (sample - 65536) / 32768;
                }

                // Queue and play
                audioQueueRef.current.push(audioBuffer);
                if (!isPlayingRef.current) {
                    playNextInQueue();
                }
            } else {
                // For other formats, try to decode directly
                const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
                audioQueueRef.current.push(audioBuffer);
                if (!isPlayingRef.current) {
                    playNextInQueue();
                }
            }
        } catch (error) {
            console.error('[Judy] Audio playback error:', error);
        }
    }, []);

    const playNextInQueue = useCallback(() => {
        if (audioQueueRef.current.length === 0 || !audioContextRef.current) {
            isPlayingRef.current = false;
            return;
        }

        isPlayingRef.current = true;
        const buffer = audioQueueRef.current.shift()!;

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => playNextInQueue();
        source.start();
    }, []);

    /**
     * Start therapy session
     */
    const startSession = async () => {
        setSessionState(prev => ({ ...prev, isConnecting: true, error: null }));

        const callbacks: JudyCallbacks = {
            onConnectionChange: (connected) => {
                setSessionState(prev => ({
                    ...prev,
                    isConnected: connected,
                    isConnecting: false,
                }));
            },
            onTranscriptUpdate: (transcript) => {
                setSessionState(prev => ({ ...prev, transcript }));
            },
            onAudioReceived: (audioData, mimeType) => {
                playAudio(audioData, mimeType);
            },
            onError: (error) => {
                setSessionState(prev => ({
                    ...prev,
                    error,
                    isConnecting: false,
                    isConnected: false,
                }));
            },
            onSpeakingChange: (speaking) => {
                setSessionState(prev => ({ ...prev, isSpeaking: speaking }));
            },
        };

        const success = await judyService.connect(entries, moods, callbacks);
        if (!success) {
            setSessionState(prev => ({ ...prev, isConnecting: false }));
        }
    };

    /**
     * End therapy session
     */
    const endSession = () => {
        judyService.disconnect();
        setIsRecording(false);
        setSessionState({
            isConnected: false,
            isConnecting: false,
            isSpeaking: false,
            isListening: false,
            transcript: sessionState.transcript, // Keep transcript
            error: null,
        });
    };

    /**
     * Send text message
     */
    const sendMessage = () => {
        if (!inputText.trim()) return;
        judyService.sendMessage(inputText.trim());
        setInputText('');
    };

    /**
     * Toggle microphone recording
     */
    const toggleRecording = async () => {
        if (isRecording) {
            judyService.stopAudioCapture();
            setIsRecording(false);
            setSessionState(prev => ({ ...prev, isListening: false }));
        } else {
            const success = await judyService.startAudioCapture();
            if (success) {
                setIsRecording(true);
                setSessionState(prev => ({ ...prev, isListening: true }));
            }
        }
    };

    // Check if API is available
    const isApiAvailable = judyService.isAvailable();

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background-light to-indigo-50 dark:from-gray-900 dark:via-background-dark dark:to-violet-900/20 p-6 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <header className="text-center space-y-4 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                        <span className="material-symbols-outlined text-white text-4xl">psychology_alt</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                        Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Judy</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-lg">
                        Your AI therapeutic companion for mindful conversations and emotional support
                    </p>
                </header>

                {/* API Warning */}
                {!isApiAvailable && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">warning</span>
                        <div>
                            <p className="font-semibold text-amber-800 dark:text-amber-300">API Key Required</p>
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                Please configure your Gemini API key in the environment variables (VITE_GEMINI_API_KEY) to use Judy.
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {sessionState.error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                        <div>
                            <p className="font-semibold text-red-800 dark:text-red-300">Connection Error</p>
                            <p className="text-sm text-red-700 dark:text-red-400">{sessionState.error}</p>
                        </div>
                    </div>
                )}

                {/* Main Session Card */}
                <div className="bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Status Bar */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${sessionState.isConnected
                                    ? 'bg-green-500 animate-pulse'
                                    : sessionState.isConnecting
                                        ? 'bg-amber-500 animate-pulse'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`} />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {sessionState.isConnected
                                    ? 'Session Active'
                                    : sessionState.isConnecting
                                        ? 'Connecting...'
                                        : 'Session Inactive'}
                            </span>
                        </div>
                        {sessionState.isSpeaking && (
                            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                                <span className="material-symbols-outlined text-sm animate-pulse">volume_up</span>
                                <span className="text-sm font-medium">Judy is speaking...</span>
                            </div>
                        )}
                    </div>

                    {/* Transcript Area */}
                    <div
                        ref={transcriptRef}
                        className="h-80 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900/50"
                    >
                        {sessionState.transcript.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">forum</span>
                                <p className="text-center">
                                    {sessionState.isConnected
                                        ? 'Waiting for Judy to greet you...'
                                        : 'Start a session to begin your therapy conversation'}
                                </p>
                            </div>
                        ) : (
                            sessionState.transcript.map((line, index) => {
                                const isJudy = line.startsWith('Judy:');
                                return (
                                    <div
                                        key={index}
                                        className={`flex ${isJudy ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isJudy
                                                ? 'bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                                                : 'bg-violet-600 text-white rounded-tr-sm'
                                            }`}>
                                            <p className={`text-sm ${isJudy ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>
                                                {line.replace(/^(Judy|You): /, '')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input Area */}
                    {sessionState.isConnected && (
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark">
                            <div className="flex items-center gap-3">
                                {/* Microphone Button */}
                                <button
                                    onClick={toggleRecording}
                                    className={`p-3 rounded-full transition-all ${isRecording
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    title={isRecording ? 'Stop recording' : 'Start recording'}
                                >
                                    <span className="material-symbols-outlined">
                                        {isRecording ? 'stop' : 'mic'}
                                    </span>
                                </button>

                                {/* Text Input */}
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-violet-500 text-gray-800 dark:text-gray-200 placeholder-gray-400"
                                />

                                {/* Send Button */}
                                <button
                                    onClick={sendMessage}
                                    disabled={!inputText.trim()}
                                    className="p-3 rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Session Controls */}
                    {!sessionState.isConnected && !sessionState.isConnecting && (
                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                            <button
                                onClick={startSession}
                                disabled={!isApiAvailable}
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <span className="material-symbols-outlined">play_circle</span>
                                Start Therapy Session
                            </button>
                        </div>
                    )}

                    {sessionState.isConnected && (
                        <div className="px-6 pb-6 flex justify-center">
                            <button
                                onClick={endSession}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-medium transition-colors"
                            >
                                <span className="material-symbols-outlined">stop_circle</span>
                                End Session
                            </button>
                        </div>
                    )}
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400">shield</span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Private & Secure</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your conversations are processed securely and not stored after the session.</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-violet-600 dark:text-violet-400">auto_awesome</span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Personalized</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Judy uses your journal and mood data to provide tailored support.</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">info</span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Not a Replacement</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Judy is a companion tool, not a substitute for professional therapy.</p>
                    </div>
                </div>

                {/* Context Preview (for debugging/transparency) */}
                {entries.length > 0 || moods.length > 0 ? (
                    <details className="bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <span className="material-symbols-outlined text-sm mr-2 align-middle">database</span>
                            View data Judy will use ({entries.length} entries, {moods.length} moods)
                        </summary>
                        <div className="px-6 pb-4 text-xs text-gray-500 dark:text-gray-500 space-y-2 max-h-48 overflow-y-auto">
                            <p className="font-semibold">Recent Entries:</p>
                            <ul className="list-disc list-inside">
                                {entries.slice(0, 3).map(e => (
                                    <li key={e.id}>{e.title} ({new Date(e.date).toLocaleDateString()})</li>
                                ))}
                            </ul>
                            <p className="font-semibold mt-3">Recent Moods:</p>
                            <ul className="list-disc list-inside">
                                {moods.slice(0, 5).map(m => (
                                    <li key={m.id}>{m.mood} - {new Date(m.date).toLocaleDateString()}</li>
                                ))}
                            </ul>
                        </div>
                    </details>
                ) : null}
            </div>
        </div>
    );
};
