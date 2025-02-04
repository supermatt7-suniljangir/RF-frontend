import { User } from "@/types/user";
import { URL } from "@/api/config/configs";

interface ProfileResponse {
  success: boolean;
  data: User;
}

// Wrap the fetch function in React's cache
export const getProfileById = async (userId: string): Promise<User | null> => {
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

    if (!response.ok) {
      console.error("Failed to fetch user profile:", response.statusText);
      return null;
    }

    const data: ProfileResponse = await response.json();

    if (!data.success) {
      console.error(
        "Failed to fetch user profile, API returned success false",
        data
      );
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
