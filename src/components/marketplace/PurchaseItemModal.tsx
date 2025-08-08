
import React, { useState } from 'react';
import { MarketplaceItem } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../payments/CheckoutForm';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51BTUDGJAJfZb9HEBwDgAbpr3Yc32e92y5mG1jmwjiy2g6NCdjDGVAlvVwLplOFDFGg3D5Yf2bANR8v8E82hA3A800sC9k28d1';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface PurchaseItemModalProps {
    item: MarketplaceItem;
    onClose: () => void;
    onPurchaseSuccess: () => void;
}

const PurchaseItemModal: React.FC<PurchaseItemModalProps> = ({ item, onClose, onPurchaseSuccess }) => {
    const [step, setStep] = useState<'details' | 'pay'>('details');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();
    const { user, fetchUser } = useAuth();

    const handleProceedToPayment = async () => {
        const token = await getStorageItem('whisspra_token');
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ amount: item.price, creatorId: item.creator.id })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to initialize payment.');
            setClientSecret(data.clientSecret);
            setStep('pay');
        } catch (error) {
            const msg = error instanceof Error ? error.message : "An unknown error occurred.";
            addNotification(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessfulPayment = async (paymentIntentId: string) => {
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/marketplace/${item._id}/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ paymentIntentId })
            });
            if (!response.ok) throw new Error('Purchase failed after payment confirmation.');
            addNotification('Purchase successful!', 'success');
            if (token) await fetchUser(token);
            onPurchaseSuccess();
            onClose();
        } catch (error) {
            const msg = error instanceof Error ? error.message : "An unknown error occurred.";
            addNotification(msg, 'error');
        }
    };
    
    const hasPurchased = user?.purchasedItems?.includes(item._id);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                <p className="text-sm text-slate-400 mb-4">by {item.creator.name}</p>
                <p className="text-slate-300 mb-6">{item.description}</p>
                
                {step === 'details' && (
                    <>
                        {hasPurchased ? (
                             <div className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg text-center">
                                You own this item!
                            </div>
                        ) : (
                            <button onClick={handleProceedToPayment} disabled={isLoading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
                                {isLoading ? 'Initializing...' : `Buy Now for $${item.price.toFixed(2)}`}
                            </button>
                        )}
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

export default PurchaseItemModal;
