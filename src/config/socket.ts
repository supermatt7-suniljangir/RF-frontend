import { io, Socket } from "socket.io-client";

/**
 * The WebSocket server URL.
 * This should be set in the environment file (.env) as NEXT_PUBLIC_SOCKET_URL.
 * If not provided, it defaults to "http://localhost:3000".
 */
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

/**
 * Creates a WebSocket client instance.
 * - `withCredentials: true` ensures that authentication cookies are sent.
 * - `autoConnect: false` prevents the socket from automatically connecting when imported.
 */
const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

/**
 * Manually connects to the WebSocket server.
 * This is necessary since we disabled automatic connection.
 */
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

/**
 * Manually disconnects from the WebSocket server.
 * This is useful to prevent multiple connections when the user navigates away.
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Exporting the socket instance so it can be used across the application.
export default socket;
