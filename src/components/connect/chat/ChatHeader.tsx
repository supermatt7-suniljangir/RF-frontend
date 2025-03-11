"use client";

import React from "react";
import MiniUserInfo from "@/components/common/MiniUserInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  userId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userId }) => {
  // Directly access localStorage
  let fullName = "Unknown User";
  let avatar = "";
  const router = useRouter();

  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem(`chatUser-${userId}`);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      fullName = userData?.fullName || fullName;
      avatar = userData?.avatar || avatar;
    }
  }

  return (
    <div className="px-8 py-4 bg-secondary text-secondary-foreground my-4 flex items-center justify-between border-b sticky top-0 z-10">
      <Button
        onClick={() => router.back()}
        className="p-4 flex h-12 w-12 rounded-full items-center lg:hidden"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      {/*/!* User Avatar *!/*/}
      {/*{avatar && (*/}
      {/*  <div className="relative w-12 h-12 rounded-full overflow-hidden">*/}
      {/*    <Image src={avatar} alt={fullName} fill className="object-cover" />*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*/!* User Name *!/*/}
      {/*<span className="font-medium text-2xl">{fullName}</span>*/}
      <MiniUserInfo
        id={userId}
        avatar={avatar}
        fullName={fullName}
        styles={`scale-125`}
      />
    </div>
  );
};

export default ChatHeader;
