import { User } from "@/types/user";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/lib/ApiResponse";

// Wrap the fetch function in React's cache
export const getProfileById = async (userId: string): Promise<User> => {
  try {
    const url = `${URL}/users/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      next: {
        revalidate: 60 * 15,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      console.error("Failed to fetch user profile:", response.statusText);
      throw new Error(data.message || "Failed to fetch user profile");
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
