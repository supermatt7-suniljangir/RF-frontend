import ChatClient from "@/components/connect/chat/ChatPageClient";
import React from "react";

interface ChatPageProps {
  params: Promise<{ userId: string }>;
}

const ChatPage: React.FC<ChatPageProps> = async ({ params }) => {
  const { userId } = await params;
  if (!userId) {
    return <div>Invalid User ID</div>;
  }
  return <ChatClient userId={userId} />;
};
export default ChatPage;
