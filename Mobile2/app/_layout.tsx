import '../global.css';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
  Geist_900Black,
} from '@expo-google-fonts/geist';
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
  GeistMono_700Bold,
} from '@expo-google-fonts/geist-mono';

import { PanelUIProvider } from '@/components/ui/panel-ui-provider';
import { AuthProvider } from '@/context/AuthContext';
import { useAuthStore } from '@/features/auth/store';

// Mencegah splash screen menghilang otomatis sebelum sesi dan font siap dimuat
SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  // Load font kustom Geist dan GeistMono secara eksplisit untuk Android & iOS
  const [fontsLoaded, fontError] = useFonts({
    'Geist': Geist_400Regular,
    'Geist-Regular': Geist_400Regular,
    'Geist-Medium': Geist_500Medium,
    'Geist-SemiBold': Geist_600SemiBold,
    'Geist-Bold': Geist_700Bold,
    'Geist-ExtraBold': Geist_800ExtraBold,
    'Geist-Black': Geist_900Black,
    'GeistMono': GeistMono_400Regular,
    'GeistMono-Regular': GeistMono_400Regular,
    'GeistMono-Medium': GeistMono_500Medium,
    'GeistMono-SemiBold': GeistMono_600SemiBold,
    'GeistMono-Bold': GeistMono_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await restoreSession();
      } catch (e) {
        console.warn('Gagal memulihkan sesi:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && appIsReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, appIsReady]);

  if (!appIsReady || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <PanelUIProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0F1416' },
            headerTintColor: '#DFE2EB',
            contentStyle: { backgroundColor: '#0F1416' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="information" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </PanelUIProvider>
  );
}
