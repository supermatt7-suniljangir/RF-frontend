import ApiService from "@/api/wrapper/axios-wrapper";
import { User } from "@/types/user";

export const fetchProfile = async (): Promise<User | null> => {
  try {
    const apiService = ApiService.getInstance();
    const response = await apiService.get<User>("/users/");

    // Validate the response structure
    if (response && response.data) {
      return response.data;
    } else {
      console.warn("Unexpected response structure:", response);
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Profile fetch error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return null;
  }
};
