"use server";

import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "@/types/user";

/**
 * Fetches a user profile by ID with consistent ApiResponse structure.
 */
export const getProfileById = async (
  userId: string,
): Promise<ApiResponse<User>> => {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }

  try {
    const url = `${URL}/users/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: [`userProfile-${userId}`],
        revalidate: 60 * 15,
      },
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok || !result.success) {
      console.error(
        "Failed to fetch user profile:",
        result.message || response.statusText,
      );
      return {
        success: false,
        message: result.message || "Failed to fetch user profile",
      };
    }

    return result;
  } catch (error: unknown) {
    console.error("Error fetching user profile:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
