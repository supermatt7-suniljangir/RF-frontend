import { URL } from "@/api/config/configs";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/lib/ApiResponse";
import { IComment } from "@/types/others";
import { cache } from "react";

export const fetchComments = async (projectId: string): Promise<IComment[]> => {
  if (!projectId) throw new Error("Project ID is required");

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
    const result: ApiResponse = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("An unexpected error occurred:", error as Error);
    toast({
      title: "Error Fetching Comments",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};
