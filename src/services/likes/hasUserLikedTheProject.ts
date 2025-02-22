"use client";
import ApiService from "@/api/wrapper/axios-wrapper"; // Assuming the axios-wrapper is in the path
import { ApiResponse } from "@/lib/ApiResponse";
import axios from "axios";

// Wrap the function in React's cache
export const hasUserLikedProject = async (
  projectId: string
): Promise<boolean> => {
  const apiService = ApiService.getInstance();
  try {
    // Make the GET request to check if the user has liked the project
    const response = await apiService.get<ApiResponse>(
      `/likes/${projectId}/check`
    );
    if (!response.data.success || response.status !== 200) {
      console.error("Error checking like status:", response.data.message);
      throw new Error(response.data.message);
    }
    return response.data.data;
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
};
