"use client";
import {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useUser} from "./UserContext";
import {Config} from "@/config/config";
import {revalidateTags} from "@/lib/revalidateTags";
import {toast} from "@/hooks/use-toast";

// Create context
const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({children}: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const {user} = useUser();
    const userIdRef = useRef<string | null>(null);

    // Use a ref to track last ping time
    const lastPingTimeRef = useRef<number | null>(null);
    const initialConnectionMadeRef = useRef(false);


    useEffect(() => {

        // Create socket instance
        const socket = io(Config.URLS.SOCKET_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            timeout: 20000,
            // Force a new connection on page refresh
            forceNew: true
        });

        setSocket(socket);
        // Clean up on unmount
        return () => {
            console.log('Socket provider cleaning up');
            socket.disconnect();
            setSocket(null);
        };
    }, []); // Don't depend on user here


    // registration
    // Handle user registration separately after socket is connected
    useEffect(() => {
        if (!socket || !user) return;

        // Only register if user ID has changed
        if (userIdRef.current !== user._id) {
            userIdRef.current = user._id;

            const registerUser = () => {
                if (socket.connected) {
                    socket.emit("register", user._id);
                } else {
                    console.log('Socket not connected, waiting...');
                }
            };

            // Register if already connected
            registerUser();

            // Also listen for connect event
            const handleConnect = () => {
                console.log('Socket connected event fired');
                registerUser();
            };

            socket.on('connect', handleConnect);

            return () => {
                socket.off('connect', handleConnect);
            };
        }
    }, [socket, user]);



    useEffect(() => {
        if (!user || !socket) return;
        // Set up ping monitoring
        socket.on("ping", () => {
            console.log('ping called');
            lastPingTimeRef.current = Date.now();
        });

        // Basic connection handlers
        socket.on("connect", () => {
            // Register user with socket
            if (user?._id) {
                socket.emit("register", user._id);
            }

            // Only show toast for reconnections, not initial connection
            if (initialConnectionMadeRef.current) {
                toast({
                    title: "Connection Restored",
                    description: "Successfully reconnected to messaging server.",
                    duration: 3000,
                });
            } else {
                initialConnectionMadeRef.current = true;
            }
        });


        socket.on("reconnect", () => {
            if (user?._id) {
                socket.emit("register", user._id);
            }
        });

        // Error handling
        socket.on("connect_error", () => {
            if (initialConnectionMadeRef.current) {
                toast({
                    variant: "destructive",
                    title: "Connection Error",
                    duration: 3000,
                    description: "Unable to connect to messaging server. Refreshing page...",
                });

                // Give time for toast to show then refresh
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        });

        setSocket(socket);

        // Cleanup on unmount
        return () => {
            socket.disconnect();
            setSocket(null);
        };
    }, [user, socket]);

    // Handle data revalidation
    useEffect(() => {
        if (!socket || !user) return;

        const handleRevalidation = () => {
            void revalidateTags(["conversations"]);
        };

        socket.on("revalidateConversations", handleRevalidation);

        return () => {
            socket.off("revalidateConversations", handleRevalidation);
        };
    }, [socket, user]);

    // Ping monitoring - refresh page if no ping received for 30 seconds
    useEffect(() => {
        if (!socket) return;

        const intervalId = setInterval(() => {
            const now = Date.now();
            const lastPing = lastPingTimeRef.current;

            // If we haven't received a ping in 35 seconds and we're supposedly connected
            if (lastPing && now - lastPing > 35000 && socket.connected && initialConnectionMadeRef.current) {
                toast({
                    variant: "destructive",
                    title: "Connection Lost",
                    duration: 3000,
                    description: "Connection Timed out. Refreshing page...",
                });

                // Give time for toast to show then refresh
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }, 10000); // Check every 15 seconds

        return () => clearInterval(intervalId);
    }, [socket]);

    // Handle online/offline status
    useEffect(() => {
        if (!socket) return;

        const handleOnline = () => {
            // If we come back online, refresh the page
            if (initialConnectionMadeRef.current) {
                toast({
                    title: "Network Connection Restored",
                    duration: 3000,
                    description: "Reconnecting to server...",
                });

                // Give time for toast to show then refresh
                setTimeout(() => {
                    window.location.reload();
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

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};