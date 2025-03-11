"use client";

import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/types/ApiResponse";
import { revalidateRoute } from "@/lib/revalidatePath";
import { revalidateTags } from "@/lib/revalidateTags";
import { ProjectUploadType } from "@/types/project";

class ProjectUploadService {
  static api = ApiService.getInstance();

  static createProject = async (
    data: ProjectUploadType
  ): Promise<ApiResponse> => {
    const response = await this.api.post<ApiResponse>("/projects/", data);
    if (response.status !== 201 || !response.data.success) {
      throw new Error(`Failed to create project. Status: ${response.status}`);
    }
    revalidateTags(["userProjects-personal"]);
    return response.data;
  };

  static updateProject = async (
    data: ProjectUploadType
  ): Promise<ApiResponse> => {
    if (!data?._id) {
      throw new Error("Project ID is required for update");
    }

    const response = await this.api.put<ApiResponse>(
      `/projects/${data._id}`,
      data
    );

    if (response.status !== 200 || !response.data.success) {
      throw new Error(`Failed to update project: ${response.data.message}`);
    }
    revalidateTags(["userProjects-personal"]);
    revalidateRoute(`/projects/${data._id}`);
    return response.data;
  };
}

export default ProjectUploadService;
