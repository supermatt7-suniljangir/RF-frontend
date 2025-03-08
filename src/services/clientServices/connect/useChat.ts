import {useCallback, useEffect} from "react";
import {useSocket} from "@/contexts/SocketContext";
import {toast} from "@/hooks/use-toast";
import {ApiResponse} from "@/lib/ApiResponse";
import ChatService from "@/services/clientServices/connect/ChatService";
import {Message} from "@/types/others";
import {useUser} from "@/contexts/UserContext";

export const useChat = (userId: string) => {
    const {socket, messages, setMessages} = useSocket();
    const {user: authUser} = useUser();

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


    // Function to send messages (memoized)
    const sendMessage = useCallback(
      (text: string) => {
          if (socket && text.trim()) {
              socket.emit("sendMessage", {text, to: userId});
          }
      },
      [socket, userId],
    );

    return {messages, sendMessage};
};
