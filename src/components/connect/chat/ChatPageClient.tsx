"use client"; // Now this file can use hooks

import React from "react";
import ChatContainer from "@/components/connect/chat/ChatContainer";
import ChatHeader from "@/components/connect/chat/ChatHeader";

interface ChatClientProps {
  userId: string;
}

const ChatClient: React.FC<ChatClientProps> = ({ userId }) => {
  if (!userId) return null;

  return (
    <div className="h-screen relative w-full">
      <ChatHeader userId={userId} />
      <ChatContainer userId={userId} />
    </div>
  );
};

export default ChatClient;
