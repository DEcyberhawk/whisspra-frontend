import React from 'react';
import { useOffline } from '../context/OfflineContext';

const OfflineBanner: React.FC = () => {
    const { isOffline } = useOffline();

    if (!isOffline) {
        return null;
    }

    return (
        <div className="bg-yellow-500 text-center text-sm text-yellow-900 p-2 font-semibold">
            You are currently offline. Messages will be sent when you reconnect.
        </div>
    );
};

export default OfflineBanner;
