
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
    onSuccessfulPayment: (paymentIntentId: string) => void;
    onPaymentError: (errorMessage: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccessfulPayment, onPaymentError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/chat`,
            },
            redirect: 'if_required' // Prevents redirect
        });

        if (error) {
            onPaymentError(error.message || "An unexpected error occurred.");
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccessfulPayment(paymentIntent.id);
        } else {
            onPaymentError("Payment was not successful.");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                type="submit"
                disabled={isLoading || !stripe}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 disabled:bg-green-500/50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Processing...' : 'Pay'}
            </button>
        </form>
    );
};

export default CheckoutForm;
