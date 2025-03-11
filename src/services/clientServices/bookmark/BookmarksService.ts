"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import {ApiResponse} from "@/types/ApiResponse";
import {revalidateTags} from "@/lib/revalidateTags";

export default class BookmarkService {
    private static apiService = ApiService.getInstance();

    // Check if a project is bookmarked
    public static checkBookmarkStatus = async (
        projectId: string
    ): Promise<ApiResponse> => {
        if (!projectId) throw new Error("Project ID is required");

        const response = await this.apiService.get<ApiResponse>(
            `/bookmarks/${projectId}/check`
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    };

    // Toggle bookmark status for a project
    public static toggleBookmarkProject = async (
        projectId: string
    ): Promise<ApiResponse> => {
        if (!projectId) throw new Error("Project ID is required");

        const response = await this.apiService.put<ApiResponse>(
            `/bookmarks/${projectId}/toggle`
        );
        if (!response.data.success && ![200, 201].includes(response.status)) {
            throw new Error(response.data.message);
        }
        return response.data;
    };
}
