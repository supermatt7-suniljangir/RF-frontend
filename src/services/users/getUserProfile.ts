"use server";
import { URL } from "@/api/config/configs";
import { User } from "@/types/user";
import { cookies } from "next/headers";

interface CacheSettings {
  cacheSettings?: "force-cache" | "reload" | "no-store" | "default";
}

interface UserProfileResponse {
  user: User | null;
  status: number;
}

// This function wraps the getUserProfile function and returns both the status and user
export const getUserProfile = async ({
  cacheSettings,
}: CacheSettings): Promise<UserProfileResponse> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const url = `${URL}/users/`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: cacheSettings || "force-cache",
    });

    if (!response.ok) {
      return { user: null, status: response.status };
    }
    const data: User = await response.json();
    return { user: data, status: response.status };
  } catch (error) {
    console.error("Profile fetch error:", error);
    return { user: null, status: 500 };
  }
};
