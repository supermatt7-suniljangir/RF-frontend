"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import axios from "axios";

// Define the expected response type
interface ToggleLikeResponse {
  success: boolean;
  message: string;
}

export const toggleLikeProject = async (
  projectId: string
): Promise<boolean | null> => {
  const apiService = ApiService.getInstance();

  try {
    const response = await apiService.put<ToggleLikeResponse>(
      `/likes/toggle/${projectId}`
    );
    // Validate the response structure
    if (response.data.success) {
      return response.data.success;
    } else {
      console.error("Unexpected response:", response.data);
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error toggling like:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }

    return null; // Return null in case of an error
  }
};
