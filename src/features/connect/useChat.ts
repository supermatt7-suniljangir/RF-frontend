import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import ChatService from "@/services/clientServices/connect/ChatService";
import { Message } from "@/types/others";
import { useUser } from "@/contexts/UserContext";
import { useChatRoom } from "@/contexts/ChatRoomContext";
import { useSocket } from "@/contexts/SocketContext";

export const useChat = (userId: string) => {
  const { user: authUser } = useUser();
  const { socket, ready } = useSocket(); // Destructure the ready flag here
  const { messages, replaceAllMessages, sendMessage, joinRoom } = useChatRoom();

  useEffect(() => {
    if (!authUser || !userId || !socket || !ready) return;

    let joined = false;
    let retryCount = 0;
    const maxRetries = 5;
    let retryTimeout: NodeJS.Timeout;

    const joinConversation = () => {
      // Now use the ready flag provided by socket context.
      if (ready && !joined) {
        joinRoom(userId);
        joined = true;
        retryCount = 0; // Reset retry count on success
      } else if (!joined) {
        // Exponential backoff if not ready
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * Math.pow(1.5, retryCount), 5000);
          retryCount++;
          retryTimeout = setTimeout(joinConversation, delay);
        } else {
          console.error("Failed to join room after maximum retries");
          toast({
            variant: "destructive",
            title: "Connection Error",
            description:
              "Failed to join the chat room after multiple attempts. Please try again later.",
          });
        }
      }
    };

    // Initial attempt to join
    joinConversation();

    // Fetch chat history (unchanged)
    const fetchChatHistory = async () => {
      try {
        const response: ApiResponse = await ChatService.getChatHistory({
          userId,
        });
        if (!(response.success && response.data)) {
          throw new Error(`Failed to fetch chat history: ${response.message}`);
        }
        const newMessages: Message[] = response.data.data;
        replaceAllMessages(newMessages);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to fetch chat history",
          description: error.message,
        });
      }
    };

    fetchChatHistory();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      socket.emit("leaveConversation");
      joined = false;
    };
  }, [authUser, userId, replaceAllMessages, joinRoom, socket, ready]);

  return {
    messages,
    sendMessage: (recipientId = userId, text: string) =>
      sendMessage(recipientId, text),
  };
};
