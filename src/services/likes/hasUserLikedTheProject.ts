
import ApiService from "@/api/wrapper/axios-wrapper"; // Assuming the axios-wrapper is in the path
import axios from "axios";
import { cache } from "react";

// Define the response type to ensure correct data structure
interface LikeStatusResponse {
  success: boolean;
  data: boolean; 
}

// Wrap the function in React's cache
export const hasUserLikedProject = cache(
  async (projectId: string): Promise<boolean> => {
    const apiService = ApiService.getInstance();
    try {
      // Make the GET request to check if the user has liked the project
      const response = await apiService.get<LikeStatusResponse>(
        `/likes/check/${projectId}`
      );
      // The API should return success and the like status
      if (response.data.success) {
        return response.data.data;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error checking like status:",
          error.response?.data || error.message
        );
      } else {
        console.error("An unexpected error occurred:", error as Error);
      }
      return false; // If error, return false
    }
  }
);
