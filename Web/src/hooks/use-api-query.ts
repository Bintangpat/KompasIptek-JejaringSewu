"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api-client";

export interface UseApiQueryOptions<T> {
  enabled?: boolean;
  initialData?: T;
  fallbackData?: T;
  params?: Record<string, any>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseApiQueryResult<T> {
  data: T;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T>>;
}

export function useApiQuery<T>(
  url: string | null,
  options: UseApiQueryOptions<T> = {}
): UseApiQueryResult<T> {
  const {
    enabled = true,
    initialData,
    fallbackData,
    params,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T>((initialData ?? fallbackData) as T);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(enabled && url));
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Store params ref to prevent infinite fetch loops
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await api.get<T>(url, paramsRef.current);
      // If response is null/undefined or an empty envelope, fallback if provided
      const resolvedData = (response ?? fallbackData) as T;
      setData(resolvedData);
      onSuccess?.(resolvedData);
    } catch (err: any) {
      setIsError(true);
      setError(err);
      if (fallbackData !== undefined) {
        setData(fallbackData);
      }
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled, fallbackData, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
    setData,
  };
}
