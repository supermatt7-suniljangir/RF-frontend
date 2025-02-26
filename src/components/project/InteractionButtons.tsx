"use client";
import { memo, useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useBookmarkOperations } from "@/features/bookmarks/useBookmarkOperations";

interface InteractionButtonsProps {
  projectId: string;
}

function InteractionButtons({ projectId }: InteractionButtonsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { user, isLoading } = useUser();
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);

  const { checkBookmarkStatus, toggleBookmarkProject } = useBookmarkOperations();

  useEffect(() => {
    const checkSaveStatus = async () => {
      if (isLoading || !user) return;
      const response = await checkBookmarkStatus(projectId);
      setIsSaved(response);
    };
    checkSaveStatus();
  }, [projectId, user, isLoading, checkBookmarkStatus]);

  const handleSave = async () => {
    const isSavedUpdated = !isSaved;
    try {
      setIsSaved(isSavedUpdated);
      setIsSavingBookmark(true);
      await toggleBookmarkProject(projectId);
    } catch (error) {
      setIsSaved((prev) => !prev);
    } finally {
      setIsSavingBookmark(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        disabled={isSavingBookmark || isLoading || !user}
        variant="outline"
        onClick={handleSave}
        className="hover:bg-secondary w-10 h-10 rounded-full bg-secondary"
      >
        <Bookmark
          className={`w-5 h-5 ${isSaved
              ? "fill-primary-foreground text-primary-foreground"
              : "text-primary-foreground"
            }`}
        />
      </Button>
    </div>
  );
}

export default memo(InteractionButtons);
