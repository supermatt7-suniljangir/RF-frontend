interface ProjectResponse {
  data: ProjectType;
  success: boolean;
}
import ApiService, { ApiResponse } from "@/api/wrapper/axios-wrapper";
import { ProjectType } from "@/types/project";

interface LoginPayload {
  id: string;
}

export async function fetchProjectById({
  id,
}: LoginPayload): Promise<ProjectResponse | null> {
  try {
    const apiService = ApiService.getInstance();
    const url = `/projects/${id}`;
    const response: ApiResponse<ProjectResponse> = await apiService.get(url);
    if (!response) {
      console.log(response);
      throw new Error("Failed to fetch project by ID");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
}
