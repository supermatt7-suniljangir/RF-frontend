"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/types/ApiResponse";
import { revalidateTags } from "@/lib/revalidateTags";

class FollowService {
  // Static method to check follow status
  static checkFollowStatus = async (userId: string): Promise<ApiResponse> => {
    const apiService = ApiService.getInstance();
    const response = await apiService.get<ApiResponse>(
      `/follow/${userId}/check`
    );

    if (!response.data.success || response.status !== 200) {
      console.error("Error checking follow status:", response.data.message);
      throw new Error(response.data.message);
    }

    return response.data;
  };

  // Static method to toggle follow status
  static toggleFollowUser = async (userId: string): Promise<ApiResponse> => {
    const apiService = ApiService.getInstance();
    const response = await apiService.put<ApiResponse>(
      `/follow/${userId}/toggle`
    );

    if (!response.data.success || response.status !== 200) {
      console.error("Error toggling follow status:", response.data.message);
      throw new Error(response.data.message);
    }
    return response.data;
  };
}

export default FollowService;
