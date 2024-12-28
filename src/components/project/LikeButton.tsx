"use client";
import React, { useEffect, useState } from 'react';
import { Heart, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { toggleLikeProject } from '@/services/likes/toggleProjectLike';
import { set } from 'react-hook-form';
import { hasUserLikedProject } from '@/services/likes/hasUserLikedTheProject';

interface LikeButtonProps {
    className?: string;
    projectId: string;
    size?: 'small' | 'large';
}

const LikeButton: React.FC<LikeButtonProps> = ({ size = "small", projectId, className }) => {

    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            const response = await hasUserLikedProject(projectId);
            setIsLiked(response);
        }
        checkLikeStatus();
    }, []);

    const [updating, setUpdating] = useState<boolean>(false);

    const onClickHandler = async () => {
        if (updating) return;
        setUpdating(true);
        const response = await toggleLikeProject(projectId);
        if (!response) {
            toast({
                title: "Error",
                description: "An error occurred while performing the operation.",
                variant: "destructive",
            })
        }
        toast({
            title: "Success",
            description: "Project liked",
            variant: "default"
        });
        setUpdating(false);
        setIsLiked(!isLiked);
    }


    return (
        <Button
            onClick={onClickHandler}
            disabled={updating}
            variant="outline"
            className={cn("hover:bg-secondary rounded-full bg-secondary", size === "small" ? "w-10 h-10" : "w-20 h-20", className)}
        >
            <Heart
                className={cn(size === "small" ? "!w-5 !h-5" : "!w-10 !h-10", isLiked ? "fill-primary-foreground text-primary-foreground" : "text-primary-foreground")}
            />
        </Button>
    );
};

export default LikeButton;