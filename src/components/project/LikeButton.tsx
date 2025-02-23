"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { toggleLikeProject } from "@/services/likes/toggleProjectLike";
import { hasUserLikedProject } from "@/services/likes/hasUserLikedTheProject";
import { useUser } from "@/contexts/UserContext";

interface LikeButtonProps {
    className?: string;
    projectId: string;
    size?: "small" | "large";
    initialLikes: number; // Initial likes from server
}

const LikeButton: React.FC<LikeButtonProps> = ({
    size = "small",
    projectId,
    className,
    initialLikes,
}) => {
    const { user, isLoading } = useUser();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(initialLikes);
    const [updating, setUpdating] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        const checkLikeStatus = async () => {
            if (!user) return;
            try {
                const response = await hasUserLikedProject(projectId);
                if (isMounted) {
                    setIsLiked(response);
                }
            } catch (err) {
                console.error("Failed to fetch like status", err);
            }
        };

        checkLikeStatus();

        return () => {
            isMounted = false;
        };
    }, [user, projectId, isLoading]);

    const onClickHandler = useCallback(async () => {
        if (updating) return;
        setUpdating(true);
        const isLikedUpdated = !isLiked;
        setIsLiked(isLikedUpdated);
        setLikes((prev) => (isLikedUpdated ? prev + 1 : prev - 1));
        try {
            const liked = await toggleLikeProject(projectId);
        } catch (err) {
            toast({
                title: "Failed to toggle like",
                description: "Please try again later.",
                variant: "destructive",
            });
            setIsLiked((prev) => !prev);
        } finally {
            setUpdating(false);
        }
    }, [projectId, updating]);

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

export default LikeButton;
