
  
  export interface ApiError {
    message: string;
    code?: string;
    status?: number;
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
