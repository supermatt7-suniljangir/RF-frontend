"use client";
import ApiService from "@/api/wrapper/axios-wrapper"; // Assuming the axios-wrapper is in the path
import { ApiResponse } from "@/lib/ApiResponse";
import axios from "axios";
import { cache } from "react";

// Wrap the function in React's cache
export const checkBookmarkStatus = async (
  projectId: string
): Promise<boolean> => {
  const apiService = ApiService.getInstance();
  try {
    // Make the GET request to check if the user has bookmarked the project
    const response = await apiService.get<ApiResponse>(
      `/bookmarks/${projectId}/check`
    );
    if (!response.data.success) {
      console.error("Error checking bookmark status:", response.data.message);
      throw new Error(response.data.message);
    }
    return response.data.data;
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
};
