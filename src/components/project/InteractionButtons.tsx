"use client";
import { memo, useEffect, useState, useCallback } from "react";
import { Bookmark, Edit, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useBookmarkOperations } from "@/features/bookmarks/useBookmarkOperations";
import { ProjectType } from "@/types/project";
import { useRouter } from "next/navigation";
import ShareModal from "./ShareModal";

interface InteractionButtonsProps {
  project: ProjectType;
}

function InteractionButtons({ project }: InteractionButtonsProps) {
  if (!project) return null;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user, isLoading } = useUser();
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);
  const router = useRouter();
  const { checkBookmarkStatus, toggleBookmarkProject } = useBookmarkOperations();

  useEffect(() => {
    const checkSaveStatus = async () => {
      if (isLoading || !user) return;
      const response = await checkBookmarkStatus(project._id);
      setIsSaved(response);
    };
    checkSaveStatus();
  }, [project, user, isLoading, checkBookmarkStatus]);

  const handleSaveBookMark = useCallback(async () => {
    const isSavedUpdated = !isSaved;
    try {
      setIsSaved(isSavedUpdated);
      setIsSavingBookmark(true);
      await toggleBookmarkProject(project._id);
    } catch (error) {
      setIsSaved((prev) => !prev);
    } finally {
      setIsSavingBookmark(false);
    }
  }, [isSaved, toggleBookmarkProject, project._id]);

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          disabled={isSavingBookmark || isLoading || !user}
          variant="outline"
          onClick={handleSaveBookMark}
          className="hover:bg-secondary w-10 h-10 rounded-full bg-secondary"
        >
          <Bookmark
            className={`w-5 h-5 ${isSaved
              ? "fill-primary-foreground text-primary-foreground"
              : "text-primary-foreground"
              }`}
          />
        </Button>

        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full bg-secondary" onClick={() => setIsShareModalOpen(true)}>
          <Share2 />
        </Button>

        {user && project.creator._id === user._id && <Button onClick={() => router.push(`/project/editor/${project._id}`)} variant="outline" className="w-10 h-10 rounded-full bg-secondary">
          <Edit />
        </Button>}
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} project={project} />
    </>
  );
}

export default memo(InteractionButtons);
