"use client";

import ApiService from "@/api/wrapper/axios-wrapper";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/lib/ApiResponse";
import { revalidateRoute } from "@/lib/revalidatePath";
import { ProjectUploadType } from "@/types/project";

class ProjectUploadService {
  private api = ApiService.getInstance();

  async createProject(data: ProjectUploadType): Promise<ApiResponse> {
    const response = await this.api.post<ApiResponse>("/projects/", data);
    if (response.status !== 201 || !response.data.success) {
      throw new Error(`Failed to create project. Status: ${response.status}`);
    }
    toast({
      title: "Success",
      description: "Project created successfully",
      variant: "default",
    });
    revalidateRoute("/profile");
    return response.data;
  }

  async updateProject(data: ProjectUploadType): Promise<ApiResponse> {
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
    toast({
      title: "Success",
      description: "Project updated successfully",
      variant: "default",
    });

    revalidateRoute("/profile");
    return response.data;
  }
}

export const projectUploadService = new ProjectUploadService();
