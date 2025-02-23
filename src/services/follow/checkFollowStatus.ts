"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";
import axios from "axios";
import { revalidateTags } from "@/lib/revalidateTags";

// Hook to check if the current user is following a particular user
export const checkFollowStatus = async (userId: string): Promise<boolean> => {
    const apiService = ApiService.getInstance();
    try {
        const response = await apiService.get<ApiResponse>(
            `/follow/${userId}/check`
        );
        if (!response.data.success || response.status !== 200) {
            console.error("Error checking follow status:", response.data.message);
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                "Error checking follow status:",
                error.response?.data || error.message
            );
        } else {
            console.error("An unexpected error occurred:", error as Error);
        }
        return false;
    }
};
