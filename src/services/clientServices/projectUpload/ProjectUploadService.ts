"use client";

import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/types/ApiResponse";
import { revalidateRoute } from "@/lib/revalidatePath";
import { revalidateTags } from "@/lib/revalidateTags";
import { ProjectUploadType } from "@/types/project";

class ProjectService {
  static api = ApiService.getInstance();

  static createProject = async (
    data: ProjectUploadType,
  ): Promise<ApiResponse> => {
    const response = await this.api.post<ApiResponse>("/projects/", data);
    if (response.status !== 201 || !response.data.success) {
      throw new Error(`Failed to create project. Status: ${response.status}`);
    }
    await revalidateTags(["userProjects-personal"]);
    return response.data;
  };

  static updateProject = async (
    data: ProjectUploadType,
  ): Promise<ApiResponse> => {
    if (!data?._id) {
      throw new Error("Project ID is required for update");
    }

    const response = await this.api.put<ApiResponse>(
      `/projects/${data._id}`,
      data,
    );

    if (response.status !== 200 || !response.data.success) {
      throw new Error(`Failed to update project: ${response.data.message}`);
    }
    await revalidateTags(["userProjects-personal"]);
    await revalidateRoute(`/project/${data._id}`);
    return response.data;
  };
  static deleteProject = async (projectId: string): Promise<ApiResponse> => {
    if (!projectId) {
      throw new Error("Project ID is required for deletion");
    }

    const response = await this.api.delete<ApiResponse>(
      `/projects/${projectId}`,
    );
    if (response.status !== 200 || !response.data.success) {
      throw new Error(`Failed to delete project: ${response.data.message}`);
    }
    await revalidateTags(["userProjects-personal"]);
    return response.data;
  };
}

export default ProjectService;
