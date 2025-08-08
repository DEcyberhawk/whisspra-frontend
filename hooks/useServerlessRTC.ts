import { useState, useRef, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { User, LocalP2PStatus } from '../types';

type MessageCallback = (data: { senderId: string, text: string }) => void;

const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export const useServerlessRTC = (currentUser: User | null, onMessage: MessageCallback) => {
    const [status, setStatus] = useState<LocalP2PStatus>('inactive');
    const [offer, setOffer] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);
    const dc = useRef<RTCDataChannel | null>(null);
    const { addNotification } = useNotification();
    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;

    const cleanup = useCallback(() => {
        dc.current?.close();
        pc.current?.close();
        dc.current = null;
        pc.current = null;
        setOffer(null);
        setAnswer(null);
        setStatus('inactive');
    }, []);

    const setupDataChannel = useCallback((peerConnection: RTCPeerConnection) => {
        peerConnection.ondatachannel = (event) => {
            const dataChannel = event.channel;
            dataChannel.onopen = () => {
                setStatus('connected');
                addNotification('Local P2P connection established!', 'success');
            };
            dataChannel.onmessage = (e) => {
                onMessageRef.current(JSON.parse(e.data));
            };
            dataChannel.onclose = () => {
                cleanup();
                addNotification('Local P2P connection closed.', 'info');
            };
            dc.current = dataChannel;
        };
    }, [cleanup, addNotification]);

    const createOffer = useCallback(async () => {
        setStatus('generating');
        const peerConnection = new RTCPeerConnection(ICE_SERVERS);
        pc.current = peerConnection;

        const dataChannel = peerConnection.createDataChannel('chat');
        dc.current = dataChannel;
        dataChannel.onopen = () => {
            setStatus('connected');
            addNotification('Local P2P connection established!', 'success');
        };
        dataChannel.onmessage = (e) => {
            onMessageRef.current(JSON.parse(e.data));
        };
        dataChannel.onclose = cleanup;

        const offerDesc = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offerDesc);

        peerConnection.onicegatheringstatechange = () => {
            if (peerConnection.iceGatheringState === 'complete') {
                setOffer(JSON.stringify(peerConnection.localDescription));
            }
        };
    }, [cleanup, addNotification]);

    const handleOffer = useCallback(async (scannedOffer: string) => {
        setStatus('generating');
        const peerConnection = new RTCPeerConnection(ICE_SERVERS);
        pc.current = peerConnection;
        setupDataChannel(peerConnection);

        await peerConnection.setRemoteDescription(JSON.parse(scannedOffer));
        const answerDesc = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerDesc);

        peerConnection.onicegatheringstatechange = () => {
            if (peerConnection.iceGatheringState === 'complete') {
                setAnswer(JSON.stringify(peerConnection.localDescription));
            }
        };
    }, [setupDataChannel]);

    const handleAnswer = useCallback(async (scannedAnswer: string) => {
        if (pc.current) {
            await pc.current.setRemoteDescription(JSON.parse(scannedAnswer));
        }
    }, []);

    const sendMessage = (text: string) => {
        if (dc.current?.readyState === 'open' && currentUser) {
            const message = { senderId: currentUser.id, text };
            dc.current.send(JSON.stringify(message));
            return true;
        }
        return false;
    };

    return { status, offer, answer, createOffer, handleOffer, handleAnswer, sendMessage, cleanup };
};
