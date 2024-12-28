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
  cacheSettings = "force-cache",
}: GetProjectByIdArgs): Promise<ProjectResponse | null> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: cacheSettings ? cacheSettings : "force-cache", // Use the provided cache setting
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

    return data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};
