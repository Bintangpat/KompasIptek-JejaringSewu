"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export interface UseApiMutationOptions<TData, TVariables> {
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: Error) => string);
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables) => void;
  showToast?: boolean;
}

export function useApiMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiMutationOptions<TData, TVariables> = {}
) {
  const {
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    showToast = true,
  } = options;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: TVariables): Promise<TData> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      setData(result);

      if (showToast) {
        const msg =
          typeof successMessage === "function"
            ? successMessage(result)
            : successMessage || (result as any)?.message || "Aksi berhasil diproses.";
        toast.success(msg);
      }

      if (onSuccess) {
        await onSuccess(result, variables);
      }

      return result;
    } catch (err: any) {
      setError(err);

      if (showToast) {
        const msg =
          typeof errorMessage === "function"
            ? errorMessage(err)
            : errorMessage || err.message || "Gagal memproses permintaan.";
        toast.error(msg);
      }

      if (onError) {
        onError(err, variables);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    data,
    error,
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    },
  };
}
