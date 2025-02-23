"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/lib/ApiResponse";
import { revalidateTags } from "@/lib/revalidateTags";
import axios from "axios";

export const toggleBookmarkProject = async (
  projectId: string
): Promise<boolean> => {
  const apiService = ApiService.getInstance();

  try {
    const response = await apiService.put<ApiResponse>(
      `/bookmarks/${projectId}/toggle`
    );
    if (!response.data.success && ![200, 201].includes(response.status)) {
      console.error("Error toggling bookmark:", response.data.message);
      throw new Error(response.data.message);
    }
    revalidateTags([`bookmarks`]);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error toggling bookmark:",
        error.response?.data || error.message
      );
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
    toast({
      title: "Error Toggling Bookmark",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};
