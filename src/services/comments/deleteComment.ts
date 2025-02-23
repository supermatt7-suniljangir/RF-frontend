"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { toast } from "@/hooks/use-toast";
import { revalidateTags } from "@/lib/revalidateTags";
import axios from "axios";

// Delete a comment from a project
interface DeleteCommentProps {
  projectId: string;
  commentId: string;
}
interface DeleteCommentResponse {
  success: boolean;
  message: string;
}
export const deleteComment = async ({
  projectId,
  commentId,
}: DeleteCommentProps): Promise<void> => {
  if (!projectId || !commentId) {
    toast({
      title: "Error",
      description: "Project ID or Comment ID is missing",
      variant: "destructive",
    });
    return;
  }
  const apiService = ApiService.getInstance();
  try {
    const response = await apiService.delete<DeleteCommentResponse>(
      `/comments/${projectId}/${commentId}`
    );
    if (response.status !== 200 || !response.data.success) {
      throw new Error(response.data.message);
    }
    revalidateTags([`comments-${projectId}`]);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to delete comment:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
    toast({
      title: "Error Deleting Comment",
      description: error.message,
      variant: "destructive",
    });
  }
};
