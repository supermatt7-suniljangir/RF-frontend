"use server";
import { URL } from "@/api/config/configs";
import { User } from "@/types/user";
import { cookies } from "next/headers"; // Import cookies API to directly retrieve cookies

// This function wraps the getUserProfile function and caches the result
export const getUserProfile = async ({ cacheSettings }: { cacheSettings?: "force-cache" | "reload" | "no-store" | "default" }): Promise<User | null> => {
  try {
    const cookieStore = await cookies(); // Get cookies
    const authToken = cookieStore.get("auth_token")?.value || ""; 

    const url = URL + "/users/";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { "Cookie": `auth_token=${authToken}` }), 
      },
      cache: cacheSettings || "force-cache", 
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }
    const data: User = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Profile fetch error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return null;
  }
};
