"use server";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/lib/ApiResponse";
import { User } from "@/types/user";
import { cookies } from "next/headers";

interface CacheSettings {
  cacheSettings?: "force-cache" | "reload" | "no-store" | "default";
}

interface UserProfileResponse {
  user: User | null;
  status: number;
  message: string;
}

export const getUserProfile = async ({
  cacheSettings,
}: CacheSettings): Promise<UserProfileResponse> => {
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
      next: {
        revalidate: 60 * 60,
      },
    });
    const result: ApiResponse = await response.json();
    if (!response.ok || !result.success) {
      return {
        user: null,
        status: response.status,
        message: result.message || "Failed to fetch user profile",
      };
    }

    return {
      user: result.data || null,
      status: response.status,
      message: result.message,
    };
  } catch (error) {
    console.error("Profile fetch error:", error);
    return {
      user: null,
      status: 500,
      message: "Internal server error",
    };
  }
};
