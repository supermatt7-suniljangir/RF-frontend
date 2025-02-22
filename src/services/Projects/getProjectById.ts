import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/lib/ApiResponse";
import { ProjectType } from "@/types/project";

interface GetProjectByIdArgs {
  id: string;
  cacheSettings?: "no-store" | "reload" | "force-cache" | "default";
}

export const getProjectById = async ({
  id,
  cacheSettings = "default",
}: GetProjectByIdArgs): Promise<ApiResponse> => {
  try {
    const url = `${URL}/projects/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60 * 15,
      },
    });
    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      console.error("Failed to fetch project by ID:", response.statusText);
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};
