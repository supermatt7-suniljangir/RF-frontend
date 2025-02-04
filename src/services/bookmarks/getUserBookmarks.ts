"use server";
import { URL } from "@/api/config/configs";
import { IBookmark } from "@/types/others";
import { cookies } from "next/headers";

interface GetBookmarksResponse {
  success: boolean;
  data: IBookmark[];
  message?: string;
}

export const getUserBookmarks = async (): Promise<IBookmark[]> => {
  const cookieStore = await cookies(); // Access the cookies directly
  const cookieHeader = cookieStore.toString();
  const url = `${URL}/bookmarks/`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    next: {
      revalidate: 60 * 15,
    },
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader, // Send cookies to backend for authentication
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch bookmarks:", response.statusText);
    return [];
  }

  const result: GetBookmarksResponse = await response.json();
  if (!result.success) {
    console.error("Failed to fetch bookmarks:", result.message);
    return [];
  }
  console.log(result);

  return result.data;
};
