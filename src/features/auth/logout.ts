import ApiService from "@/api/wrapper/axios-wrapper";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";

export const logout = async (): Promise<void> => {
  const apiService = ApiService.getInstance();
  try {
    const res = await apiService.post<ApiResponse>("/users/logout");

    if (!res || !res.data.success || res.status !== 200) {
      throw new Error(res.data.message || "Failed to logout");
    }
  } catch (error) {
    toast({
      title: "Failed to logout",
      description: "An unexpected error occurred. Please try again later.",
      duration: 4000,
      variant: "destructive",
    });
    if (axios.isAxiosError(error)) {
      console.error("Logout failed:", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred:", error as Error);
    }
  }
};
