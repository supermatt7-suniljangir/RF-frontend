"use client";
import React, { memo } from "react";
import ChatDisplay from "./ChatDisplay";
import ChatInput from "./ChatInput";
import { useUser } from "@/contexts/UserContext";
import { useChat } from "@/services/clientServices/connect/useChat";

type ChatContainerProps = {
  userId: string;
};

const ChatContainer: React.FC<ChatContainerProps> = ({ userId }) => {
  const { messages, sendMessage } = useChat(userId);
  const { user: authUser } = useUser();

  if (!authUser) return null;

  return (
    <div className="chat-container">
      <ChatDisplay messages={messages} />
      <ChatInput sendMessage={(text: string): void => sendMessage(text)} />
    </div>
  );
};

export default memo(ChatContainer);
