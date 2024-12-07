import { API } from "@/api/config/axios";
import { User } from "@/types/user";

interface ProfileResponse {
  success: boolean;
  data: User;
}

export async function fetchProfileById(userId: string): Promise<User | null> {
  try {
    const url = `/users/${userId}`;

    const response = await API.get<ProfileResponse>(url);

    if (!response || !response?.data?.success) {
      console.error("Failed to fetch user profile", response);
      return null;
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
