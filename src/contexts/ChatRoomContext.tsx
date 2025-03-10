"use client";
import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import {useSocket} from "./SocketContext"; // Global socket context
import {Message} from "@/types/others";
import {useUser} from "@/contexts/UserContext";
import {toast} from "@/hooks/use-toast";

interface ChatRoomContextType {
    currentConversationId: string | null;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    joinRoom: (recipientId: string) => void;
    sendMessage: (recipientId: string, text: string) => void;
    leaveRoom: (recipientId: string) => void;
    // Exposed method to update messagesMap directly
    replaceAllMessages: (newMessages: Message[]) => void;
}

const ChatRoomContext = createContext<ChatRoomContextType | undefined>(
    undefined
);

interface ChatRoomProviderProps {
    children: ReactNode;
}

export const ChatRoomProvider = ({children}: ChatRoomProviderProps) => {
    const {socket} = useSocket();
    const {user} = useUser();
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    // Use a ref to store messages in a Map for fast O(1) lookups by message ID
    const messagesMapRef = useRef<Map<string, Message>>(new Map());

    /**
     * joinRoom: Called when the user selects a chat.
     * Emits a "joinConversation" event to the server with the recipient ID.
     */
    const joinRoom = useCallback(
        (recipientId: string) => {
            try {
                if (!socket || !user?._id || !recipientId) {
                    throw new Error("Socket not connected or missing user or recipient ID");
                }
                socket.emit("joinConversation", recipientId);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error joining conversation",
                    description: `Failed to join conversation: ${error.message}`,
                })
            }

        },
        [socket, user]
    );

    // Listen for the "joinedConversation" event from the server.
    // This event should include the computed conversationId.
    useEffect(() => {
        if (!socket) return;
        const handleJoinedConversation = (data: { conversationId: string }) => {
            setCurrentConversationId(data.conversationId);
        };
        socket.on("joinedConversation", handleJoinedConversation);
        return () => {
            socket.off("joinedConversation", handleJoinedConversation);
        };
    }, [socket, user]);

    // Helper method to rebuild messages array from Map
    // const rebuildMessagesFromMap = useCallback(() => {
    //     const messagesArray = Array.from(messagesMapRef.current.values());
    //     // You could sort by timestamp here if needed
    //     // messagesArray.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    //     setMessages(messagesArray);
    // }, []);

    // Method to replace all messages and reset the Map
    const replaceAllMessages = useCallback((newMessages: Message[]) => {
        // Clear the Map
        messagesMapRef.current.clear();

        // Add all new messages to the Map
        newMessages.forEach(msg => {
            messagesMapRef.current.set(msg._id, msg);
        });

        // Update the state
        setMessages(newMessages);
    }, []);

    // Listen for messages, and update state only if the message belongs to the current room.
    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (data: Message) => {
            console.log('message was received');
            if (data.conversationId === currentConversationId) {
                console.log("Received message:", data);

                // Check if message already exists in our Map
                if (!messagesMapRef.current.has(data._id)) {
                    // Add new message to Map
                    messagesMapRef.current.set(data._id, data);
                    // Update state with the new message (no loops/some() here)
                    setMessages(prev => [...prev, data]);
                }
            }
        };
        socket.on("receiveMessage", handleReceiveMessage);
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket, currentConversationId]);

    /**
     * sendMessage: Sends a message to the recipient.
     * Note: The server will compute the conversationId and handle emitting to the room.
     */
    const sendMessage = useCallback(
        (recipientId: string, text: string) => {
            console.log('conversation id', currentConversationId);
            if (!socket || !user?._id) return;
            socket.emit("sendMessage", {to: recipientId, text});
            console.log('message was sent');
        },
        [socket, user?._id, currentConversationId]
    );

    const leaveRoom = useCallback(
        (recipientId: string) => {
            socket.emit("leaveConversation", recipientId);
            console.log('conversation was left');
        },
        [socket]
    );

    return (
        <ChatRoomContext.Provider
            value={{
                currentConversationId,
                messages,
                joinRoom,
                leaveRoom,
                sendMessage,
                setMessages,
                replaceAllMessages
            }}
        >
            {children}
        </ChatRoomContext.Provider>
    );
};

export const useChatRoom = () => {
    const context = useContext(ChatRoomContext);
    if (!context) {
        throw new Error("useChatRoom must be used within a ChatRoomProvider");
    }
    return context;
};