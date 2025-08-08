import { useState, useCallback } from 'react';

const API_URL = 'http://localhost:5000/api';

export const useTranscription = () => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startTranscription = useCallback(async (audioUrl: string) => {
        setIsTranscribing(true);
        setError(null);
        setTranscription(null);

        try {
            const response = await fetch(audioUrl);
            const audioBlob = await response.blob();
            
            const formData = new FormData();
            formData.append('file', audioBlob, `transcription-${Date.now()}.webm`);

            const transcriptionResponse = await fetch(`${API_URL}/ai/transcribe-audio`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('whisspra_token')}` },
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