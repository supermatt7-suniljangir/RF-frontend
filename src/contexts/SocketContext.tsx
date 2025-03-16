"use client";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {io, Socket} from "socket.io-client";
import {useUser} from "./UserContext";
import {Config} from "@/config/config";
import {revalidateTags} from "@/lib/revalidateTags";
import {toast} from "@/hooks/use-toast";

// Define the context value shape
interface SocketContextValue {
    socket: Socket | null;
    ready: boolean;
    status: "connecting" | "connected" | "disconnected" | "reconnecting";
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({children}: SocketProviderProps) => {
    // Socket and connection state
    const [socket, setSocket] = useState<Socket | null>(null);
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState<
        "connecting" | "connected" | "disconnected" | "reconnecting"
    >("disconnected");

    // User context
    const {user} = useUser();

    // Reference values to manage connection
    const socketRef = useRef<Socket | null>(null);
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptRef = useRef(0);
    const lastPingRef = useRef<number>(Date.now());
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const connectionEstablishedRef = useRef(false);

    // Create a new socket connection
    const createSocket = () => {
        if (!user?._id) return null;

        // Clean up any existing connection
        if (socketRef.current) {
            socketRef.current.off();
            socketRef.current.disconnect();
        }

        setStatus("connecting");

        // Create socket instance
        const socket = io(Config.URLS.SOCKET_URL, {
            withCredentials: true,
            reconnection: false, // Disable auto-reconnect, we'll handle it ourselves
            timeout: 15000,
            forceNew: true,
        });

        socketRef.current = socket;
        setSocket(socket);

        // Setup event handlers
        setupSocketEvents(socket);

        return socket;
    };

    // Setup socket event handlers
    const setupSocketEvents = (socket: Socket) => {
        socket.on("connect", () => {
            reconnectAttemptRef.current = 0;
            lastPingRef.current = Date.now();
            setStatus("connected");

            // Register with the server
            if (user?._id) {
                socket.emit("register", user._id);
            }
        });

        socket.on("ready", () => {
            setReady(true);
            connectionEstablishedRef.current = true;

            // Show connection restored toast if this was a reconnection
            if (reconnectAttemptRef.current > 0) {
                toast({
                    title: "Connection Restored",
                    description: "You're back online.",
                    duration: 3000,
                });
            }
        });

        socket.on("disconnect", () => {
            setReady(false);
            setStatus("disconnected");

            // Only show disconnect toast if we had previously established a connection
            if (connectionEstablishedRef.current) {
                toast({
                    variant: "destructive",
                    title: "Connection Lost",
                    description: "Attempting to reconnect...",
                    duration: 5000,
                });
            }

            // Start reconnection process
            scheduleReconnect();
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connect error:", error);
            setStatus("disconnected");

            // Start reconnection process
            scheduleReconnect();
        });

        socket.on("error", (error: { message: string; code?: string }) => {
            console.error("Socket error:", error);

            // Only show error toast for non-connection errors
            if (error.code !== "connect_error" && error.code !== "reconnect_error") {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message || "An unknown error occurred.",
                    duration: 5000,
                });
            }
        });

        socket.on("ping", () => {
            lastPingRef.current = Date.now();
        });

        socket.on("revalidateConversations", () => {
            console.log('revalidating');
            revalidateTags(["conversations"]);
        });
    };

    // Schedule a reconnection attempt with exponential backoff
    const scheduleReconnect = () => {
        // Clear any existing reconnection timer
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        // Calculate backoff delay (cap at 30 seconds)
        reconnectAttemptRef.current += 1;
        const delay = Math.min(
            1000 * Math.pow(1.5, Math.min(reconnectAttemptRef.current, 10)),
            30000,
        );

        setStatus("reconnecting");

        // Schedule reconnection
        reconnectTimerRef.current = setTimeout(() => {
            createSocket();
        }, delay);
    };

    // Initialize socket connection when component mounts or user changes
    useEffect(() => {
        if (!user?._id) return;

        createSocket();

        // Set up connection heartbeat monitoring
        heartbeatIntervalRef.current = setInterval(() => {
            const now = Date.now();
            const timeSinceLastPing = now - lastPingRef.current;

            // If we haven't received a ping in 45 seconds but we think we're connected
            if (timeSinceLastPing > 45000 && status === "connected" && ready) {
                // Force disconnect and reconnect
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    // The disconnect event will trigger reconnection
                }
            }
        }, 10000);

        // Cleanup function
        return () => {
            // Clear intervals and timers
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }

            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }

            // Disconnect socket
            if (socketRef.current) {
                socketRef.current.off();
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            // Reset state
            setSocket(null);
            setReady(false);
            setStatus("disconnected");
        };
    }, [user?._id]);

    // Handle online/offline events
    useEffect(() => {
        const handleOnline = () => {
            console.log("Browser reports online");

            // If we were already connected once and are now offline, reconnect
            if (connectionEstablishedRef.current && status !== "connected") {
                toast({
                    title: "Network Connected",
                    description: "Reconnecting...",
                    duration: 5000,
                });

                // Force a reconnection
                createSocket();
            }
        };

        const handleOffline = () => {
            console.log("Browser reports offline");

            // Only show offline toast if we had previously established a connection
            if (connectionEstablishedRef.current) {
                toast({
                    variant: "destructive",
                    title: "You're Offline",
                    description: "Waiting for network connection...",
                    duration: 5000,
                });
            }
        };

        // Listen for visibility changes (for detecting sleep/wake)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                const now = Date.now();
                const timeSinceLastPing = now - lastPingRef.current;

                // If page was hidden for more than 30 seconds, check connection
                if (timeSinceLastPing > 30000) {
                    // Test connection with a ping
                    if (socketRef.current?.connected) {
                        // Send a ping to see if we're still connected
                        socketRef.current.emit("ping");

                        // Give the server a moment to respond
                        setTimeout(() => {
                            const refreshedTimeSinceLastPing =
                                Date.now() - lastPingRef.current;

                            // If we still haven't received a ping, reconnect
                            if (refreshedTimeSinceLastPing > 30000) {
                                createSocket();
                            }
                        }, 2000);
                    } else if (status !== "connecting" && status !== "reconnecting") {
                        // If we're not connected and not already trying to connect, reconnect
                        createSocket();
                    }
                }
            }
        };

        // Add event listeners
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Cleanup
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [status]);

    return (
        <SocketContext.Provider value={{socket, ready, status}}>
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
