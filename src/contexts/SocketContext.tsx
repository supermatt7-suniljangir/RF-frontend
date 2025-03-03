"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext";
import { Config } from "@/config/config";

/**
 * The WebSocket server URL.
 * This should be set in the environment file (.env) as NEXT_PUBLIC_SOCKET_URL.
 * If not provided, it defaults to "http://localhost:3000".
 */

/**
 * WebSocket Context
 *
 * This context provides a WebSocket connection to the application.
 * It initializes the socket only when the user is available and emits the `register` event.
 */
const SocketContext = createContext<Socket | null>(null);

/**
 * SocketProvider Component
 *
 * This component initializes the WebSocket connection and provides it to the application.
 * It depends on the `user` from `UserContext` to emit the `register` event.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 */
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUser(); // Get the user from UserContext

  useEffect(() => {
    if (user) {
      // Initialize the WebSocket connection
      const newSocket = io(Config.URLS.SOCKET_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      // Manually connect to the WebSocket server
      newSocket.connect();

      // Emit the "register" event with the user ID
      newSocket.emit("register", user._id);

      // Set the socket in state
      setSocket(newSocket);

      // Cleanup on unmount or when the user changes
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]); // Re-run this effect only when the user changes

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

/**
 * useSocket Hook
 *
 * A custom hook to access the WebSocket connection from any component.
 */
export const useSocket = () => {
  return useContext(SocketContext);
};
