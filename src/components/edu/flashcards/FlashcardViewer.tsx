
import React, { useState } from 'react';
import { Flashcard, FlashcardDeck } from '../../../types';
import AddCardForm from './AddCardForm';
import { useNotification } from '../../../context/NotificationContext';
import { API_URL } from '../../../config';
import { getStorageItem } from '../../../utils/storage';

interface FlashcardViewerProps {
    deck: FlashcardDeck;
    onBack: () => void;
    conversationId: string;
}

const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ deck, onBack }) => {
    const [cards, setCards] = useState<Flashcard[]>(deck.cards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
    const { addNotification } = useNotification();

    const handleAddCard = async (front: string, back: string) => {
        const token = await getStorageItem('whisspra_token');
        try {
            const res = await fetch(`${API_URL}/edu/flashcards/deck/${deck._id}/card`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ front, back })
            });
            if (!res.ok) throw new Error('Failed to add card.');
            const newCard = await res.json();
            setCards(prev => [...prev, newCard]);
            addNotification('Card added!', 'success');
        } catch (err: any) { addNotification(err.message, 'error'); }
    };

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(prev => (prev + 1) % cards.length), 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length), 150);
    };
    
    const toggleQuizMode = () => {
        if (!isQuizMode) {
            const indices = Array.from(Array(cards.length).keys());
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            setShuffledIndices(indices);
            setCurrentIndex(0); // Start quiz from the first shuffled card
        }
        setIsQuizMode(!isQuizMode);
        setIsFlipped(false);
    };

    const cardIndex = isQuizMode ? shuffledIndices[currentIndex] : currentIndex;
    const currentCard = cards[cardIndex];

    if (!currentCard) {
        return (
            <div>
                 <button onClick={onBack} className="text-indigo-400 mb-4">&larr; Back to Decks</button>
                <h3 className="text-xl font-bold text-white mb-2">{deck.name}</h3>
                <p className="text-slate-400 mb-4">This deck is empty. Add the first card!</p>
                <AddCardForm onAddCard={handleAddCard} />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <button onClick={onBack} className="text-indigo-400">&larr; Back to Decks</button>
                <h3 className="text-xl font-bold text-white">{deck.name}</h3>
                <button onClick={toggleQuizMode} className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md">{isQuizMode ? 'End Quiz' : 'Quiz Me'}</button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div 
                    className={`w-full max-w-md h-64 rounded-xl flex items-center justify-center p-6 text-center cursor-pointer transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className="absolute w-full h-full bg-slate-700 rounded-xl flex items-center justify-center backface-hidden">
                        <p className="text-2xl text-white">{currentCard.front}</p>
                    </div>
                     <div className="absolute w-full h-full bg-indigo-700 rounded-xl flex items-center justify-center backface-hidden rotate-y-180">
                        <p className="text-2xl text-white">{currentCard.back}</p>
                    </div>
                </div>
                <p className="text-slate-400 mt-4">{currentIndex + 1} / {cards.length}</p>
                <div className="flex gap-4 mt-4">
                    <button onClick={handlePrev} className="bg-slate-700 hover:bg-slate-600 p-3 rounded-full">Prev</button>
                    <button onClick={handleNext} className="bg-slate-700 hover:bg-slate-600 p-3 rounded-full">Next</button>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-700">
                <AddCardForm onAddCard={handleAddCard} />
            </div>
        </div>
    );
};

// Add CSS for 3D flip effect
const styleId = 'flashcard-flipper-style';
if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    `;
    document.head.appendChild(style);
}

export default FlashcardViewer;
