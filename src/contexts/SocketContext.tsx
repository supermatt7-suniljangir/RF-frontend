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

    // Use a ref to track last ping time
    const lastPingTimeRef = useRef<number | null>(null);
    const initialConnectionMadeRef = useRef(false);

    useEffect(() => {
        // Create socket instance
        const socketInstance = io(Config.URLS.SOCKET_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            timeout: 20000,
            // Force a new connection on page refresh
            forceNew: true,
        });

        setSocket(socketInstance);

        // Listen for the "ready" event from the server
        socketInstance.on("ready", () => {
            console.log("Socket ready received");
            setSocketReady(true);
        });

        // Optionally, clear ready flag on disconnect
        socketInstance.on("disconnect", () => {
            console.log("Socket disconnected");
            setSocketReady(false);
        });

        // Clean up on unmount
        return () => {
            console.log("Socket provider cleaning up");
            socketInstance.disconnect();
            setSocket(null);
            setSocketReady(false);
        };
    }, []);

    // Registration effect
    useEffect(() => {
        if (!socket || !user) return;

        if (userIdRef.current !== user._id) {
            userIdRef.current = user._id;

            const registerUser = () => {
                if (socket.connected) {
                    socket.emit("register", user._id);
                } else {
                    console.log("Socket not connected, waiting...");
                }
            };

            // Register if already connected
            registerUser();

            // Listen for connect event
            const handleConnect = () => {
                console.log("Socket connected event fired");
                registerUser();
            };

            socket.on("connect", handleConnect);

            return () => {
                socket.off("connect", handleConnect);
            };
        }
    }, [socket, user]);

    // (Remaining effects unchanged)
    useEffect(() => {
        if (!user || !socket) return;
        // Ping monitoring
        socket.on("ping", () => {
            console.log("ping called");
            lastPingTimeRef.current = Date.now();
        });

        socket.on("connect", () => {
            if (user?._id) {
                socket.emit("register", user._id);
            }
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

        socket.on("connect_error", () => {
            if (initialConnectionMadeRef.current) {
                toast({
                    variant: "destructive",
                    title: "Connection Error",
                    duration: 3000,
                    description: "Unable to connect to messaging server. Refreshing page...",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
            setSocket(null);
        };
    }, [user, socket]);

    // Data revalidation effect
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

    // Ping monitoring effect (refresh page if no ping received for 35 seconds)
    useEffect(() => {
        if (!socket) return;
        const intervalId = setInterval(() => {
            const now = Date.now();
            const lastPing = lastPingTimeRef.current;
            if (lastPing && now - lastPing > 35000 && socket.connected && initialConnectionMadeRef.current) {
                toast({
                    variant: "destructive",
                    title: "Connection Lost",
                    duration: 3000,
                    description: "Connection Timed out. Refreshing page...",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }, 10000);
        return () => clearInterval(intervalId);
    }, [socket]);

    // Online/offline status effect
    useEffect(() => {
        if (!socket) return;
        const handleOnline = () => {
            if (initialConnectionMadeRef.current) {
                toast({
                    title: "Network Connection Restored",
                    duration: 3000,
                    description: "Reconnecting to server...",
                });
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

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
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
