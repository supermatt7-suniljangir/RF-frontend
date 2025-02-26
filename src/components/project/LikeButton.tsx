"use client";
import React, { useEffect, useState, useCallback, memo } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { useLikeOperations } from "@/features/like/useLIkeOperations";

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
    const { user, isLoading } = useUser();
    const { checkLikeStatus, toggleLikeProject } = useLikeOperations();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(initialLikes);
    const [updating, setUpdating] = useState<boolean>(false);

    // Separate effect for initial like status check
    useEffect(() => {
        let isMounted = true; // Flag to track component mount status
        if (!user) return;

        const checkLikeStatusEffect = async () => {
            const response = await checkLikeStatus(projectId);
            if (isMounted) {
                setIsLiked(response);
            }
        };

        checkLikeStatusEffect();

        return () => {
            isMounted = false; // Cleanup when the component unmounts
        };
    }, [user, projectId]);


    const onClickHandler = async () => {
        if (updating || !user) return;

        setUpdating(true);
        const previousLiked = isLiked;
        const previousLikes = likes;

        // Optimistic update
        setIsLiked(!previousLiked);

        try {
            const liked = await toggleLikeProject(projectId);
            setLikes((prevLikes) => (liked ? prevLikes + 1 : Math.max(0, prevLikes - 1)));
        } catch (err) {
            // Revert on error
            setIsLiked(previousLiked);
            setLikes(previousLikes);
        } finally {
            setUpdating(false);
        }
    }


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

export default memo(LikeButton);
