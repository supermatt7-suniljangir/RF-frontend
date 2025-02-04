"use client";
import React, { useEffect, useState } from "react";
import { Heart, ThumbsUp } from "lucide-react";
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
    const [likes, setLikes] = useState<number>(initialLikes); // Dynamic likes count
    const [updating, setUpdating] = useState<boolean>(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            if(isLoading || !user) return;
            const response = await hasUserLikedProject(projectId);
            setIsLiked(response);
        };
        checkLikeStatus();
    }, [projectId]);

    const onClickHandler = async () => {
        if (updating) return;
        setUpdating(true);
        const response = await toggleLikeProject(projectId);

        if (!response) {
            toast({
                title: "Error",
                description: "An error occurred while performing the operation.",
                variant: "destructive",
            });
            setUpdating(false);
            return;
        }

        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikes((prevLikes) => (newLikedState ? prevLikes + 1 : prevLikes - 1));
        setUpdating(false);
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

export default LikeButton;
