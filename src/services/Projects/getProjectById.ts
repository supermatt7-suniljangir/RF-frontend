import { URL } from "@/api/config/configs";
import { ProjectType } from "@/types/project";

interface ProjectResponse {
  data: ProjectType;
  success: boolean;
}

interface GetProjectByIdArgs {
  id: string;
  cacheSettings?: "no-store" | "reload" | "force-cache" | "default";
}

export const getProjectById = async ({
  id,
  cacheSettings = "default",
}: GetProjectByIdArgs): Promise<ProjectType | null> => {
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
      cache: cacheSettings ? cacheSettings : "default", // Use the provided cache setting
    });

    if (!response.ok) {
      console.error("Failed to fetch project by ID:", response.statusText);
      return null;
    }

    const data: ProjectResponse = await response.json();

    if (!data.success) {
      console.error("API returned success: false", data);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};
