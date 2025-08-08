
import { useState, useRef, useCallback } from 'react';

interface AudioRecorderOptions {
    onRecordingComplete: (blob: Blob, duration: number) => void;
}

const useAudioRecorder = ({ onRecordingComplete }: AudioRecorderOptions) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<number | null>(null);
    const recordingStartTimeRef = useRef<number>(0);
    const onRecordingCompleteRef = useRef(onRecordingComplete);
    onRecordingCompleteRef.current = onRecordingComplete;

    const stopTimer = useCallback(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        recordingStartTimeRef.current = Date.now();
        setRecordingTime(0);
        timerIntervalRef.current = window.setInterval(() => {
            const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000;
            setRecordingTime(elapsed);
        }, 100);
    }, []);

    const startRecording = useCallback(async () => {
        if (isRecording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                stopTimer();
                const finalDuration = (Date.now() - recordingStartTimeRef.current) / 1000;
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                onRecordingCompleteRef.current(audioBlob, finalDuration);

                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
                setRecordingTime(0);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            startTimer();
        } catch (error) {
            console.error("Error starting audio recording:", error);
            alert("Microphone access was denied. Please allow microphone access in your browser settings.");
        }
    }, [isRecording, startTimer, stopTimer]);

    const stopRecording = useCallback(() => {
        if (!isRecording || !mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;
        mediaRecorderRef.current.stop();
    }, [isRecording]);
    
    const cancelRecording = useCallback(() => {
        if (!isRecording || !mediaRecorderRef.current) return;
        
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current.onstop = null; 
        
        if (mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }

        stopTimer();
        setIsRecording(false);
        setRecordingTime(0);
        audioChunksRef.current = [];
    }, [isRecording, stopTimer]);

    return {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        cancelRecording,
    };
};

export default useAudioRecorder;