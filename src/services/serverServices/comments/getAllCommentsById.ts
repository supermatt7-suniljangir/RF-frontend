"use server";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/lib/ApiResponse";
import { IComment } from "@/types/others";

export const fetchComments = async (
  projectId: string
): Promise<ApiResponse<IComment[]>> => {
  if (!projectId) {
    return { success: false, message: "Project ID is required" };
  }

  try {
    const response = await fetch(`${URL}/comments/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: [`comments-${projectId}`],
        revalidate: 60 * 15,
      },
    });

    const result: ApiResponse<IComment[]> = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to fetch comments",
      };
    }

    return result;
  } catch (error: any) {
    console.error("Error fetching comments:", error.message);
    return { success: false, message: error.message };
  }
};
