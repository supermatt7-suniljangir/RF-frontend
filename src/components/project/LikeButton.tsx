"use client";
import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
    className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ className }) => {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <Button
            variant="ghost"
            size="lg"
            className={cn(
                "rounded-full p-8 w-24 h-24 flex items-center justify-center transition-colors duration-200",
                isLiked ? "bg-primary" : "bg-muted",
                className
            )}
            onClick={() => setIsLiked(!isLiked)}
        >
            <ThumbsUp

                className={cn(
                    "!w-8 !h-8 transition-transform duration-200",
                    isLiked && "scale-125 text-primary-foreground"
                )}
            />
        </Button>
    );
};

export default LikeButton;