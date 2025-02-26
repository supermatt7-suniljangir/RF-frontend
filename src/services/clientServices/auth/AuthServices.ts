// services/auth/loginService.ts
"use client";
import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";
import { LoginPayload, RegisterPayload } from "@/types/auth";

class AuthService {
  static api = ApiService.getInstance();

  static login = async (data: LoginPayload): Promise<ApiResponse> => {
    const response = await this.api.post<ApiResponse>("/users/auth", data);

    if (response.status !== 200 || !response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data;
  };

  static googleLogin = async (googleToken: string): Promise<ApiResponse> => {
    const response = await this.api.post<ApiResponse>("/users/auth", {
      googleToken,
    });
    console.log(response);
    if (response.status !== 200 || !response.data.success) {
      throw new Error(response.data.message || "Google authentication failed");
    }

    return response.data;
  };

  static register = async (data: RegisterPayload): Promise<ApiResponse> => {
    const response = await this.api.post<ApiResponse>("/users/register", data);

    if (response.status !== 201 || !response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }

    return response.data;
  };
}

export default AuthService;
