
import { useState, useCallback } from 'react';
import { SmartReply, ChatMessage, VibeReply, Conversation, User } from '../types';
import { API_URL } from '../config';
import { getStorageItem } from '../utils/storage';

const useGemini = () => {
    const [suggestions, setSuggestions] = useState<SmartReply[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [summary, setSummary] = useState<string>('');
    const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const [vibeReplies, setVibeReplies] = useState<VibeReply[]>([]);
    const [vibeRepliesLoading, setVibeRepliesLoading] = useState<boolean>(false);
    const [vibeRepliesError, setVibeRepliesError] = useState<string | null>(null);

    const [aiTwinSuggestion, setAiTwinSuggestion] = useState<string>('');
    const [aiTwinSuggestionLoading, setAiTwinSuggestionLoading] = useState<boolean>(false);
    const [aiTwinSuggestionError, setAiTwinSuggestionError] = useState<string | null>(null);

    const [translatedText, setTranslatedText] = useState<string>('');
    const [translationLoading, setTranslationLoading] = useState<boolean>(false);
    const [translationError, setTranslationError] = useState<string | null>(null);

    const getHeaders = async () => {
        const token = await getStorageItem('whisspra_token');
        return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    };

    const generateSuggestions = useCallback(async (messageText: string) => {
        setLoading(true);
        setError(null);
        setSuggestions([]);

        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_URL}/ai/suggestions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ messageText }),
            });
            if (!response.ok) throw new Error('Failed to fetch suggestions.');
            const data = await response.json();
            const replies: string[] = data.replies || data;
            
            if (replies.length > 0) {
                setSuggestions(replies.map((reply, i) => ({ id: `sr-${Date.now()}-${i}`, text: reply })));
            }
        } catch (err) {
            console.error("Error generating suggestions:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setSuggestions([
                { id: 'fallback-1', text: 'Okay' },
                { id: 'fallback-2', text: 'Thanks!' },
                { id: 'fallback-3', text: 'I\'m not sure' },
            ]);
        } finally {
            setLoading(false);
        }
    }, []);

    const generateSummary = useCallback(async (messages: ChatMessage[]) => {
        setSummaryLoading(true);
        setSummaryError(null);
        setSummary('');

        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_URL}/ai/summary`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ messages }),
            });
            if (!response.ok) throw new Error('Failed to generate summary.');
            const data = await response.json();
            setSummary(data.summary);
        } catch (err) {
            console.error("Error generating summary:", err);
            setSummaryError(err instanceof Error ? err.message : "An unknown error occurred during summarization.");
        } finally {
            setSummaryLoading(false);
        }

    }, []);

    const generateVibeReplies = useCallback(async (conversation: Conversation, userMessage: string, currentUser: User) => {
        setVibeRepliesLoading(true);
        setVibeRepliesError(null);
        setVibeReplies([]);

        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_URL}/ai/vibe-replies`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ conversation, userMessage, currentUser }),
            });
            if (!response.ok) throw new Error('Failed to generate vibe replies.');
            const data = await response.json();
            setVibeReplies(data.replies || []);
        } catch (err) {
            console.error("Error generating vibe replies:", err);
            setVibeRepliesError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setVibeRepliesLoading(false);
        }
    }, []);

    const generateAiTwinSuggestion = useCallback(async (conversationId: string): Promise<string | null> => {
        setAiTwinSuggestionLoading(true);
        setAiTwinSuggestionError(null);
        setAiTwinSuggestion('');

        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_URL}/ai/twin/${conversationId}/suggest`, {
                method: 'POST',
                headers,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get suggestion.');
            }
            setAiTwinSuggestion(data.suggestion);
            return data.suggestion;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setAiTwinSuggestionError(errorMessage);
            return null;
        } finally {
            setAiTwinSuggestionLoading(false);
        }
    }, []);

    const translateTextMessage = useCallback(async (text: string, mood: string): Promise<string | null> => {
        setTranslationLoading(true);
        setTranslationError(null);
        setTranslatedText('');
    
        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_URL}/ai/text-mood`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ text, mood })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to translate text.');
            }
            setTranslatedText(data.translatedText);
            return data.translatedText;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setTranslationError(errorMessage);
            return null;
        } finally {
            setTranslationLoading(false);
        }
    }, []);

    return { 
        suggestions, 
        loading, 
        error, 
        generateSuggestions,
        summary,
        summaryLoading,
        summaryError,
        generateSummary,
        vibeReplies,
        vibeRepliesLoading,
        vibeRepliesError,
        generateVibeReplies,
        aiTwinSuggestion,
        aiTwinSuggestionLoading,
        aiTwinSuggestionError,
        generateAiTwinSuggestion,
        translatedText,
        translationLoading,
        translationError,
        translateTextMessage
    };
};

export default useGemini;
