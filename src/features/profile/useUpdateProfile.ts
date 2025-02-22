import { useState } from "react";
import { User } from "@/types/user";
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";

export function useUpdateUserProfile() {
  const [loading, setLoading] = useState<boolean>(false);

  const updateProfile = async (
    payload: Partial<User>
  ): Promise<ApiResponse> => {
    try {
      setLoading(true);
      const apiService = ApiService.getInstance();
      const url = `/users/profile`;
      const response= await apiService.put<ApiResponse>(
        url,
        payload
      );

      if (response.status !== 200 || !response.data.success) {
        console.error("No response from API");
        throw new Error("Failed to update user profile");
      }
      return response.data;
    } catch (error) {

      console.error("Error updating user profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
}
