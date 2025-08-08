
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DreamscapeLobbyPage: React.FC = () => {
    // Placeholder data
    const mockDreamscapes = [
        { id: '1', title: 'Cyberpunk Library', creator: 'Alex', thumbnail: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2670&auto=format&fit=crop' },
        { id: '2', title: 'Floating Islands', creator: 'Emily', thumbnail: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?q=80&w=2574&auto=format&fit=crop' },
    ];

    return (
        <div className="p-6 h-full overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Dreamscapes</h1>
                    <p className="text-slate-400">Explore AI-generated worlds and memories.</p>
                </div>
                <button className="bg-indigo-500 hover:bg-indigo-600 font-semibold py-2 px-4 rounded-lg">
                    + Create New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDreamscapes.map(ds => (
                    <Link to={`/dreamscape/${ds.id}`} key={ds.id} className="group aspect-video bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700 hover:border-indigo-500 transition-all">
                        <img src={ds.thumbnail} alt={ds.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="font-bold text-lg">{ds.title}</h3>
                            <p className="text-sm text-slate-300">by {ds.creator}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DreamscapeLobbyPage;