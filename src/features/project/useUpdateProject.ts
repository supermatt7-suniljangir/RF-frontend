import { useState } from "react";
import ApiService, { ApiResponse } from "@/api/wrapper/axios-wrapper";
import { ProjectType } from "@/types/project";

interface UpdateProjectPayload {
  id: string;
  data: Partial<ProjectType>;
}

interface UpdateProjectResponse {
  data: ProjectType;
  success: boolean;
}

export function useUpdateProject() {
  const [loading, setLoading] = useState<boolean>(false);

  const updateProject = async (
    payload: UpdateProjectPayload
  ): Promise<UpdateProjectResponse | null> => {
    try {
      const { id, data } = payload;
      if (!(id && data)) {
        throw new Error("Project ID  and data are required");
      }

      setLoading(true);
      const apiService = ApiService.getInstance();
      const url: string = `/projects/${id}`;
      const body: Partial<ProjectType> = data;
      const response: ApiResponse<UpdateProjectResponse> = await apiService.put(
        url,
        body
      );

      if (!response) {
        console.error("No response from API");
        throw new Error("Failed to update project");
      }
      return response.data;
    } catch (error) {
      console.error("Error updating project:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProject, loading };
}
