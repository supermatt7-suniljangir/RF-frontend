"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";
import { User } from "@/types/user";

class UserProfileService {
  // Method to update the user profile
  static async updateProfile(payload: Partial<User>): Promise<ApiResponse> {
    const apiService = ApiService.getInstance();
    const url = `/users/profile`;

    const response = await apiService.put<ApiResponse>(url, payload);

    if (response.status !== 200 || !response.data.success) {
      throw new Error("Failed to update user profile");
    }
    return response.data;
  }

  
}

export default UserProfileService;
