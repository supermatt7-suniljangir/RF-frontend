import ApiService from "@/api/wrapper/axios-wrapper";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { revalidateRoute } from "@/lib/revalidatePath";
import { ProjectType, ProjectUploadType } from "@/types/project";
import { ProjectOperationResponse } from "@/types/others";

export const createNewProject = async (
  data: ProjectUploadType
): Promise<ProjectOperationResponse | null> => {
  const apiService = ApiService.getInstance();
  try {
    const response = await apiService.post<ProjectOperationResponse>(
      `/projects/`,
      data
    );

    if (response.status === 201) {
      toast({
        title: "Success",
        description: "Project created successfully",
        variant: "default",
      });
      revalidateRoute(`/profile`);
      return response.data;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to create project:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
  }
};

export const updateProject = async (
  data: ProjectUploadType
): Promise<ProjectOperationResponse | null> => {
  if (!data && !data._id) {
    toast({
      title: "Error",
      description: "No data provided or project ID missing",
      variant: "destructive",
    });
    return null;
  }
  const apiService = ApiService.getInstance();
  try {
    const response = await apiService.put<ProjectOperationResponse>(
      `/projects/${data._id}`,
      data
    );
    if (response.status === 200) {
      toast({
        title: "Success",
        description: "Project updated successfully",
        variant: "default",
      });
      revalidateRoute(`/profile`);
      return response.data;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to update project:",
        error.response?.data || error.message
      );
      toast({
        title: "Error",
        description: error.response?.data || error.message,
        variant: "destructive",
      });
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
  }
};
