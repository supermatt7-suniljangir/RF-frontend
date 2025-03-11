"use server";

import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/types/ApiResponse";
import { IBookmark } from "@/types/others";
import { cookies } from "next/headers";

/**
 * Fetches user bookmarks from the server.
 * Returns a standardized ApiResponse with success, data, and message fields.
 */
export async function getUserBookmarks(): Promise<ApiResponse<IBookmark[]>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const url = `${URL}/bookmarks/`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      next: {
        tags: ['bookmarks-user'],
        revalidate: 60 * 15,
      },
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    const result: ApiResponse<IBookmark[]> = await response.json();

    if (!response.ok || !result.success) {
      console.error("Failed to fetch bookmarks:", response.statusText);
      return {
        success: false,
        message: result.message || "Failed to fetch bookmarks.",
      };
    }

    return result;
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error.message);
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}
