"use client";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import FollowService from "@/services/clientServices/follow/FollowService";
import { revalidateTags } from "@/lib/revalidateTags";

export function useFollowOperations() {
  const { toast } = useToast();

  const checkFollowStatus = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        const res = await FollowService.checkFollowStatus(userId);
        return res.data;
      } catch (error: any) {
        toast({
          title: "Error Checking Follow Status",
          description: error.message || "Failed to check follow status.",
          variant: "destructive",
        });
        return false;
      }
    },
    [toast]
  );

  const toggleFollowUser = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        const isFollowed = await FollowService.toggleFollowUser(userId);
        return isFollowed.data;
      } catch (error: any) {
        toast({
          title: "Error Toggling Follow",
          description: error.message || "Failed to toggle follow status.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast]
  );

  return { checkFollowStatus, toggleFollowUser };
}
