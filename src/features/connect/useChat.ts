import {useEffect, useRef} from "react";
import {toast} from "@/hooks/use-toast";
import {ApiResponse} from "@/lib/ApiResponse";
import ChatService from "@/services/clientServices/connect/ChatService";
import {Message} from "@/types/others";
import {useUser} from "@/contexts/UserContext";
import {useChatRoom} from "@/contexts/ChatRoomContext";
import {useSocket} from "@/contexts/SocketContext";

export const useChat = (userId: string) => {
    const {user: authUser} = useUser();
    const socket = useSocket();
    const {messages, replaceAllMessages, sendMessage, joinRoom} = useChatRoom();

    useEffect(() => {
        if (!authUser || !userId || !socket) return;

        let joined = false;
        let retryCount = 0;
        const maxRetries = 5;
        let retryTimeout: NodeJS.Timeout;

        const joinIfNeeded = async () => {
            try {
                console.log("Checking room status...");

                const isReady = await Promise.race<boolean>([
                    new Promise<boolean>((resolve) => {
                        socket.emit("checkRoomStatus", userId, resolve);
                    }),
                    new Promise<boolean>((resolve) =>
                        socket.once("ready", () => resolve(true))
                    )
                ]);

                console.log("Room status:", isReady);

                if (isReady && !joined) {
                    console.log("Joining room...");
                    joinRoom(userId);
                    joined = true;
                    retryCount = 0; // Reset retry count on success
                } else if (!isReady && !joined) {
                    // Handle false status with exponential backoff
                    if (retryCount < maxRetries) {
// Shorter delays for a more responsive chat experience
                        const delay = Math.min(500 * Math.pow(1.5, retryCount), 3000); // Starts at 250ms, caps at 3s                        console.log(`Room not ready, retrying in ${delay}ms (retry ${retryCount + 1}/${maxRetries})`);

                        retryCount++;
                        retryTimeout = setTimeout(joinIfNeeded, delay);
                    } else {
                        console.error("Failed to join room after maximum retries");
                        toast({
                            variant: "destructive",
                            title: "Connection Error",
                            description: "Failed to join the chat room after multiple attempts. Please try again later."
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to check room status:", error);
                toast({
                    variant: "destructive",
                    title: "Connection Error",
                    description: error.message || "An unknown error occurred",
                });
            }
        };

        // Initial attempt to join
        joinIfNeeded();

        // Handle error events from socket
        const handleError = (error) => {
            console.error("Socket error:", error);
            toast({
                variant: "destructive",
                title: "Connection Error",
                description: error.message || "An unknown error occurred",
            });
        };

        socket.on("error", handleError);

        // Fetch chat history
        const fetchChatHistory = async () => {
            try {
                const response: ApiResponse = await ChatService.getChatHistory({userId});

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

        // Cleanup function
        return () => {
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
            socket.emit('leaveConversation');
            socket.off("error", handleError);
            joined = false;
        };
    }, [authUser, userId, replaceAllMessages, joinRoom, socket]);

    return {
        messages,
        sendMessage: (recipientId = userId, text: string) => sendMessage(recipientId, text)
    };
};