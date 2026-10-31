export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  timestamp?: string;
  path?: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  errorCode: string;
  message: string;
  timestamp?: string;
  path?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
}
