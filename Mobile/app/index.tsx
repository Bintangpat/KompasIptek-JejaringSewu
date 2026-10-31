import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/features/auth/store';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(app)/commuter" />;
  }

  return <Redirect href="/(auth)/login" />;
}
