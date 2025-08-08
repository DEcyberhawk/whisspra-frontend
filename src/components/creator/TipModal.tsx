
import React, { useState } from 'react';
import { User } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../payments/CheckoutForm';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51BTUDGJAJfZb9HEBwDgAbpr3Yc32e92y5mG1jmwjiy2g6NCdjDGVAlvVwLplOFDFGg3D5Yf2bANR8v8E82hA3A800sC9k28d1';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface TipModalProps {
    user: User;
    onClose: () => void;
}

const TipModal: React.FC<TipModalProps> = ({ user, onClose }) => {
    const [step, setStep] = useState<'select' | 'pay'>('select');
    const [selectedAmount, setSelectedAmount] = useState<number>(5);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const tipAmounts = [1, 5, 10, 20];

    const handleProceedToPayment = async () => {
        setLoading(true);
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ amount: selectedAmount, creatorId: user.id }) // Pass creatorId
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to initialize payment.');
            setClientSecret(data.clientSecret);
            setStep('pay');
        } catch (error) {
            const msg = error instanceof Error ? error.message : "An unknown error occurred.";
            addNotification(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessfulPayment = async (paymentIntentId: string) => {
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/creators/tip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ creatorId: user.id, amount: selectedAmount, paymentIntentId })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Tip transaction failed.');
            
            addNotification(`You successfully sent a $${selectedAmount} tip to ${user.name}!`, 'success');
            onClose();
        } catch (error) {
            const msg = error instanceof Error ? error.message : "An unknown error occurred.";
            addNotification(msg, 'error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-slate-700 relative text-center"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mt-4">Send a Tip to {user.name}</h2>

                {step === 'select' && (
                    <>
                        <p className="text-slate-400 mt-2">Support their work with a one-time tip.</p>
                        <div className="mt-6 grid grid-cols-4 gap-3">
                            {tipAmounts.map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedAmount(amount)}
                                    className={`p-3 rounded-lg font-bold transition-colors ${selectedAmount === amount ? 'bg-indigo-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                                    disabled={loading}
                                >
                                    ${amount}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8">
                             <button
                                onClick={handleProceedToPayment}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 disabled:bg-green-500/50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Initializing...' : `Proceed to pay $${selectedAmount}`}
                            </button>
                        </div>
                    </>
                )}

                {step === 'pay' && clientSecret && (
                    <div className="mt-6 text-left">
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm
                                onSuccessfulPayment={handleSuccessfulPayment}
                                onPaymentError={(msg) => addNotification(msg, 'error')}
                            />
                        </Elements>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TipModal;
