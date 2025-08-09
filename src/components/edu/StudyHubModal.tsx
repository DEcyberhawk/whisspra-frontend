


import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import PlannerTab from './planner/PlannerTab';
import FlashcardViewer from './flashcards/FlashcardViewer';
import CreateDeckModal from './flashcards/CreateDeckModal';
import { FlashcardDeck } from '../../types';
import ResourcesTab from './resources/ResourcesTab';

const API_URL = 'http://localhost:5000/api/edu';

interface StudyHubModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversationId: string;
    onUploadResource: () => void;
    onPlayVideo: (url: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-48">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const QuizView: React.FC<{ questions: any[], onFinish: () => void }> = ({ questions, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
        setIsCorrect(option === questions[currentQuestionIndex].answer);
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsCorrect(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            onFinish();
        }
    };

    const q = questions[currentQuestionIndex];
    return (
        <div className="space-y-4">
            <p className="font-semibold text-slate-300">{q.question}</p>
            <div className="space-y-2">
                {q.options.map((opt: string, i: number) => (
                    <button key={i} onClick={() => handleSelectOption(opt)} disabled={selectedOption !== null}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all
                            ${selectedOption === null ? 'border-slate-600 hover:bg-slate-700' : 
                            opt === q.answer ? 'bg-green-500/20 border-green-500' :
                            opt === selectedOption ? 'bg-red-500/20 border-red-500' : 'border-slate-600'
                        }`}
                    >{opt}</button>
                ))}
            </div>
            {selectedOption && (
                <div className="text-right">
                    <button onClick={handleNext} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg">
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                </div>
            )}
        </div>
    );
};

const StudyHubModal: React.FC<StudyHubModalProps> = ({ isOpen, onClose, conversationId, onUploadResource, onPlayVideo }) => {
    const [activeTab, setActiveTab] = useState<'tools' | 'flashcards' | 'planner' | 'resources'>('tools');
    const [activeTool, setActiveTool] = useState<'none' | 'quiz' | 'explain'>('none');
    const [isLoading, setIsLoading] = useState(false);
    const [toolResponse, setToolResponse] = useState<any>(null);
    const [concept, setConcept] = useState('');
    const { addNotification } = useNotification();
    const token = localStorage.getItem('whisspra_token');

    // Flashcard state
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
    const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);

    const fetchDecks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/flashcards/${conversationId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error("Failed to fetch decks.");
            setDecks(await res.json());
        } catch (err: any) { addNotification(err.message, 'error'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        if (isOpen && activeTab === 'flashcards' && !selectedDeck) {
            fetchDecks();
        }
    }, [isOpen, activeTab, selectedDeck]);

    const handleToolAction = async (tool: 'quiz' | 'explain') => {
        if (tool === 'explain' && !concept.trim()) {
            addNotification('Please enter a concept to explain.', 'info');
            return;
        }
        setIsLoading(true);
        setToolResponse(null);
        setActiveTool(tool);
        try {
            const response = await fetch(`${API_URL}/${tool}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ conversationId, concept }),
            });
            if (!response.ok) throw new Error(`Failed to get ${tool} data.`);
            const data = await response.json();
            setToolResponse(data);
        } catch (error: any) {
            addNotification(error.message, 'error');
            setActiveTool('none');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateDeck = async (name: string) => {
        try {
            const res = await fetch(`${API_URL}/flashcards/${conversationId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) throw new Error("Failed to create deck.");
            const newDeck = await res.json();
            setDecks(prev => [...prev, newDeck]);
            setIsCreateDeckModalOpen(false);
        } catch (err: any) {
            addNotification(err.message, 'error');
        }
    };

    const handleBack = () => {
        setActiveTool('none');
        setToolResponse(null);
        setConcept('');
    };

    if (!isOpen) return null;

    const renderToolsContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (toolResponse) {
            if (activeTool === 'quiz') return <QuizView questions={toolResponse} onFinish={handleBack} />;
            if (activeTool === 'explain') return (
                <div>
                    <p className="text-slate-300 whitespace-pre-wrap">{toolResponse.explanation}</p>
                    <button onClick={handleBack} className="mt-4 bg-slate-700 hover:bg-slate-600 py-2 px-4 rounded-lg">Back</button>
                </div>
            );
        }
        return (
            <div className="space-y-4">
                <button onClick={() => handleToolAction('quiz')} className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left">
                    <h3 className="font-semibold text-white">Generate Quiz</h3>
                    <p className="text-sm text-slate-400">Test your knowledge based on the recent chat history.</p>
                </button>
                <div className="space-y-2">
                    <input type="text" value={concept} onChange={e => setConcept(e.target.value)} placeholder="Enter a concept to explain..." className="w-full bg-slate-700 p-2 rounded-md" />
                    <button onClick={() => handleToolAction('explain')} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg">Explain Concept</button>
                </div>
            </div>
        );
    };
    
    const renderFlashcardsContent = () => {
        if (selectedDeck) return <FlashcardViewer deck={selectedDeck} onBack={() => setSelectedDeck(null)} conversationId={conversationId} />;
        if (isLoading) return <LoadingSpinner />;
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-white">Flashcard Decks</h3>
                    <button onClick={() => setIsCreateDeckModalOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3 text-sm rounded-lg">+ New Deck</button>
                </div>
                <div className="space-y-2">
                    {decks.map(deck => (
                        <div key={deck._id} onClick={() => setSelectedDeck(deck)} className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg cursor-pointer flex justify-between">
                            <span>{deck.name}</span>
                            <span className="text-slate-400">{deck.cards.length} cards</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {isCreateDeckModalOpen && <CreateDeckModal onClose={() => setIsCreateDeckModalOpen(false)} onCreate={handleCreateDeck} />}
            <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col border border-slate-700" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">Study Hub</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                        </div>
                        <div className="flex space-x-1 border border-slate-700 rounded-lg p-1 bg-slate-900/50">
                            {['tools', 'flashcards', 'planner', 'resources'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2 rounded-md text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'tools' && renderToolsContent()}
                        {activeTab === 'flashcards' && renderFlashcardsContent()}
                        {activeTab === 'planner' && <PlannerTab conversationId={conversationId} />}
                        {activeTab === 'resources' && <ResourcesTab conversationId={conversationId} onUpload={onUploadResource} onPlayVideo={onPlayVideo} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudyHubModal;