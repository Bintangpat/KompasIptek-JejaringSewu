import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from './api';
import { useAuthStore } from './store';
import { ApiErrorResponse } from '../../types/api';
import {
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  GoogleLoginRequest,
} from './types';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: async (response) => {
      if (response?.data?.accessToken && response?.data?.user) {
        await setSession(response.data.accessToken, response.data.user);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (payload: SendOtpRequest) => authApi.sendOtp(payload),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authApi.verifyOtp(payload),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (identifier: string) => authApi.forgotPassword(identifier),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authApi.resetPassword(payload),
  });
}

export function useGoogleLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: GoogleLoginRequest) => authApi.googleLogin(payload),
    onSuccess: async (response) => {
      if (response?.data?.accessToken && response?.data?.user) {
        await setSession(response.data.accessToken, response.data.user);
      }
    },
  });
}

export function usePekonList() {
  return useQuery({
    queryKey: ['pekons'],
    queryFn: () => authApi.getPekons(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
