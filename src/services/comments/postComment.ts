import ApiService from "@/api/wrapper/axios-wrapper";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/lib/ApiResponse";
import { revalidateTags } from "@/lib/revalidateTags";
import axios from "axios";

interface Comment {
  projectId: string;
  content: string;
}

export const postComment = async ({
  projectId,
  content,
}: Comment): Promise<void> => {
  if (!projectId || !content) {
    toast({
      title: "Error",
      description: "Project ID or content is missing",
      variant: "destructive",
    });
    return;
  }

  const apiService = ApiService.getInstance();

  try {
    const response = await apiService.post<ApiResponse>(
      `/comments/${projectId}`,
      {
        content,
      }
    );
    // Check if success flag in response data is true
    if (!response.data.success || response.status !== 201) {
      throw new Error(response.data.message);
    }
    revalidateTags([`comments-${projectId}`]);
   
  } catch (error) {
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
  }
};
