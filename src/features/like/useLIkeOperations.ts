"use client";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import LikeService from "@/services/clientServices/like/LikeService";
import { revalidateTags } from "@/lib/revalidateTags";

export function useLikeOperations() {
  const { toast } = useToast();

  const checkLikeStatus = useCallback(
    async (projectId: string): Promise<boolean> => {
      try {
        const res = await LikeService.checkLikeStatus(projectId);
        return res.data;
      } catch (error: any) {
        toast({
          title: "Error Checking Like",
          description: error.message || "Failed to check like status.",
          variant: "destructive",
        });
        return false;
      }
    },
    [toast]
  );

  const toggleLikeProject = useCallback(
    async (projectId: string): Promise<boolean> => {
      try {
        const isLiked = await LikeService.toggleLikeProject(projectId);
        return isLiked.data;
      } catch (error: any) {
        toast({
          title: "Error Toggling Like",
          description: error.message || "Failed to toggle like status.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast]
  );

  return { checkLikeStatus, toggleLikeProject };
}
