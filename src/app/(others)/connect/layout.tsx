"use server";
import {Suspense} from "react";
import ConversationListWrapper from "@/components/connect/conversations/ConversationListWrapper";
import {getRecentConversations} from "@/services/serverServices/connect/getRecentConversations";
import {ChatRoomProvider} from "@/contexts/ChatRoomContext";
import Spinner from "@/app/loading"; // Import the context

export default async function ConnectLayout({
                                                children,
                                            }: {
    children: React.ReactNode;
}) {
    const chatResponse = await getRecentConversations();
    if (!chatResponse.success || !chatResponse.data) {
        return (
            <div className="p-24 text-2xl text-red-500 text-center">
                <p>Error Fetching Conversations, {chatResponse.message}</p>
            </div>
        );
    }

    return (
        <ChatRoomProvider>
            <div className="flex h-screen">
                {/* Chat List Sidebar (25% on desktop, full width on mobile) */}
                <Suspense
                    fallback={
                        <Spinner/>
                    }
                >
                    <ConversationListWrapper chats={chatResponse.data}/>
                </Suspense>

                {/* Main Content Area (Takes remaining width) */}
                <div className="flex-1 h-screen overflow-hidden">{children}</div>
            </div>
        </ChatRoomProvider>
    );
}
