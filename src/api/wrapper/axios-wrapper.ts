import { AxiosInstance, AxiosError } from 'axios';
import { createAxiosInstance } from '../config/axios-config';
import { ApiErrorResponse } from '../types/api-types';

export interface ApiResponse<T = any> {
  data: T | null;
  error?: string;
  status: number;
}

export class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = createAxiosInstance();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private handleResponse<T>(response: any): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
    };
  }

  private handleError(error: AxiosError<ApiErrorResponse>): ApiResponse {
    const errorMessage = error.response?.data?.message || error.message;
    const status = error.response?.status || 500;
    
    switch (status) {
      case 401:
        return {
          data: null,
          error: 'Authentication required. Please log in.',
          status
        };
      
      case 403:
        return {
          data: null,
          error: 'You do not have permission to perform this action.',
          status
        };
        
      case 404:
        return {
          data: null,
          error: 'The requested resource was not found.',
          status
        };
        
      default:
        return {
          data: null,
          error: errorMessage || 'An unexpected error occurred',
          status
        };
    }
  }

  // Standard CRUD operations
  public async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get(url);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post(url, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put(url, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(url);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  // Auth-specific methods
  public async login<T>(credentials: { email: string; password: string }): Promise<ApiResponse<T>> {
    return this.post<T>('/auth/login', credentials);
  }

  public async logout(): Promise<ApiResponse<void>> {
    return this.post('/auth/logout');
  }

  public async refreshToken(): Promise<ApiResponse<void>> {
    return this.post('/auth/refresh');
  }

  public async checkAuthStatus(): Promise<ApiResponse<{ isAuthenticated: boolean }>> {
    return this.get('/auth/status');
  }
}

export default ApiService;