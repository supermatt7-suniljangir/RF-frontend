import { useCallback, useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/lib/ApiResponse";
import ChatService from "@/services/clientServices/connect/ChatService";
import { Message } from "@/types/others";
import { useUser } from "@/contexts/UserContext";

export const useChat = (userId: string) => {
  const socket = useSocket();
  const { user: authUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch initial chat history
  useEffect(() => {
    if (!authUser) return;

    const fetchChatHistory = async () => {
      try {
        const response: ApiResponse = await ChatService.getChatHistory({
          userId,
        });

        if (!(response.success && response.data)) {
          throw new Error("Failed to fetch chat history");
        }

        const newMessages: Message[] = response.data.data;

        setMessages((prevMessages) => {
          const existingIds = new Set(prevMessages.map((msg) => msg._id));
          const uniqueMessages = newMessages.filter(
            (msg) => !existingIds.has(msg._id),
          );

          return [...prevMessages, ...uniqueMessages];
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to fetch chat history",
          description: error.message,
        });
      }
    };

    fetchChatHistory();
  }, [authUser, userId]);

  // Listen for live messages via sockets
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
  }, [socket, userId]);

  // Function to send messages (memoized)
  const sendMessage = useCallback(
    (text: string) => {
      if (socket && text.trim()) {
        try {
          socket.emit("sendMessage", { text, to: userId });
        } catch {
          toast({
            variant: "destructive",
            title: "Failed to send message",
          });
        }
      }
    },
    [socket, userId],
  );

  return { messages, sendMessage };
};
