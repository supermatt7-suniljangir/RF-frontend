"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "@/types/user";

export async function getProfile(): Promise<ApiResponse<User>> {
  const apiService = ApiService.getInstance();

  const response = await apiService.get<ApiResponse<User>>("/users/profile");

  if (response.status === 401) {
    throw new Error("AUTH_REQUIRED");
  }

  if (response.status !== 200 || !response.data.success) {
    throw new Error(response.data.message || "Failed to fetch user profile");
  }

  return response.data;
}

// Method to update the user profile
export async function updateProfile(
  payload: Partial<User>,
): Promise<ApiResponse<User>> {
  const apiService = ApiService.getInstance();
  const url = `/users/profile`;

  const response = await apiService.put<ApiResponse<User>>(url, payload);

  if (response.status !== 200 || !response.data.success) {
    throw new Error("Failed to update user profile");
  }
  return response.data;
}
