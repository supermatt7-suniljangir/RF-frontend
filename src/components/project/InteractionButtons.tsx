"use client";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkBookmarkStatus } from "@/services/bookmarks/hasUserBookmarkedTheProject";
import { toggleBookmarkProject } from "@/services/bookmarks/toggleBookmark";
import { toast } from "@/hooks/use-toast";
import { revalidateRoute } from "@/lib/revalidatePath";
import { useUser } from "@/contexts/UserContext";

interface InteractionButtonsProps {
  projectId: string;
}

export default function InteractionButtons({ projectId }: InteractionButtonsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { user, isLoading } = useUser();
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);
  useEffect(() => {
    const checkSaveStatus = async () => {
      if (isLoading || !user) return;
      const response = await checkBookmarkStatus(projectId);
      setIsSaved(response);
    }
    checkSaveStatus();
  }, [projectId, user]);


  const handleSave = async () => {
    const response = await toggleBookmarkProject(projectId);
    if (!response) {
      toast({
        title: "Error",
        description: "An error occurred while performing the operation.",
        variant: "destructive",
      });
    };
    setIsSaved((prev) => !prev);
    revalidateRoute('/profile');
  }

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
            ? "fill-primary-foreground text-primary-foregfill-primary-foreground"
            : "text-primary-foreground"
            }`}
        />
      </Button>
    </div>
  );
}

