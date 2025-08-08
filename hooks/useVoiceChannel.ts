


import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { User, VoiceRoomParticipant, Transcription } from '../types';

const API_URL = 'http://localhost:5000/api';
const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const VAD_THRESHOLD = -50; // dB
const VAD_SILENCE_TIMEOUT = 2000; // ms

export const useVoiceChannel = (socket: Socket | null, currentUser: User | null) => {
    const [isConnected, setIsConnected] = useState(false);
    const [localAudioStream, setLocalAudioStream] = useState<MediaStream | null>(null);
    const [remoteAudioStreams, setRemoteAudioStreams] = useState<Map<string, MediaStream>>(new Map());
    const [speakingPeers, setSpeakingPeers] = useState<Set<string>>(new Set());
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Voice Activity Detection refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const silenceTimerRef = useRef<number | null>(null);
    const isSpeakingRef = useRef(false);

    const cleanupConnections = useCallback(() => {
        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();
        if (localAudioStream) {
            localAudioStream.getTracks().forEach(track => track.stop());
        }
        setLocalAudioStream(null);
        setRemoteAudioStreams(new Map());
        setIsConnected(false);
        setSpeakingPeers(new Set());
    }, [localAudioStream]);

    const setupVAD = useCallback((stream: MediaStream) => {
        if (!stream.getAudioTracks().length) return;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkSpeaking = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (const amplitude of dataArray) {
                sum += amplitude * amplitude;
            }
            const rms = Math.sqrt(sum / dataArray.length);
            const db = 20 * Math.log10(rms);

            if (db > VAD_THRESHOLD) {
                if (!isSpeakingRef.current) {
                    isSpeakingRef.current = true;
                    // Start recording
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
                        mediaRecorderRef.current.start(1000); // chunk every second
                    }
                }
                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                }
                silenceTimerRef.current = window.setTimeout(() => {
                    isSpeakingRef.current = false;
                    // Stop recording
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                        mediaRecorderRef.current.stop();
                    }
                }, VAD_SILENCE_TIMEOUT);
            }
            requestAnimationFrame(checkSpeaking);
        };
        checkSpeaking();
    }, []);

    const setupMediaRecorder = useCallback((stream: MediaStream, conversationId: string) => {
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };
        mediaRecorderRef.current.onstop = async () => {
            if (audioChunksRef.current.length === 0) return;
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            audioChunksRef.current = [];

            const formData = new FormData();
            formData.append('file', audioBlob, `transcription-${Date.now()}.webm`);
            formData.append('conversationId', conversationId);
            
            try {
                await fetch(`${API_URL}/ai/transcribe-audio`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('whisspra_token')}` },
                    body: formData,
                });
            } catch (error) {
                console.error("Transcription upload failed:", error);
            }
        };
    }, []);

    const joinVoiceRoom = useCallback(async (conversationId: string) => {
        if (!socket || !currentUser) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setLocalAudioStream(stream);
            setIsConnected(true);
            socket.emit('join-voice-room', { conversationId });
            setupMediaRecorder(stream, conversationId);
            setupVAD(stream);
        } catch (err) {
            console.error('Could not get audio stream', err);
        }
    }, [socket, currentUser, setupVAD, setupMediaRecorder]);

    const leaveVoiceRoom = useCallback((conversationId: string) => {
        if (!socket) return;
        socket.emit('leave-voice-room', { conversationId });
        cleanupConnections();
    }, [socket, cleanupConnections]);

    useEffect(() => {
        if (!socket || !localAudioStream || !currentUser) return;
        
        const createPeerConnection = (otherUserId: string) => {
            const pc = new RTCPeerConnection(ICE_SERVERS);
            localAudioStream.getTracks().forEach(track => pc.addTrack(track, localAudioStream));
            
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('voice-candidate', { to: otherUserId, candidate: event.candidate });
                }
            };
            
            pc.ontrack = (event) => {
                setRemoteAudioStreams(prev => new Map(prev).set(otherUserId, event.streams[0]));
            };
            
            peerConnectionsRef.current.set(otherUserId, pc);
            return pc;
        };
        
        const handleNewParticipant = async ({ userId }: { userId: string }) => {
            if (userId === currentUser.id) return;
            const pc = createPeerConnection(userId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('voice-offer', { to: userId, offer });
        };
        
        const handleOffer = async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
            const pc = createPeerConnection(from);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('voice-answer', { to: from, answer });
        };
        
        const handleAnswer = async ({ from, answer }: { from: string, answer: RTCSessionDescriptionInit }) => {
            const pc = peerConnectionsRef.current.get(from);
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
        };
        
        const handleCandidate = async ({ from, candidate }: { from: string, candidate: RTCIceCandidateInit }) => {
             const pc = peerConnectionsRef.current.get(from);
             if (pc) {
                 await pc.addIceCandidate(new RTCIceCandidate(candidate));
             }
        };

        const handleParticipantLeft = ({ userId }: { userId: string }) => {
            const pc = peerConnectionsRef.current.get(userId);
            if (pc) {
                pc.close();
                peerConnectionsRef.current.delete(userId);
            }
            setRemoteAudioStreams(prev => {
                const newMap = new Map(prev);
                newMap.delete(userId);
                return newMap;
            });
        };
        
        const handleNewTranscription = (transcription: Transcription) => {
            setTranscriptions(prev => [...prev.slice(-4), transcription]); // Keep last 5
        };

        (socket as any).on('voice-new-participant', handleNewParticipant);
        (socket as any).on('voice-offer', handleOffer);
        (socket as any).on('voice-answer', handleAnswer);
        (socket as any).on('voice-candidate', handleCandidate);
        (socket as any).on('voice-participant-left', handleParticipantLeft);
        (socket as any).on('new-transcription', handleNewTranscription);
        (socket as any).on('speaking', ({ userId }) => setSpeakingPeers(prev => new Set(prev).add(userId)));
        (socket as any).on('stopped-speaking', ({ userId }) => setSpeakingPeers(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
        }));

        return () => {
             (socket as any).off('voice-new-participant', handleNewParticipant);
             (socket as any).off('voice-offer', handleOffer);
             (socket as any).off('voice-answer', handleAnswer);
             (socket as any).off('voice-candidate', handleCandidate);
             (socket as any).off('voice-participant-left', handleParticipantLeft);
             (socket as any).off('new-transcription', handleNewTranscription);
             (socket as any).off('speaking');
             (socket as any).off('stopped-speaking');
        };

    }, [socket, currentUser, localAudioStream]);

    const mute = () => {
        if (localAudioStream) {
            localAudioStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
        }
    };

    return { isConnected, joinVoiceRoom, leaveVoiceRoom, mute, localAudioStream, remoteAudioStreams, speakingPeers, transcriptions };
};