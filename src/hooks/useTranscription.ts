
import { useState, useCallback } from 'react';
import { API_URL } from '../config';
import { getStorageItem } from '../utils/storage';

export const useTranscription = () => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startTranscription = useCallback(async (audioUrl: string) => {
        setIsTranscribing(true);
        setError(null);
        setTranscription(null);

        try {
            const token = await getStorageItem('whisspra_token');
            const response = await fetch(audioUrl);
            const audioBlob = await response.blob();
            
            const formData = new FormData();
            formData.append('file', audioBlob, `transcription-${Date.now()}.webm`);

            const transcriptionResponse = await fetch(`${API_URL}/ai/transcribe-audio`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!transcriptionResponse.ok) {
                const errorData = await transcriptionResponse.json();
                throw new Error(errorData.message || 'Transcription failed.');
            }

            const data = await transcriptionResponse.json();
            
            if (data.transcription) {
                setTranscription(data.transcription);
            } else {
                throw new Error("Received an empty transcription from the server.");
            }

        } catch (err) {
            console.error("Transcription Error:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during transcription.";
            setError(errorMessage);
        } finally {
            setIsTranscribing(false);
        }
    }, []);

    return { isTranscribing, transcription, error, startTranscription };
};
