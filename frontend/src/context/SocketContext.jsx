// src/SocketContext.js
import React, { createContext, useEffect, useState } from "react";
import socketService from "../socketService";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socketService.connect();

        const handleConnect = () => {
            setIsConnected(true);
        };

        socketService.socket?.on("connect", handleConnect);

        return () => {
            socketService.socket?.off("connect", handleConnect);
            socketService.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socketService}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
