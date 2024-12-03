"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import axios from "axios";

export const logout = async (): Promise<void> => {
  const apiService = ApiService.getInstance();
  try {
    await apiService.post("/users/logout");
    window.location.href = "/login";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Logout failed:", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred:", (error as Error));
    }
  }
};
