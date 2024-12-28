// components/ProjectHeader/InteractionButtons.tsx
"use client";
import { useState } from "react";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeButton from "./LikeButton";

interface InteractionButtonsProps {
  projectId: string;
}

export default function InteractionButtons({ projectId }: InteractionButtonsProps) {
  const [isSaved, setIsSaved] = useState(false);
  return (
    <div className="flex items-center gap-3">

      <LikeButton projectId={projectId} size={"small"} />
      <Button
        variant="outline"
        onClick={() => setIsSaved(!isSaved)}
        className="hover:bg-secondary w-10 h-10 rounded-full bg-secondary"
      >
        <Bookmark
          className={`w-5 h-5 ${isSaved
            ? "fill-primary-foreground text-primary-foregfill-primary-foreground"
            : "text-primary-foreground"
            }`}
        />
      </Button>
    </div>
  );
}
