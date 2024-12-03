import { useState } from "react";
import ApiService from "../../api/wrapper/axios-wrapper";
import { URLResolver } from "../../backend/URLResolver";
import { UserData } from "../../models/UserModel";

// Define proper types for the request and response
interface UpdateUserRequest {
  name: string;
  role: string;
  mobile: string;
  country: string;
}

// TODO: Update this interface once the actual API response structure is known
interface UpdateUserResponse {
  success: boolean;
  user: UserData;
  message?: string;
}

interface UpdateUserError {
  message: string;
}

const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<UpdateUserError | null>(null);

  const apiService = ApiService.getInstance();

  const updateUser = async (
    data: UpdateUserRequest
  ): Promise<UpdateUserResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: UpdateUserRequest = {
        name: data.name,
        role: data.role,
        mobile: data.mobile,
        country: data.country,
      };

      const response = await apiService.post<UpdateUserResponse>(
        URLResolver.updateUser(),
        payload
      );
      return {
        success: true,
        user: response.data!.user,
        message: "User updated successfully",
      };
    } catch (error) {
      let errorMessage = "Failed to update user";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError({
        message: errorMessage,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateUser,
  };
};

export default useUpdateUser;
