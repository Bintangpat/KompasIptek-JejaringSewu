import { useState, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/store';

interface ProtectedActionOptions {
  title?: string;
  description?: string;
}

export function useAuthProtection() {
  const { isAuthenticated, user } = useAuthStore();
  const [isAuthWallOpen, setIsAuthWallOpen] = useState(false);
  const [authWallProps, setAuthWallProps] = useState<{
    actionTitle?: string;
    actionDescription?: string;
  }>({});

  const protectedAction = useCallback(
    (action: () => void, options?: ProtectedActionOptions) => {
      if (isAuthenticated && user) {
        action();
      } else {
        setAuthWallProps({
          actionTitle: options?.title || 'Fitur Ini Memerlukan Akun Warga',
          actionDescription:
            options?.description ||
            'Anda perlu masuk atau mendaftar terlebih dahulu agar transaksi, rute komuter, dan reputasi Proof-of-Work Anda tercatat secara aman di buku besar pekon.',
        });
        setIsAuthWallOpen(true);
      }
    },
    [isAuthenticated, user]
  );

  return {
    isAuthenticated: Boolean(isAuthenticated && user),
    user,
    isAuthWallOpen,
    setIsAuthWallOpen,
    authWallProps,
    protectedAction,
  };
}
