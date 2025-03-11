export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export interface ApiResponse<T = any> {
    data: T | null;
    error?: string;
    status: number;
    success: boolean;
    networkError?: boolean;
}

export interface RequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
    timeout?: number;
}

// API error response type
export interface ApiErrorResponse {
    message: string;
    code?: string;
    statusCode?: number;
}

// Type for the error logging structure
export interface ApiErrorLog {
    status?: number;
    message: string;
    endpoint?: string;
}

// Backend error response type
export interface BackendErrorResponse {
    message?: string;
    error?: string;
    statusCode?: number;
}

export const toastMap: Record<string, string> = {
    AUTH_REQUIRED: "Please log in to access this feature.",
    TOKEN_EXPIRED: "Your session has expired. Please log in again.",
    INVALID_TOKEN: "Invalid session. Please log in again.",
    TOKEN_NOT_ACTIVE: "Session not active yet. Please try again later.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
};
