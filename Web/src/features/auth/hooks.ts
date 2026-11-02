"use client";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { authApi } from "./api";
import {
  LoginPayload,
  RegisterPayload,
  OtpSendPayload,
  OtpVerifyPayload,
  OtpResponseResult,
  AuthSuccessResult,
} from "./types";
import { useAuth } from "@/context/auth-context";

export function useAuthActions() {
  const { refreshProfile, switchRole } = useAuth();

  const loginMutation = useApiMutation<AuthSuccessResult, LoginPayload>(
    (vars) => authApi.login(vars),
    {
      successMessage: "Autentikasi berhasil. Selamat datang kembali!",
      onSuccess: async (data) => {
        if (data?.user?.role) {
          switchRole(data.user.role);
        }
        await refreshProfile();
      },
    }
  );

  const registerMutation = useApiMutation<AuthSuccessResult, RegisterPayload>(
    (vars) => authApi.register(vars),
    {
      successMessage: "Registrasi identitas warga berhasil terdaftar di pekon.",
      onSuccess: async (data) => {
        if (data?.user?.role) {
          switchRole(data.user.role);
        }
        await refreshProfile();
      },
    }
  );

  const sendOtpMutation = useApiMutation<OtpResponseResult, OtpSendPayload>(
    (vars) => authApi.sendOtp(vars),
    {
      successMessage: "Kode OTP 6-digit telah dikirimkan via FCM/WhatsApp.",
    }
  );

  const verifyOtpMutation = useApiMutation<OtpResponseResult, OtpVerifyPayload>(
    (vars) => authApi.verifyOtp(vars),
    {
      successMessage: "Verifikasi kode OTP berhasil.",
    }
  );

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isLoading,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isLoading,
    sendOtp: sendOtpMutation.mutate,
    isSendingOtp: sendOtpMutation.isLoading,
    verifyOtp: verifyOtpMutation.mutate,
    isVerifyingOtp: verifyOtpMutation.isLoading,
  };
}
