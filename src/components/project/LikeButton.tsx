"use client";
import React, {useEffect, useState, memo} from "react";
import {Heart} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useUser} from "@/contexts/UserContext";
import {useLikeOperations} from "@/features/like/useLIkeOperations";

interface LikeButtonProps {
    className?: string;
    projectId: string;
    size?: "small" | "large";
    initialLikes: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
                                                   size = "small",
                                                   projectId,
                                                   className,
                                                   initialLikes,
                                               }) => {
    const {user, isLoading} = useUser();
    const {checkLikeStatus, toggleLikeProject} = useLikeOperations();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(initialLikes);
    const [updating, setUpdating] = useState<boolean>(false);
    const [hasCheckedInitialStatus, setHasCheckedInitialStatus] = useState<boolean>(false);

    // Separate effect for initial like status check that only runs once
    useEffect(() => {
        let isMounted = true;

        if (!user || hasCheckedInitialStatus) return;

        const checkLikeStatusEffect = async () => {
            console.log('check like status')
            try {
                const response = await checkLikeStatus(projectId);
                if (isMounted) {
                    setIsLiked(response);
                    setHasCheckedInitialStatus(true);
                }
            } catch (error) {
                console.error("Error checking like status:", error);
            }
        };

        checkLikeStatusEffect();

        return () => {
            isMounted = false;
        };
    }, [user, projectId]);

    const onClickHandler = async () => {
        if (updating || !user) return;
        const initialIsLiked = isLiked;
        const initialLikes = likes;
        setUpdating(true);
        // Optimistic update
        setIsLiked(prevIsLiked => !prevIsLiked);
        setLikes(prevLikes => isLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1);

        try {
            // Get the actual server state after toggle
            await toggleLikeProject(projectId);
            // Update to correct server value if different from our optimistic update
        } catch (err) {
            // On error, revert our optimistic update by checking the server state
            setIsLiked(initialIsLiked);
            setLikes(initialLikes);

        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <Button
                onClick={onClickHandler}
                disabled={updating || isLoading || !user}
                variant="outline"
                className={cn(
                    "hover:bg-secondary rounded-full bg-secondary",
                    size === "small" ? "w-10 h-10" : "w-20 h-20",
                    className
                )}
            >
                <Heart
                    className={cn(
                        size === "small" ? "!w-5 !h-5" : "!w-10 !h-10",
                        isLiked
                            ? "fill-primary-foreground text-primary-foreground"
                            : "text-primary-foreground"
                    )}
                />
            </Button>

            <span className="text-muted-foreground">{likes}</span>
        </div>
    );
};

export default memo(LikeButton, (prevProps, nextProps) => {
    // Custom comparison for memo to prevent unnecessary re-renders
    return (
        prevProps.projectId === nextProps.projectId &&
        prevProps.initialLikes === nextProps.initialLikes &&
        prevProps.size === nextProps.size
    );
});