
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";
import { revalidateTags } from "@/lib/revalidateTags";
import axios from "axios";
import { revalidateTag } from "next/cache";

export const toggleLikeProject = async (
  projectId: string
): Promise<boolean> => {
  const apiService = ApiService.getInstance();

  try {
    const response = await apiService.put<ApiResponse>(
      `/likes/${projectId}/toggle`
    );
    // Validate the response structure
    if (!response.data.success || response.status !== 200) {
      console.error("Error toggling like:", response.data.message);
      throw new Error(response.data.message);
    }
    revalidateTags("likedProjects");
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error toggling like:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
    return false;
  }
};
