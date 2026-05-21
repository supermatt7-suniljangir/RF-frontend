"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext";
import { Config } from "@/config/config";
import { revalidateTags } from "@/lib/revalidateTags";
import { toast } from "@/hooks/use-toast";

interface SocketContextValue {
  socket: Socket | null;
  ready: boolean;
  status: "connecting" | "connected" | "disconnected" | "reconnecting";
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected" | "reconnecting"
  >("disconnected");

  const { user } = useUser();

  // Store socket instance without causing re-renders
  const socketRef = useRef<Socket | null>(null);

  // Active reconnect timeout
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Number of reconnect attempts made
  const reconnectAttemptRef = useRef(0);

  // Last time the server responded to a ping
  const lastPingRef = useRef<number>(Date.now());

  // Interval used for heartbeat checks
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Prevents offline/disconnect toasts on first load
  const connectionEstablishedRef = useRef(false);

  /** createSocket function:
   * Creates and initializes a brand new socket connection.
   *
   * This function is responsible for:
   * - Preventing duplicate socket connections
   * - Cleaning up old socket instances before reconnecting
   * - Creating a fresh socket.io client
   * - Disabling socket.io's built-in reconnect system
   * - Registering all socket event listeners
   * - Storing the active socket reference
   *
   * A new socket is usually created:
   * - On initial app load
   * - After reconnect attempts
   * - After network recovery
   * - When the authenticated user changes
   */
  const createSocket = () => {
    if (!user?._id) return null;

    // Clean up previous socket before creating a new one
    if (socketRef.current) {
      socketRef.current.off();
      socketRef.current.disconnect();
    }

    setStatus("connecting");

    // Disable built-in reconnection so we control retries manually
    const socket = io(Config.URLS.SOCKET_URL, {
      withCredentials: true,
      reconnection: false,
      timeout: 15000,
      forceNew: true,
    });

    socketRef.current = socket;
    setSocket(socket);

    setupSocketEvents(socket);

    return socket;
  };
  /**
   * Registers all socket event listeners and connection handlers.
   *
   * This is where the app reacts to socket lifecycle events like:
   * - Successful connections
   * - Disconnects
   * - Connection failures
   * - Heartbeat pings
   * - Server-side cache invalidation events
   *
   * It also handles:
   * - Updating connection state
   * - Triggering reconnect logic
   * - Showing connection toasts
   * - Registering the authenticated user with the server
   */
  const setupSocketEvents = (socket: Socket) => {
    socket.on("connect", () => {
      // Reset reconnect attempts after successful connection
      reconnectAttemptRef.current = 0;

      lastPingRef.current = Date.now();
      setStatus("connected");

      if (user?._id) {
        socket.emit("register", user._id);
      }
    });

    // Server confirms user registration is complete
    socket.on("ready", () => {
      setReady(true);

      connectionEstablishedRef.current = true;

      if (reconnectAttemptRef.current > 0) {
        toast({
          title: "Connection Restored",
          description: "You're back online.",
          duration: 3000,
        });
      }
    });

    // Reconnect after unexpected disconnect
    socket.on("disconnect", () => {
      setReady(false);
      setStatus("disconnected");

      if (connectionEstablishedRef.current) {
        toast({
          variant: "destructive",
          title: "Connection Lost",
          description: "Attempting to reconnect...",
          duration: 5000,
        });
      }

      scheduleReconnect();
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connect error:", error);

      setStatus("disconnected");

      scheduleReconnect();
    });

    socket.on("error", (error: { message: string; code?: string }) => {
      console.error("Socket error:", error);

      if (error.code !== "connect_error" && error.code !== "reconnect_error") {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An unknown error occurred.",
          duration: 5000,
        });
      }
    });

    // Update heartbeat timestamp when server pings us
    socket.on("ping", () => {
      lastPingRef.current = Date.now();
    });

    // Refresh conversation cache when server data changes
    socket.on("revalidateConversations", () => {
      revalidateTags(["conversations"]);
    });
  };

  const scheduleReconnect = () => {
    // Prevent multiple reconnect timers from stacking
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    reconnectAttemptRef.current += 1;

    // Exponential backoff capped at 30 seconds
    const delay = Math.min(
      1000 * Math.pow(1.5, Math.min(reconnectAttemptRef.current, 10)),
      30000,
    );

    setStatus("reconnecting");

    reconnectTimerRef.current = setTimeout(() => {
      createSocket();
    }, delay);
  };

  // Start socket connection when user becomes available
  useEffect(() => {
    if (!user?._id) return;

    createSocket();

    // Detect dead connections if heartbeat stops
    heartbeatIntervalRef.current = setInterval(() => {
      const now = Date.now();

      const timeSinceLastPing = now - lastPingRef.current;

      // Force reconnect if server stops responding
      if (timeSinceLastPing > 45000 && status === "connected" && ready) {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      }
    }, 10000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setSocket(null);
      setReady(false);
      setStatus("disconnected");
    };
  }, [user?._id]);

  // Listen for browser network and tab visibility changes
  useEffect(() => {
    // Reconnect when browser comes back online
    const handleOnline = () => {
      if (connectionEstablishedRef.current && status !== "connected") {
        toast({
          title: "Network Connected",
          description: "Reconnecting...",
          duration: 5000,
        });

        createSocket();
      }
    };

    // Show offline state when browser loses connection
    const handleOffline = () => {
      if (connectionEstablishedRef.current) {
        toast({
          variant: "destructive",
          title: "You're Offline",
          description: "Waiting for network connection...",
          duration: 5000,
        });
      }
    };

    // Recheck socket health when tab becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();

        const timeSinceLastPing = now - lastPingRef.current;

        if (timeSinceLastPing > 30000) {
          if (socketRef.current?.connected) {
            // Ask server for a quick heartbeat response
            socketRef.current.emit("ping");

            setTimeout(() => {
              const refreshedTimeSinceLastPing =
                Date.now() - lastPingRef.current;

              // Reconnect if server still doesn't respond
              if (refreshedTimeSinceLastPing > 30000) {
                createSocket();
              }
            }, 2000);
          } else if (status !== "connecting" && status !== "reconnecting") {
            createSocket();
          }
        }
      }
    };

    window.addEventListener("online", handleOnline);

    window.addEventListener("offline", handleOffline);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnline);

      window.removeEventListener("offline", handleOffline);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status]);

  return (
    <SocketContext.Provider value={{ socket, ready, status }}>
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
