import { useState } from "react";
import ApiService, { ApiResponse } from "@/api/wrapper/axios-wrapper";
import { User } from "@/types/user";

interface UpdateUserResponse {
  data: User;
  success: boolean;
}

export function useUpdateUserProfile() {
  const [loading, setLoading] = useState<boolean>(false);

  const updateProfile = async (
    payload: Partial<User>
  ): Promise<UpdateUserResponse | null> => {
    try {
      setLoading(true);
      const apiService = ApiService.getInstance();
      const url = `/users/`;
      const response: ApiResponse<UpdateUserResponse> = await apiService.put(
        url,
        payload
      );

      if (!response) {
        console.error("No response from API");
        throw new Error("Failed to update user profile");
      }
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
}
