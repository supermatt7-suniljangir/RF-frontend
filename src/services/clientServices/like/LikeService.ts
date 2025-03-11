"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/types/ApiResponse";

export default class LikeService {
  private static apiService = ApiService.getInstance();

  // Check if a project is liked
  public static checkLikeStatus = async (
    projectId: string
  ): Promise<ApiResponse> => {
    if (!projectId) throw new Error("Project ID is required");

    const response = await this.apiService.get<ApiResponse>(
      `/likes/${projectId}/check`
    );
    if (!response.data.success || response.status !== 200) {
      throw new Error(response.data.message);
    }
    return response.data;
  };

  // Toggle like status for a project
  public static toggleLikeProject = async (
    projectId: string
  ): Promise<ApiResponse> => {
    if (!projectId) throw new Error("Project ID is required");

    const response = await this.apiService.put<ApiResponse>(
      `/likes/${projectId}/toggle`
    );
    if (!response.data.success || response.status !== 200) {
      throw new Error(response.data.message);
    }
    return response.data;
  };
}
