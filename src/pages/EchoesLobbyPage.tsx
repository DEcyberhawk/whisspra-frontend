import React from 'react';

const EchoesLobbyPage: React.FC = () => {
    return (
        <div className="p-6 h-full overflow-y-auto text-white bg-slate-900">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Echoes</h1>
                    <p className="text-slate-400">Explore interactive, branching video experiences from your favorite creators.</p>
                </div>
                 <button className="bg-indigo-500 hover:bg-indigo-600 font-semibold py-2 px-4 rounded-lg">
                    + Create Echo
                </button>
            </div>

            <div className="flex items-center justify-center h-96 bg-slate-800/50 border border-dashed border-slate-700 rounded-lg">
                <p className="text-slate-500">Explore Echoes from creators here.</p>
            </div>
        </div>
    );
};

export default EchoesLobbyPage;
