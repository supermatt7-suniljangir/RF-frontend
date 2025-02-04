import { URL } from "@/api/config/configs";
import { IComment } from "@/types/others";
import { cache } from "react";

interface FetchCommentsResponse {
  success: boolean;
  data: IComment[];
  message?: string;
}

export const fetchComments = cache(
  async (projectId: string): Promise<IComment[]> => {
    if (!projectId) throw new Error("Project ID is required");

    const response = await fetch(`${URL}/comments/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60 * 15,
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch comments:", response.statusText);
      return [];
    }

    const result: FetchCommentsResponse = await response.json();
    if (!result.success) {
      console.error("Failed to fetch comments:", result.message);
      return [];
    }

    return result.data;
  }
);
