"use client";

import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Conversation } from "@/types/others";

import ConversationItem from "@/components/connect/conversations/ConversationItem";

interface ChatListProps {
  chats: Conversation[];
}

const ConversationsList: React.FC<ChatListProps> = ({ chats }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Hide for small screens on `/connect/[userId]`
  if (
    !isDesktop &&
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/connect/")
  ) {
    return null;
  }

  return (
    <div className="p-4 space-y-2 w-full">
      {chats.length > 0 ? (
        chats.map((conv: Conversation) => (
          <ConversationItem key={conv?.user?._id} conversation={conv} />
        ))
      ) : (
        <p className="text-muted-foreground text-center">
          No conversations yet.
        </p>
      )}
    </div>
  );
};

export default ConversationsList;
