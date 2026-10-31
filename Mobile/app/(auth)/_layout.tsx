import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/features/auth/store';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // If already authenticated, redirect to the main app
  if (isAuthenticated) {
    return <Redirect href="/(app)/commuter" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#059669',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Masuk', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Daftar Akun Baru' }} />
      <Stack.Screen name="otp-verify" options={{ title: 'Verifikasi Kode OTP' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Lupa Kata Sandi' }} />
      <Stack.Screen name="reset-password" options={{ title: 'Atur Ulang Sandi' }} />
    </Stack>
  );
}
