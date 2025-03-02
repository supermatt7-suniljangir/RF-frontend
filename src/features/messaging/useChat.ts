import socket, { connectSocket, disconnectSocket } from "@/config/socket";
import { useEffect, useState } from "react";

/**
 * Defines the structure of a chat message.
 * Each message has:
 * - `from`: The sender's user ID.
 * - `to`: The recipient's user ID.
 * - `text`: The actual message content.
 */
interface Message {
  from: string;
  to: string;
  text: string;
}

/**
 * A custom React hook that enables real-time chat functionality.
 * It handles:
 * - Connecting and disconnecting from the WebSocket server.
 * - Listening for incoming messages.
 * - Sending messages to other users.
 *
 * @param userId - The ID of the logged-in user.
 */
export const useChat = (userId: string) => {
  /**
   * Stores an array of messages in state.
   * Whenever a new message is received, this state updates, triggering a re-render.
   */
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userId) return; // If userId is not provided, do nothing.

    connectSocket(); // Establishes a WebSocket connection.

    /**
     * Informs the WebSocket server that this user has joined.
     * The server will use this information to correctly route messages.
     */
    socket.emit("register", userId);

    /**
     * Listens for the "receiveMessage" event from the server.
     * When a message arrives, it updates the `messages` state.
     */
    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]); // Appends the new message to the state.
    });

    /**
     * Cleanup function:
     * - Removes the event listener when the component unmounts.
     * - Disconnects from the WebSocket server to prevent memory leaks.
     */
    return () => {
      socket.off("receiveMessage"); // Stops listening for new messages.
      disconnectSocket(); // Disconnects from the WebSocket.
    };
  }, [userId]); // This effect runs whenever `userId` changes.

  /**
   * Sends a message to another user.
   *
   * @param to - The recipient's user ID.
   * @param text - The content of the message.
   */
  const sendMessage = (to: string, text: string) => {
    if (!to || !text.trim()) return; // Prevent sending empty messages.

    socket.emit("sendMessage", { from: userId, to, text }); // Sends the message via WebSocket.
  };

  // Return the chat state and functions.
  return { messages, sendMessage };
};
