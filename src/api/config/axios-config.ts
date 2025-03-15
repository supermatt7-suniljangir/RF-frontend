import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from "axios";
import {ApiErrorLog, ApiErrorResponse, toastMap} from "../types/api-types";
import {logout} from "@/features/auth/logout";
import {toast} from "@/hooks/use-toast";


export const createAxiosInstance = (headers = {}): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        withCredentials: true, // Important: This enables sending cookies in cross-origin requests
        headers: headers, // Pass custom headers if any
    });

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

    instance.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => response,
        async (error: AxiosError<ApiErrorResponse>): Promise<never> => {
            const errorLog: ApiErrorLog = {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                endpoint: error.config?.url,
            };

            if (errorLog.status === 401) {
                toast({
                    variant: "destructive",
                    description: toastMap[error.response?.data?.code] || "An unexpected error occurred.",
                })
                await logout();
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

// Optional: Export a pre-configured instance
export const api = createAxiosInstance();
