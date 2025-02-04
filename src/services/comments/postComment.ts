import ApiService from "@/api/wrapper/axios-wrapper";
import { toast } from "@/hooks/use-toast";
import { revalidateRoute } from "@/lib/revalidatePath";
import { IComment } from "@/types/others";
import axios from "axios";

interface Comment {
  projectId: string;
  content: string;
}

interface PostCommentResponse {
  success: boolean;
  message: string;
  data: IComment; // Assuming the API returns the newly created comment object
}

export const postComment = async ({
  projectId,
  content,
}: Comment): Promise<PostCommentResponse | null> => {
  if (!projectId || !content) {
    toast({
      title: "Error",
      description: "Project ID or content is missing",
      variant: "destructive",
    });
    return null;
  }

  const apiService = ApiService.getInstance();

  try {
    const response = await apiService.post<PostCommentResponse>(
      `/comments/${projectId}`,
      {
        content,
      }
    );

    // Check if success flag in response data is true
    if (response.data.success) {
      toast({
        title: "success",
        description: "Comment posted successfully",
        variant: "default",
      });
      revalidateRoute(`/project/${projectId}`); // Revalidate the route after posting a comment
      return response.data;
    } else {
      // If success is false, display error toast
      toast({
        title: "Error",
        description: response.data.message || "Failed to post comment",
        variant: "destructive",
      });
      return null;
    }
  } catch (error) {
    // Catching unexpected errors and displaying the error message
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to post comment:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
    return null;
  }
};
