import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiErrorLog, ApiErrorResponse } from "../types/api-types";
import { logout } from "@/features/auth/useLogout";

export const createAxiosInstance = (): AxiosInstance => {
  const instance: AxiosInstance = axios.create();
  // Set base URL
  instance.defaults.baseURL =
    process.env.API_URL || "http://localhost:5500/api";

  // Configure axios to handle cookies
  instance.defaults.withCredentials = true; // Important: This enables sending cookies in cross-origin requests

  // // Request interceptor
  // instance.interceptors.request.use(
  //   (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  //     // No need to manually set Authorization header anymore as cookie will be sent automatically
  //     return config;
  //   },
  //   (error: AxiosError): Promise<never> => {
  //     return Promise.reject(error);
  //   }
  // );
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      // Explicitly set withCredentials for each request
      config.withCredentials = true;
      return config;
    },
    (error: AxiosError): Promise<never> => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError<ApiErrorResponse>): Promise<never> => {
      // Create typed error log object
      const errorLog: ApiErrorLog = {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        endpoint: error.config?.url,
      };

      // Handle 401 Unauthorized errors (expired or invalid cookie)
      if (errorLog.status == 401) {
        await logout();
        console.error("API Error:", errorLog);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Optional: Export a pre-configured instance
export const api = createAxiosInstance();
