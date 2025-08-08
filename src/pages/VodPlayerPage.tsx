import React from 'react';
import { useParams, Link } from 'react-router-dom';

const VodPlayerPage: React.FC = () => {
    const { streamId } = useParams();

    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col">
             <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <div>
                    <h1 className="text-2xl font-bold">VOD Playback</h1>
                    <p className="text-slate-300">Stream ID: {streamId}</p>
                </div>
                <Link to="/echoes" className="bg-slate-800/50 hover:bg-slate-700/50 font-semibold py-2 px-4 rounded-lg backdrop-blur-sm">
                    &larr; Back to Echoes
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center">
                 <p className="text-2xl text-slate-400">[ Video Player Placeholder ]</p>
            </div>
        </div>
    );
};

export default VodPlayerPage;
