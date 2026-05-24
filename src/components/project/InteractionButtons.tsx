"use client";
import { useEffect, useState } from "react";
import { Bookmark, Edit, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useBookmarkOperations } from "@/features/bookmarks/useBookmarkOperations";
import { ProjectType } from "@/types/project";
import ShareModal from "./ShareModal";
import { revalidateTags } from "@/lib/revalidateTags";

interface InteractionButtonsProps {
  project: ProjectType;
}

function InteractionButtons({ project }: InteractionButtonsProps) {
  console.log("the project inside InteractionButtons is: ", project);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user, isLoading } = useUser();
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);
  const { checkBookmarkStatus, toggleBookmarkProject } =
    useBookmarkOperations();

  useEffect(() => {
    let isMounted = true;

    const checkSaveStatus = async () => {
      if (isLoading || !user) return;
      try {
        const response = await checkBookmarkStatus(project._id);
        if (isMounted) setIsSaved(response);
      } catch (error) {
        console.error("Failed to check bookmark status:", error);
      }
    };

    checkSaveStatus();

    return () => {
      isMounted = false;
    };
  }, [project._id, user, isLoading, checkBookmarkStatus]);

  const handleSaveBookMark = async () => {
    const isSavedUpdated = !isSaved;
    setIsSavingBookmark(true);
    setIsSaved(isSavedUpdated);
    try {
      await toggleBookmarkProject(project._id);
    } catch {
      setIsSaved((prev) => !prev);
    } finally {
      setIsSavingBookmark(false);
      revalidateTags(["bookmarks"]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          disabled={isSavingBookmark || isLoading || !user}
          variant="outline"
          onClick={handleSaveBookMark}
          className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary"
        >
          <Bookmark
            className={`h-5 w-5 ${
              isSaved
                ? "fill-primary-foreground text-primary-foreground"
                : "text-primary-foreground"
            }`}
          />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground"
          onClick={() => setIsShareModalOpen(true)}
        >
          <Share2 />
        </Button>

        {user && project.creator._id === user._id && (
          <Button
            onClick={() =>
              window.open(`/project/editor/${project._id}`, "_blank")
            }
            variant="outline"
            className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground"
          >
            <Edit />
          </Button>
        )}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={project}
      />
    </>
  );
}

export default InteractionButtons;
