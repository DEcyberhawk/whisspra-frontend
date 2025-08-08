import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import jsQR from 'jsqr';
import { LocalP2PStatus } from '../../types';

interface OfflineConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: LocalP2PStatus;
    offer: string | null;
    answer: string | null;
    createOffer: () => void;
    handleOffer: (offer: string) => void;
    handleAnswer: (answer: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);


const OfflineConnectModal: React.FC<OfflineConnectModalProps> = ({
    isOpen, onClose, status, offer, answer, createOffer, handleOffer, handleAnswer
}) => {
    const [step, setStep] = useState(0); // 0: choice, 1: show offer, 2: scan offer, 3: show answer, 4: scan answer
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startScan = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                requestAnimationFrame(tick);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            onClose();
        }
    };

    const stopScan = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const tick = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    if (step === 2) handleOffer(code.data);
                    if (step === 4) handleAnswer(code.data);
                    stopScan();
                }
            }
        }
        if (streamRef.current) { // Only continue scanning if stream is active
            requestAnimationFrame(tick);
        }
    };

    useEffect(() => {
        if (step === 2 || step === 4) {
            startScan();
        } else {
            stopScan();
        }
        return stopScan;
    }, [step]);
    
    useEffect(() => {
        if (status === 'connected') {
            onClose();
        }
    }, [status, onClose]);

    useEffect(() => {
        if (offer && step === 1) {
             // Offer is ready
        }
        if (answer && step === 2) {
            setStep(3); // Show answer QR
        }
    }, [offer, answer, step]);

    const renderStep = () => {
        switch(step) {
            case 1: // Show Offer QR
                return (
                    <div>
                        <h3 className="font-semibold text-white mb-2">Step 1: Other Person Scans This</h3>
                        <p className="text-sm text-slate-400 mb-4">Have the other person scan this QR code to generate a response.</p>
                        <div className="bg-white p-4 rounded-lg inline-block">
                            {offer ? <QRCodeCanvas value={offer} size={256} /> : <LoadingSpinner />}
                        </div>
                        <button onClick={() => setStep(4)} className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 font-semibold py-2 rounded-lg">Scan Response QR</button>
                    </div>
                );
            case 2: // Scan Offer QR
                return (
                     <div>
                        <h3 className="font-semibold text-white mb-2">Step 1: Scan Their QR Code</h3>
                        <p className="text-sm text-slate-400 mb-4">Point your camera at the QR code the other person is displaying.</p>
                        <div className="relative w-full aspect-square bg-slate-900 rounded-lg overflow-hidden">
                            <video ref={videoRef} className="w-full h-full object-cover" />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    </div>
                );
            case 3: // Show Answer QR
                return (
                    <div>
                        <h3 className="font-semibold text-white mb-2">Step 2: They Scan This Response</h3>
                        <p className="text-sm text-slate-400 mb-4">Have the original person scan this final code to connect.</p>
                        <div className="bg-white p-4 rounded-lg inline-block">
                            {answer ? <QRCodeCanvas value={answer} size={256} /> : <LoadingSpinner />}
                        </div>
                    </div>
                );
            case 4: // Scan Answer QR
                 return (
                     <div>
                        <h3 className="font-semibold text-white mb-2">Step 2: Scan Their Response</h3>
                        <p className="text-sm text-slate-400 mb-4">Point your camera at the final QR code they are showing.</p>
                         <div className="relative w-full aspect-square bg-slate-900 rounded-lg overflow-hidden">
                            <video ref={videoRef} className="w-full h-full object-cover" />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    </div>
                );
            default: // Initial Choice
                return (
                    <div className="space-y-4">
                        <button onClick={() => { createOffer(); setStep(1); }} className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left">
                            <h3 className="font-semibold text-white">Initiate Connection</h3>
                            <p className="text-sm text-slate-400">Generate a QR code for the other person to scan.</p>
                        </button>
                         <button onClick={() => setStep(2)} className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left">
                            <h3 className="font-semibold text-white">Scan to Connect</h3>
                            <p className="text-sm text-slate-400">Scan the QR code from the person who initiated.</p>
                        </button>
                    </div>
                );
        }
    };

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-slate-700 relative text-center" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-4">Local P2P Connection</h2>
                {renderStep()}
            </div>
        </div>
    );
};

export default OfflineConnectModal;