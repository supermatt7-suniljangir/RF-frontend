"use client";

import {usePathname} from "next/navigation";
import {useMediaQuery} from "@/hooks/use-media-query";
import ConversationsList from "./ConversationsList";

interface ChatListWrapperProps {
    chats: any[];
}

export default function ConversationListWrapper({
                                                    chats,
                                                }: ChatListWrapperProps) {
    const pathname = usePathname();
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const isUserChatPage =
        pathname.startsWith("/connect/") && pathname !== "/connect";

    // Hide chat list on mobile when inside a specific chat
    if (!isDesktop && isUserChatPage) {
        return null;
    }

    return (
        <div
            className={`border-r h-screen overflow-y-auto ${
                isDesktop ? "w-1/4" : "w-full"
            }`}
        >
            <ConversationsList chats={chats}/>
        </div>
    );
}
