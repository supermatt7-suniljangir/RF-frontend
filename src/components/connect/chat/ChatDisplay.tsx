"use client";
import React, { useEffect, useRef } from "react";
import { Message } from "@/types/others";
import { useUser } from "@/contexts/UserContext";
import clsx from "clsx";

type ChatDisplayProps = {
  messages: Message[];
};

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container space-y-2 pt-24 p-8 overflow-y-auto flex flex-col h-[calc(75vh - 16rem)]">
      {messages.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No messages yet. Start the conversation!
        </p>
      ) : (
        messages.map((msg) => {
          const isSentByUser = user?._id === msg.sender;
          return (
            <div
              key={msg._id || Math.random()}
              className={clsx(
                "px-4 rounded-sm py-2 max-w-xs ", // Common styles
                isSentByUser
                  ? "bg-primary text-primary-foreground self-end"
                  : "bg-muted text-muted-foreground self-start",
              )}
            >
              {msg.text}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatDisplay;
