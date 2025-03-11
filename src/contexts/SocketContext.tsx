"use client";
import {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useUser} from "./UserContext";
import {Config} from "@/config/config";
import {revalidateTags} from "@/lib/revalidateTags";
import {toast} from "@/hooks/use-toast";

interface SocketContextValue {
    socket: Socket | null;
    ready: boolean;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({children}: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [socketReady, setSocketReady] = useState(false);
    const {user} = useUser();
    const userIdRef = useRef<string | null>(null);
    const lastPingTimeRef = useRef<number | null>(null);
    const initialConnectionMadeRef = useRef(false);
    const reconnectingRef = useRef(false);

    // Helper to create a new socket connection
    const connectSocket = () => {
        if (reconnectingRef.current) return;

        reconnectingRef.current = true;
        const socketInstance = io(Config.URLS.SOCKET_URL, {
            withCredentials: true,
            reconnection: false, // Disable automatic reconnection, handle it manually
            timeout: 20000,
            forceNew: true,
        });

        setSocket(socketInstance);

        socketInstance.on("ready", () => {
            setSocketReady(true);
            reconnectingRef.current = false;
        });

        socketInstance.on("disconnect", () => {
            setSocketReady(false);
        });

        socketInstance.on("connect_error", () => {
            reconnectingRef.current = false;
        });

        return socketInstance;
    };

    // Effect 1: Initialize socket once
    useEffect(() => {
        const socketInstance = connectSocket();

        return () => {
            socketInstance?.disconnect();
            setSocket(null);
            setSocketReady(false);
        };
    }, []);

    // Effect 2: Main socket event handlers
    useEffect(() => {
        if (!socket || !user) return;

        const registerUser = () => {
            if (socket?.connected && user._id) {
                socket.emit("register", user._id);
                userIdRef.current = user._id;
            }
        };

        const handleConnect = () => {
            registerUser();

            if (initialConnectionMadeRef.current) {
                toast({
                    title: "Connection Restored",
                    description: "Successfully reconnected to messaging server.",
                    duration: 3000,
                });
            } else {
                initialConnectionMadeRef.current = true;
            }
        };

        const handleReconnect = () => {
            registerUser();
        };

        const handleConnectError = () => {
            if (initialConnectionMadeRef.current) {
                toast({
                    variant: "destructive",
                    title: "Connection Error",
                    duration: 3000,
                    description: "Unable to connect to messaging server. Retrying...",
                });
                setTimeout(() => {
                    socket.connect(); // Attempt manual reconnection
                }, 3000);
            }
        };

        const handleRevalidation = () => {
            console.log('revalidated the conversations')
            revalidateTags(["conversations"]);
        };

        const handlePing = () => {
            lastPingTimeRef.current = Date.now();
        };

        // Register user immediately if possible
        registerUser();

        // Set up listeners
        socket.on("connect", handleConnect);
        socket.on("reconnect", handleReconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("revalidateConversations", handleRevalidation);
        socket.on("ping", handlePing);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("reconnect", handleReconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("revalidateConversations", handleRevalidation);
            socket.off("ping", handlePing);
        };
    }, [socket, user]);

    // Effect 3: Health monitoring + offline handling
    useEffect(() => {
        if (!socket) return;

        const pingMonitoringInterval = setInterval(() => {
            const now = Date.now();
            const lastPing = lastPingTimeRef.current;
            if (
                lastPing &&
                now - lastPing > 45000 &&
                socket.connected &&
                initialConnectionMadeRef.current
            ) {
                toast({
                    variant: "destructive",
                    title: "Connection Lost",
                    duration: 3000,
                    description: "Connection timed out. Retrying...",
                });

                socket.disconnect();
                setTimeout(() => {
                    socket.connect(); // Attempt manual reconnection
                }, 3000);
            }
        }, 10000);

        const handleOnline = () => {
            if (initialConnectionMadeRef.current) {
                toast({
                    title: "Network Connection Restored",
                    duration: 3000,
                    description: "Reconnecting to server...",
                });
                setTimeout(() => {
                    if (!socket.connected) socket.connect();
                }, 3000);
            }
        };

        const handleOffline = () => {
            toast({
                variant: "destructive",
                title: "Network Disconnected",
                duration: 3000,
                description: "Your device is offline. Waiting for connection...",
            });
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            clearInterval(pingMonitoringInterval);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{socket, ready: socketReady}}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
