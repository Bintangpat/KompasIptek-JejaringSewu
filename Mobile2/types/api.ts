export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  path?: string;
}

export interface ApiErrorResponse {
  success: false;
  errorCode: string;
  message: string;
  timestamp: string;
  path: string;
}
