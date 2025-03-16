"use client";
import React, {useState} from "react";
import {Card} from "@/components/ui/card";
import {Trash} from "lucide-react";
import MiniUserInfo from "@/components/common/MiniUserInfo";
import {formatDate} from "@/lib/formateDate";
import {Conversation} from "@/types/others";
import {useRouter} from "next/navigation";
import ChatService from "@/services/clientServices/connect/ChatService";
import Modal from "@/components/common/Modal";
import {revalidateRoute} from "@/lib/revalidatePath";

interface Props {
    conversation: Conversation;
}

const ConversationItem: React.FC<Props> = ({conversation}) => {
    const router = useRouter();
    const {user, lastMessageAt} = conversation;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!user) return null;

    const handleChatClick = () => {
        if (typeof window !== "undefined") {
            localStorage.setItem(
                `chatUser-${user._id}`,
                JSON.stringify({
                    fullName: user.fullName,
                    avatar: user.profile?.avatar || "",
                })
            );
        }
        router.push(`/connect/${user._id}`);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const res = await ChatService.deleteConversation({recipientId: user._id});
            if (res.success) {
                localStorage.removeItem(`chatUser-${conversation.user._id}`);
                setIsOpen(false);
                revalidateRoute(`/connect`)
                // Optionally trigger refresh or remove from UI state
            }
        } catch (error) {
            console.error("Failed to delete conversation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-3 rounded-none w-full flex items-center justify-between gap-3">
            {/* Attach handleChatClick here */}
            <div
                onClick={handleChatClick}
                className="flex items-center gap-3 w-full cursor-pointer"
            >
                <MiniUserInfo
                    id={user._id}
                    avatar={user?.profile?.avatar}
                    fullName={user.fullName}
                    styles="pointer-events-none scale-110"
                />
                <p className="text-xs text-muted-foreground">
                    {formatDate(lastMessageAt)}
                </p>
            </div>

            {/* Stop propagation here */}
            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isLoading={isLoading}
                handler={handleDelete}
                title="Delete Conversation"
                triggerIcon={
                    <Trash
                        className="w-4 h-4 text-destructive"
                        onClick={(e) => {
                            e.stopPropagation(); // ✅ Stops click bubbling
                            setIsOpen(true);
                        }}
                    />
                }
                customTriggerStyles="hover:bg-destructive/10"
                customContainerStyles="w-[90%] max-w-md"
                customButtonStyles="w-24"
            >
                <p className="text-center">
                    Are you sure you want to delete this conversation? This action cannot be undone.
                </p>
            </Modal>
        </Card>
    );
};

export default ConversationItem;
