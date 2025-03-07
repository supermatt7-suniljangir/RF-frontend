"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import MiniUserInfo from "@/components/common/MiniUserInfo";
import { formatDate } from "@/lib/formateDate";
import { Conversation } from "@/types/others";
import { useRouter } from "next/navigation";

interface Props {
  conversation: Conversation;
}

const ConversationItem: React.FC<Props> = ({ conversation }) => {
  const router = useRouter();
  const { user, lastMessageAt } = conversation;
  if (!user) return null;
  const handleChatClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `chatUser-${user._id}`,
        JSON.stringify({
          fullName: user.fullName,
          avatar: user.profile?.avatar || "",
        }),
      );
    }
    router.push(`/connect/${user._id}`);
  };

  return (
    <div
      key={user._id}
      onClick={handleChatClick}
      className="cursor-pointer p-2"
    >
      <Card className="p-3 rounded-none w-full flex items-center gap-3">
        <MiniUserInfo
          id={user._id}
          avatar={user?.profile?.avatar}
          fullName={user.fullName}
          styles="pointer-events-none scale-110"
        />
        <p className="text-xs text-muted-foreground">
          {formatDate(lastMessageAt)}
        </p>
      </Card>
    </div>
  );
};

export default ConversationItem;
