"use client";

import {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useUser} from "./UserContext";
import {Config} from "@/config/config";
import {revalidateTags} from "@/lib/revalidateTags";
import {toast} from "@/hooks/use-toast";
import {Message} from "@/types/others";

/**
 * WebSocket Context
 *
 * This context provides a robust WebSocket connection with automatic reconnection handling,
 * network status detection, and lifecycle management. It manages the entire connection
 * lifecycle including edge cases like sleep mode, network changes, and server disconnects.
 */
const SocketContext = createContext<{
    socket: Socket | null;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
} | undefined>(undefined);


/**
 * SocketProvider Component Props
 */
interface SocketProviderProps {
    children: ReactNode;
}

/**
 * SocketProvider Component
 *
 * Manages the Socket.io connection lifecycle and provides the socket instance to
 * the application through context. Features include:
 * - Automatic connection when the user is authenticated
 * - Comprehensive event handling for all connection states
 * - Network status detection and recovery
 * - Stale connection monitoring using heartbeat detection
 * - Clean reconnection with server registration
 */
export const SocketProvider = ({children}: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const {user} = useUser();

    // this should not be here but this is a quick fix.
    const [messages, setMessages] = useState<Message[]>([]);

    // Internal state tracking for connection management
    const connectionStatusRef = useRef<{
        isConnected: boolean;
        lastPingTime: number | null;
        initialConnectionEstablished: boolean;
        isReconnecting: boolean;
        serverIntentionallyDown: boolean;
        reconnectionAttempts: number;
    }>({
        isConnected: false,
        lastPingTime: null,
        initialConnectionEstablished: false,
        isReconnecting: false,
        serverIntentionallyDown: false,
        reconnectionAttempts: 0
    });

    /**
     * Establishes a WebSocket connection with comprehensive event handling
     *
     * This function creates a new Socket.io connection and configures all the necessary
     * event listeners for proper connection management. It returns the socket instance for
     * cleanup purposes.
     */
    const connectSocket = () => {
        const newSocket = io(Config.URLS.SOCKET_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
        });

        // === CONNECTION EVENTS ===

        // Initial connection success handler
        newSocket.on("connect", () => {
            connectionStatusRef.current.isConnected = true;
            connectionStatusRef.current.isReconnecting = false;
            connectionStatusRef.current.serverIntentionallyDown = false;
            connectionStatusRef.current.reconnectionAttempts = 0;

            // Only show reconnection toast if we had established a connection before
            if (connectionStatusRef.current.initialConnectionEstablished) {
                toast({
                    title: "Connection Restored",
                    description: "Successfully reconnected to messaging server.",
                    duration: 3000,
                });
            } else {
                connectionStatusRef.current.initialConnectionEstablished = true;
            }

            // Register user with the socket server
            if (user?._id) {
                newSocket.emit("register", user._id);
            }
        });

        // Connection error handler
        newSocket.on("connect_error", () => {
            connectionStatusRef.current.isConnected = false;
            connectionStatusRef.current.reconnectionAttempts += 1;

            // Only show toast for first few connection errors to reduce spam
            if (connectionStatusRef.current.reconnectionAttempts <= 2 && !connectionStatusRef.current.serverIntentionallyDown) {
                connectionStatusRef.current.serverIntentionallyDown = true;

                toast({
                    variant: "destructive",
                    title: "Connection Error",
                    duration: 3000,
                    description: "Unable to connect to messaging server. Will retry automatically.",
                });
            }
        });

        // === RECONNECTION EVENTS ===

        // Successful reconnection handler
        newSocket.on("reconnect", () => {
            connectionStatusRef.current.isConnected = true;
            connectionStatusRef.current.isReconnecting = false;
            connectionStatusRef.current.serverIntentionallyDown = false;
            connectionStatusRef.current.reconnectionAttempts = 0;

            // Re-register user after reconnection
            if (user?._id) {
                newSocket.emit("register", user._id);
            }
        });

        // Reconnect attempt handler - check if server might be back online
        newSocket.on("reconnect_attempt", () => {
            if (!connectionStatusRef.current.isReconnecting) {
                connectionStatusRef.current.isReconnecting = true;
            }
        });

        // Maximum reconnection attempts reached handler
        newSocket.on("reconnect_failed", () => {
            connectionStatusRef.current.isReconnecting = false;

            // Reset socket to allow manual reconnection later
            setTimeout(() => {
                if (newSocket) {
                    newSocket.connect();
                }
            }, 10000); // Wait 10 seconds before trying again

            toast({
                variant: "destructive",
                title: "Connection Failed",
                duration: 3000,
                description: "Could not reconnect to server. Will retry automatically.",
            });
        });

        // === DISCONNECTION EVENTS ===

        // Connection lost handler
        newSocket.on("disconnect", (reason) => {
            connectionStatusRef.current.isConnected = false;
            connectionStatusRef.current.lastPingTime = Date.now();

            // Only show the toast for certain disconnect reasons
            if (reason === "io server disconnect") {
                // Server forced disconnect - try to reconnect manually
                connectionStatusRef.current.serverIntentionallyDown = true;
                newSocket.connect();
            } else if ((reason === "transport close" || reason === "ping timeout")
              && !connectionStatusRef.current.serverIntentionallyDown) {
                toast({
                    variant: "destructive",
                    title: "Connection Lost",
                    duration: 3000,
                    description: "Connection to server lost. Reconnecting...",
                });
            }
        });

        // === HEARTBEAT MONITORING ===

        // Track pings for connection health monitoring
        newSocket.on("ping", () => {
            connectionStatusRef.current.lastPingTime = Date.now();
        });

        // === APPLICATION-LEVEL EVENTS ===

        // Application error handler (server-sent errors)
        newSocket.on("error", (error) => {
            toast({
                variant: "destructive",
                title: `Messaging Error code: ${error?.code || "unknown"}`,
                description: error?.message ? error.message : "An error occurred with the messaging service.",
            });
        });

        // Transport-level errors (often catches network issues)
        newSocket.io.on("error", () => {
            console.log('a network error occurred')
            if (connectionStatusRef.current.isConnected) {
                connectionStatusRef.current.isConnected = false;
                toast({
                    variant: "destructive",
                    duration: 3000,
                    title: "Network Error",
                    description: "Connection to server lost. Waiting for network...",
                });
            }
        });

        setSocket(newSocket);
        return newSocket;
    };

    /**
     * Socket Initialization Effect
     *
     * Creates and manages the Socket.io connection when a user is available.
     * Handles cleanup on unmount or when the user changes.
     */
    useEffect(() => {
        if (user) {
            const newSocket = connectSocket();

            // Cleanup function to disconnect socket when component unmounts
            return () => {
                newSocket.disconnect();
            };
        }
    }, [user, connectSocket]);

    /**
     * Application Event Handler Effect
     *
     * Sets up listeners for application-specific events.
     * Currently, handles conversation revalidation triggered by the server.
     */
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

    /**
     * Live Message Handler Effect
     *
     * Listens for new messages from the server and updates the message
     * state accordingly. Prevents duplicate messages from being added.
     */
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: Message) => {
            setMessages((prev) => {
                if (!prev.some((msg) => msg._id === data._id)) {
                    return [...prev, data];
                }
                return prev;
            });
        };

        socket.on("receiveMessage", handleNewMessage);

        return () => {
            socket.off("receiveMessage", handleNewMessage);
        };
    }, [socket, user]);

    /**
     * Connection Health Monitoring Effect
     *
     * Periodically checks for stale connections that might not trigger disconnect events.
     * This catches edge cases like sleep mode where the socket thinks it's connected
     * but the connection is actually stale.
     */
    useEffect(() => {
        if (!socket) return;

        const intervalId = setInterval(() => {
            const now = Date.now();
            const lastPing = connectionStatusRef.current.lastPingTime;

            // If no ping for over 45 seconds (30s is typical ping interval)
            if (lastPing && now - lastPing > 45000 && connectionStatusRef.current.isConnected) {
                // Socket thinks it's connected, but we haven't seen activity
                if (socket.connected) {
                    // Force a disconnect/reconnect cycle
                    socket.disconnect();

                    // Small delay before reconnecting
                    setTimeout(() => {
                        if (socket) {
                            socket.connect();
                        }
                    }, 1000);
                }
            }

            // If server was down, but we haven't tried reconnecting in a while, try again
            if (connectionStatusRef.current.serverIntentionallyDown && !connectionStatusRef.current.isReconnecting) {
                socket.connect();
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(intervalId);
    }, [socket]);

    /**
     * Network Status Monitoring Effect
     *
     * Uses the browser's native online/offline events to detect network changes.
     * Automatically attempts to reconnect when the network becomes available.
     */
    useEffect(() => {
        if (!socket) return;

        const handleOnline = () => {
            if (!connectionStatusRef.current.isConnected && socket) {
                socket.connect();
                connectionStatusRef.current.serverIntentionallyDown = false;

                toast({
                    title: "Network Connection Restored",
                    variant: "default",
                    duration: 3000,
                    description: "Reconnecting to server...",
                });
            }
        };

        const handleOffline = () => {
            connectionStatusRef.current.isConnected = false;

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

    return <SocketContext.Provider value={{socket, messages, setMessages}}>
        {children}
    </SocketContext.Provider>
};

/**
 * useSocket Hook
 *
 * A custom hook to access the WebSocket connection from any component.
 * Returns the current Socket.io instance or null if not connected.
 *
 * @example
 * const socket = useSocket();
 *
 * useEffect(() => {
 *   if (!socket) return;
 *
 *   socket.on("myEvent", handleEvent);
 *   return () => socket.off("myEvent", handleEvent);
 * }, [socket]);
 *
 * @returns The Socket.io socket instance or null
 */
export const useSocket = () => {
    return useContext(SocketContext);
};
