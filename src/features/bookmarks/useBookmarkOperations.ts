"use client";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import BookmarkService from "@/services/clientServices/bookmark/BookmarksService";
import { revalidateTags } from "@/lib/revalidateTags";

export function useBookmarkOperations() {
  const { toast } = useToast();

  const checkBookmarkStatus = useCallback(
    async (projectId: string): Promise<boolean> => {
      try {
        const res = await BookmarkService.checkBookmarkStatus(projectId);
        return res.data;
      } catch (error: any) {
        toast({
          title: "Error Checking Bookmark",
          description: error.message || "Failed to check bookmark status.",
          variant: "destructive",
        });
        return false;
      }
    },
    [toast],
  );

  const toggleBookmarkProject = useCallback(
    async (projectId: string): Promise<boolean> => {
      try {
        const isBookmarked =
          await BookmarkService.toggleBookmarkProject(projectId);
        return isBookmarked.data;
      } catch (error) {
        toast({
          title: "Error Toggling Bookmark",
          description: error.message || "Failed to toggle bookmark status.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast],
  );

  return { checkBookmarkStatus, toggleBookmarkProject };
}
