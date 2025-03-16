export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: unknown;
  code?: string;
}
