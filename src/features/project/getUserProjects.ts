import { API } from "@/api/config/axios";
import { ProjectMini } from "@/types/project";
// import axios from "axios";

interface ProjectsResponse {
  success: boolean;
  count: number;
  data: ProjectMini[];
}

export async function getUserProjects(
  authToken?: string | null,
  userId?: string
): Promise<ProjectMini[] | null> {
  try {
    // const apiService = ApiService.getInstance();
    // Construct the URL based on whether userId is provided
    const url = userId ? `projects/user/${userId}` : `projects/user/personal`;

    const response = await API.get<ProjectsResponse>(url, {
      headers: {
        Cookie: `auth_token=${authToken}`,
      },
    });

    if (!response || !response?.data?.success) {
      console.error("Failed to fetch user projects", response);
      return null;
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return null;
  }
}
