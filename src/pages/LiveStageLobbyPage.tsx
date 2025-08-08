import React from 'react';

const LiveStageLobbyPage: React.FC = () => {
    return (
        <div className="p-6 h-full overflow-y-auto text-white bg-slate-900">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Live Stage</h1>
                    <p className="text-slate-400">Join live events, interact with creators, and experience exclusive content drops.</p>
                </div>
                <button className="bg-indigo-500 hover:bg-indigo-600 font-semibold py-2 px-4 rounded-lg">
                    Go Live
                </button>
            </div>

            <div className="flex items-center justify-center h-96 bg-slate-800/50 border border-dashed border-slate-700 rounded-lg">
                <p className="text-slate-500">No live events are happening right now. Stay tuned!</p>
            </div>
        </div>
    );
};

export default LiveStageLobbyPage;
