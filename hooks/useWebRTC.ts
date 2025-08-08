

import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { User, CallState } from '../types';

const useWebRTC = (
    socket: Socket | null,
    currentUser: User | null,
    callState: CallState,
    setCallState: React.Dispatch<React.SetStateAction<CallState>>
) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const cameraVideoTrackRef = useRef<MediaStreamTrack | null>(null);
    const screenTrackRef = useRef<MediaStreamTrack | null>(null);

    const initializeLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
            return null;
        }
    }, []);

    const createPeerConnection = useCallback((otherUserId: string, stream: MediaStream, isStealthHost: boolean) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = event => {
            setCallState(prev => {
                const newStreams = new Map(prev.remoteStreams);
                newStreams.set(otherUserId, event.streams[0]);
                return { ...prev, remoteStreams: newStreams };
            });
        };

        pc.onicecandidate = event => {
            if (event.candidate && socket) {
                const signalEvent = isStealthHost ? 'stealth-candidate' : 'ice-candidate';
                socket.emit(signalEvent, { to: otherUserId, from: currentUser!.id, candidate: event.candidate });
            }
        };

        peerConnectionsRef.current.set(otherUserId, pc);
        return pc;
    }, [socket, currentUser, setCallState]);

    const startCall = useCallback(async (callee: User) => {
        if (!socket || !currentUser) return;
        const stream = await initializeLocalStream();
        if (!stream) return;
        const pc = createPeerConnection(callee.id, stream, false);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        setCallState(prev => ({ ...prev, isCallActive: true }));
        socket.emit('call-user', { to: callee.id, from: currentUser, signal: offer });
    }, [socket, currentUser, initializeLocalStream, createPeerConnection, setCallState]);

    const startStealthCall = useCallback(async (participants: User[]) => {
        if (!socket || !currentUser) return;
        const stream = await initializeLocalStream();
        if (!stream) return;

        setCallState(prev => ({ ...prev, isCallActive: true, isStealthCall: true }));

        participants.forEach(async (participant) => {
            const pc = createPeerConnection(participant.id, stream, true);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('stealth-offer', { to: participant.id, from: currentUser.id, signal: offer });
        });
        
        socket.emit('start-stealth-call', { participants: participants.map(p => p.id), from: currentUser });

    }, [socket, currentUser, initializeLocalStream, createPeerConnection, setCallState]);

    const acceptCall = useCallback(async () => {
        if (!socket || !currentUser || !callState.caller) return;
        setCallState(prev => ({ ...prev, isReceivingCall: false, isCallActive: true }));
        const stream = await initializeLocalStream();
        if (!stream) return;
        const pc = createPeerConnection(callState.caller.id, stream, false);
        await pc.setRemoteDescription(new RTCSessionDescription(callState.callSignal));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        const signalEvent = callState.isStealthCall ? 'stealth-answer' : 'accept-call';
        socket.emit(signalEvent, { to: callState.caller.id, from: currentUser.id, signal: answer });
    }, [callState, socket, currentUser, initializeLocalStream, createPeerConnection, setCallState]);

    const endCall = useCallback(() => {
        const participantIds = Array.from(peerConnectionsRef.current.keys());
        if (callState.isStealthCall && currentUser) {
            socket?.emit('stealth-end-call', { participants: participantIds });
        } else if (participantIds.length > 0) {
            socket?.emit('end-call', { to: participantIds[0] });
        }

        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (screenTrackRef.current) {
            screenTrackRef.current.stop();
        }
        setLocalStream(null);
        setCallState({ isReceivingCall: false, isCallActive: false, remoteStreams: new Map() });
        setIsScreenSharing(false);
        cameraVideoTrackRef.current = null;
        screenTrackRef.current = null;
    }, [localStream, setCallState, socket, callState.isStealthCall, currentUser]);

    const toggleMute = useCallback(() => {
        if(localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        }
    }, [localStream]);

    const toggleVideo = useCallback(() => {
        if(localStream) {
            localStream.getVideoTracks().forEach(track => {
                if (!track.getSettings().displaySurface) {
                     track.enabled = !track.enabled;
                }
            });
        }
    }, [localStream]);

    const toggleScreenShare = useCallback(async () => {
        const pcs = Array.from(peerConnectionsRef.current.values());
        if (pcs.length === 0) return;

        const videoSender = pcs[0].getSenders().find(s => s.track?.kind === 'video');
        if (!videoSender) return;

        if (isScreenSharing) {
            if (screenTrackRef.current) {
                screenTrackRef.current.stop();
                screenTrackRef.current = null;
            }
            if (cameraVideoTrackRef.current) {
                await Promise.all(pcs.map(pc => pc.getSenders().find(s => s.track?.kind === 'video')?.replaceTrack(cameraVideoTrackRef.current!)));
            }
            setIsScreenSharing(false);
            cameraVideoTrackRef.current = null;
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];
                screenTrackRef.current = screenTrack;
                if (videoSender.track) {
                    cameraVideoTrackRef.current = videoSender.track;
                }
                await Promise.all(pcs.map(pc => pc.getSenders().find(s => s.track?.kind === 'video')?.replaceTrack(screenTrack)));
                setIsScreenSharing(true);
                screenTrack.onended = () => toggleScreenShare();
            } catch (err) {
                setIsScreenSharing(false);
            }
        }
    }, [isScreenSharing]);

    useEffect(() => {
        if (!socket) return;

        const handleReceivingCall = ({ from, signal, isStealthCall }: { from: User, signal: any, isStealthCall?: boolean }) => {
            setCallState(prev => ({ ...prev, isReceivingCall: true, caller: from, callSignal: signal, isStealthCall: !!isStealthCall, stealthCallHost: isStealthCall ? from : undefined }));
        };

        const handleCallAccepted = async ({ signal }: { signal: any }) => {
            const pc = peerConnectionsRef.current.values().next().value;
            if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal));
        };

        const handleIceCandidate = ({ candidate }: { candidate: any }) => {
            const pc = peerConnectionsRef.current.values().next().value;
            if (pc) pc.addIceCandidate(new RTCIceCandidate(candidate));
        };
        
        const handleStealthOffer = async ({ from, signal }: { from: string, signal: any }) => {
            if (!socket || !currentUser) return;
            setCallState(prev => ({ ...prev, isReceivingCall: false, isCallActive: true, isStealthCall: true, stealthCallHost: { id: from } as User }));
            const stream = await initializeLocalStream();
            if (!stream) return;
            const pc = createPeerConnection(from, stream, false);
            await pc.setRemoteDescription(new RTCSessionDescription(signal));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('stealth-answer', { to: from, from: currentUser.id, signal: answer });
        };
        
        const handleStealthAnswer = async ({ from, signal }: { from: string, signal: any }) => {
            const pc = peerConnectionsRef.current.get(from);
            if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal));
        };
        
        const handleStealthCandidate = ({ from, candidate }: { from: string, candidate: any }) => {
            const pc = peerConnectionsRef.current.get(from);
            if (pc) pc.addIceCandidate(new RTCIceCandidate(candidate));
        };

        (socket as any).on('receiving-call', handleReceivingCall);
        (socket as any).on('call-accepted', handleCallAccepted);
        (socket as any).on('ice-candidate', handleIceCandidate);
        (socket as any).on('call-ended', endCall);
        (socket as any).on('stealth-offer', handleStealthOffer);
        (socket as any).on('stealth-answer', handleStealthAnswer);
        (socket as any).on('stealth-candidate', handleStealthCandidate);

        return () => {
            (socket as any).off('receiving-call');
            (socket as any).off('call-accepted');
            (socket as any).off('ice-candidate');
            (socket as any).off('call-ended');
            (socket as any).off('stealth-offer');
            (socket as any).off('stealth-answer');
            (socket as any).off('stealth-candidate');
        };
    }, [socket, setCallState, endCall, initializeLocalStream, createPeerConnection, currentUser]);

    return { localStream, remoteStreams: callState.remoteStreams, startCall, acceptCall, endCall, toggleMute, toggleVideo, isScreenSharing, toggleScreenShare, startStealthCall };
};

export default useWebRTC;
