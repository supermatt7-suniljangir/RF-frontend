import ApiService from "@/api/wrapper/axios-wrapper";
import axios from "axios";

// Define the expected response type
interface ToggleBookmarkResponse {
  success: boolean;
  message: string;
}

export const toggleBookmarkProject = async (
  projectId: string
): Promise<{ message: string } | null> => {
  const apiService = ApiService.getInstance();

  try {
    const response = await apiService.put<ToggleBookmarkResponse>(
      `/bookmarks/toggle/${projectId}`
    );
    // Validate the response structure
    if (response.data.success) {
      return { message: response.data.message };
    } else {
      console.error("Unexpected response:", response.data);
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error toggling bookmark:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }

    return null; // Return null in case of an error
  }
};
