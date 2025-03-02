import { AxiosInstance, AxiosError } from "axios";
import { createAxiosInstance } from "../config/axios-config";

export interface ApiResponse<T = any> {
  data: T | null;
  error?: string;
  status: number;
  success: boolean;
  networkError?: boolean;
}

export class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor(headers: any = {}) {
    this.axiosInstance = createAxiosInstance(headers);
  }

  public static getInstance(headers: any = {}): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(headers);
    } else if (Object.keys(headers).length !== 0) {
      // If instance exists and headers are provided, update instance with new headers
      ApiService.instance.axiosInstance = createAxiosInstance(headers);
    }
    return ApiService.instance;
  }

  private handleResponse<T>(response: any): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  }

  private handleError(error: AxiosError): ApiResponse {
    // Check if the error is a network error (no response from server)
    if (
      error.code === "ECONNABORTED" ||
      !error.response ||
      error.message.includes("Network Error")
    ) {
      return {
        data: {
          data: null,
          message:
            "Network error occurred. Please check your internet connection.",
          success: false, // Using 0 to indicate network error
        },
        error:
          "Network error: Unable to connect to the server. Please check your internet connection.",
        status: 0, // Using 0 to indicate network error
        success: false,
        networkError: true,
      };
    }

    // Handle server errors
    const errorMessage =
      (error.response?.data as any)?.message || error.message;
    const status = error.response?.status || 500;

    return {
      data: {
        data: null,
        message: errorMessage || "An unexpected error occurred",
        success: false,
      },
      error: errorMessage || "An unexpected error occurred",
      status,
      success: false,
      networkError: false,
    };
  }

  // Standard CRUD operations
  public async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get(url);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post(url, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put(url, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(url);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }
}

export default ApiService;
