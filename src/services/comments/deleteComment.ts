import ApiService from "@/api/wrapper/axios-wrapper";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

// Delete a comment from a project
interface DeleteCommentProps {
  projectId: string;
  commentId: string;
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
    return null;
  }
  const apiService = ApiService.getInstance();
  try {
    const response = await apiService.delete(
      `/comments/${projectId}/${commentId}`
    );
    if (response.status === 200) {
      toast({
        title: "Success",
        description: "Comment deleted successfully",
        variant: "default",
      });
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to delete comment:",error.response?.data || error.message);
        toast({
            title: "Error",
            description: error.response?.data || error.message,
            variant: "destructive"
        });
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
  }
};
