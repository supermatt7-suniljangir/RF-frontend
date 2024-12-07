// components/ProjectHeader/InteractionButtons.tsx
"use client";
import { useState } from "react";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractionButtonsProps {
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
}

export default function InteractionButtons({ stats }: InteractionButtonsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => setIsLiked(!isLiked)}
        variant="outline"
        className="hover:bg-secondary w-10 h-10 rounded-full bg-secondary "
      >
        <Heart
          className={`w-5 h-5 ${
            isLiked
              ? "fill-primary-foreground text-primary-foreground"
              : "text-primary-foreground"
          }`}
        />
      </Button>
      <Button
      variant="outline"
        onClick={() => setIsSaved(!isSaved)}
        className="hover:bg-secondary w-10 h-10 rounded-full bg-secondary"
      >
        <Bookmark
          className={`w-5 h-5 ${
            isSaved
              ? "fill-primary-foreground text-primary-foregfill-primary-foreground"
              : "text-primary-foreground"
          }`}
        />
      </Button>
    </div>
  );
}
