"user server";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/types/ApiResponse";

interface GetProjectByIdArgs {
  id: string;
  cacheSettings?: "no-store" | "reload" | "force-cache" | "default";
}

export const getProjectById = async ({
  id,
  cacheSettings = "default",
}: GetProjectByIdArgs): Promise<ApiResponse> => {
  try {
    if (!id) {
      console.error("Project ID is required");
      return { success: false, message: "Project ID is required" };
    }
    const url = `${URL}/projects/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: cacheSettings,
      next: {
        tags: [`project-${id}`],
        revalidate: 60 * 15,
      },
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      console.error(
        "Failed to fetch project by ID:",
        data.message || response.statusText,
      );
      return {
        success: false,
        message: data.message || "Failed to fetch project by ID",
      };
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching project by ID:", error.message);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};
