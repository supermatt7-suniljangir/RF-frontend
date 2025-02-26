"use server";

import { URL } from "@/api/config/configs";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { ApiResponse } from "@/lib/ApiResponse";

interface GetUserProfileArgs {
  cacheSettings?: "force-cache" | "reload" | "no-store" | "default";
}

export const getUserProfile = async ({
  cacheSettings = "default",
}: GetUserProfileArgs = {}): Promise<ApiResponse> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const url = `${URL}/users/profile`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: cacheSettings,
      next: {
        revalidate: 60 * 60,
      },
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      console.error("Failed to fetch user profile:", response.statusText);
      return {
        success: false,
        data: null,
        message: data.message || "Failed to fetch user profile",
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      data: null,
      message: (error as Error).message || "Internal server error",
    };
  }
};
