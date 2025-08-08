


import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { User } from '../types';
import { useNotification } from '../context/NotificationContext';

type P2PStatus = 'disconnected' | 'connecting' | 'connected' | 'failed';
type P2PMessageCallback = (message: { senderId: string, text: string }) => void;

const ICE_SERVERS = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const useP2P = (
    socket: Socket | null,
    currentUser: User | null,
    otherUser: User | null,
    onMessageReceived: P2PMessageCallback
) => {
    const [p2pStatus, setP2pStatus] = useState<P2PStatus>('disconnected');
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const { addNotification } = useNotification();
    const onMessageReceivedRef = useRef(onMessageReceived);
    onMessageReceivedRef.current = onMessageReceived;

    const cleanup = useCallback(() => {
        if (dataChannelRef.current) {
            dataChannelRef.current.close();
            dataChannelRef.current = null;
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setP2pStatus('disconnected');
    }, []);

    const createPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = (event) => {
            if (event.candidate && socket && otherUser) {
                socket.emit('p2p-candidate', { to: otherUser.id, candidate: event.candidate });
            }
        };

        pc.onconnectionstatechange = () => {
            switch (pc.connectionState) {
                case 'connected':
                    setP2pStatus('connected');
                    addNotification(`P2P connection with ${otherUser?.name} established.`, 'success');
                    break;
                case 'disconnected':
                case 'closed':
                    cleanup();
                    addNotification(`P2P connection with ${otherUser?.name} closed.`, 'info');
                    break;
                case 'failed':
                    cleanup();
                    setP2pStatus('failed');
                    addNotification(`P2P connection with ${otherUser?.name} failed.`, 'error');
                    break;
            }
        };

        return pc;
    }, [socket, otherUser, addNotification, cleanup]);

    const setupDataChannel = useCallback((pc: RTCPeerConnection, isInitiator: boolean) => {
        const setup = (dc: RTCDataChannel) => {
            dc.onopen = () => setP2pStatus('connected');
            dc.onclose = () => cleanup();
            dc.onmessage = (event) => {
                const data = JSON.parse(event.data);
                onMessageReceivedRef.current(data);
            };
            dataChannelRef.current = dc;
        };
        
        if (isInitiator) {
            const dc = pc.createDataChannel('chat');
            setup(dc);
        } else {
            pc.ondatachannel = (event) => {
                setup(event.channel);
            };
        }
    }, [cleanup]);

    const initiateP2P = useCallback(async () => {
        if (!socket || !otherUser || p2pStatus !== 'disconnected') return;
        
        setP2pStatus('connecting');
        const pc = createPeerConnection();
        peerConnectionRef.current = pc;
        setupDataChannel(pc, true);
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('p2p-offer', { to: otherUser.id, offer });

    }, [socket, otherUser, p2pStatus, createPeerConnection, setupDataChannel]);

    useEffect(() => {
        if (!socket) return;
        
        const handleOffer = async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
             if (from !== otherUser?.id) return;
             setP2pStatus('connecting');
             const pc = createPeerConnection();
             peerConnectionRef.current = pc;
             setupDataChannel(pc, false);
             await pc.setRemoteDescription(new RTCSessionDescription(offer));
             const answer = await pc.createAnswer();
             await pc.setLocalDescription(answer);
             socket.emit('p2p-answer', { to: from, answer });
        };
        
        const handleAnswer = ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        };
        
        const handleCandidate = ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        };

        (socket as any).on('p2p-offer', handleOffer);
        (socket as any).on('p2p-answer', handleAnswer);
        (socket as any).on('p2p-candidate', handleCandidate);

        return () => {
            (socket as any).off('p2p-offer', handleOffer);
            (socket as any).off('p2p-answer', handleAnswer);
            (socket as any).off('p2p-candidate', handleCandidate);
            cleanup();
        };
    }, [socket, otherUser, cleanup, createPeerConnection, setupDataChannel]);

    const sendP2PMessage = (text: string) => {
        if (dataChannelRef.current?.readyState === 'open' && currentUser) {
            const message = { senderId: currentUser.id, text };
            dataChannelRef.current.send(JSON.stringify(message));
            return true;
        }
        return false;
    };

    return { p2pStatus, initiateP2P, sendP2PMessage, closeP2P: cleanup };
};