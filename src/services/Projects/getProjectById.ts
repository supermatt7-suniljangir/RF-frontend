


import { ProjectType } from "@/types/project";

interface ProjectResponse {
  data: ProjectType;
  success: boolean;
}

// Wrap the function in React's cache
export const getProjectById = async (id: string): Promise<ProjectResponse | null> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache", // Use caching explicitly
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


