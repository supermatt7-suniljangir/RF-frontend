import ApiService, { ApiResponse } from "@/api/wrapper/axios-wrapper";
import { ProjectMini } from "@/types/project";
interface ProjectResponse {
  projects: ProjectMini[];
  success: boolean;
}
export async function getProjects(): Promise<ProjectMini[] | null> {
  try {
    const apiService = ApiService.getInstance();
    const url = `/projects/`;
    const response: ApiResponse<ProjectResponse> = await apiService.get(url);
    if (!response) {
      console.log(response);
      throw new Error("Failed to fetch projects");
    }
    return response.data.projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return null;
  }
}
