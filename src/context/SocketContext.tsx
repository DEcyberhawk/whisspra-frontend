
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getStorageItem } from '../utils/storage';
import { SOCKET_URL } from '../config';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            const connectSocket = async () => {
                const token = await getStorageItem('whisspra_token');
                const socketOptions: any = {
                    auth: { token },
                    transports: ['websocket']
                };
                const newSocket = io(SOCKET_URL, socketOptions);
                setSocket(newSocket);
            };
            connectSocket();

            return () => {
                socket?.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
