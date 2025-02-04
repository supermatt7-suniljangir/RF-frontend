
import ApiService from "@/api/wrapper/axios-wrapper"; // Assuming the axios-wrapper is in the path
import axios from "axios";
import { cache } from "react";

// Define the response type to ensure correct data structure
interface BookmarkStatusResponse {
  success: boolean;
  data: boolean; 
}

// Wrap the function in React's cache
export const checkBookmarkStatus = cache(
  async (projectId: string): Promise<boolean> => {
    const apiService = ApiService.getInstance();
    try {
      // Make the GET request to check if the user has bookmarked the project
      const response = await apiService.get<BookmarkStatusResponse>(
        `/bookmarks/check/${projectId}`
      );
      // The API should return success and the bookmark status
      if (response.data.success) {
        return response.data.data;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error checking bookmark status:",
          error.response?.data || error.message
        );
      } else {
        console.error("An unexpected error occurred:", error as Error);
      }
      return false; // If error, return false
    }
  }
);
