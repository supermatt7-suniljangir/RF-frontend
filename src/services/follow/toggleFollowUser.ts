"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";
import { revalidateTags } from "@/lib/revalidateTags";
import axios from "axios";

// Hook to toggle follow status
export const toggleFollowUser = async (userId: string): Promise<boolean> => {
  const apiService = ApiService.getInstance();
  try {
    const response = await apiService.put<ApiResponse>(
      `/follow/${userId}/toggle`
    );
    if (!response.data.success || response.status !== 200) {
      console.error("Error toggling follow status:", response.data.message);
      throw new Error(response.data.message);
    }
    revalidateTags([`userProfile-${userId}`]);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error toggling follow status:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
    throw error;
  }
};
