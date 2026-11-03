import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';

import splashAnimation from '../assets/animations/splash.json';
import { SecureStorage, STORAGE_KEYS } from '@/services/secure-storage';
import { useAuthStore } from '@/features/auth/store';

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const hasNavigated = useRef(false);
  const lottieRef = useRef<LottieView>(null);

  // Navigasi ke rute berikutnya berdasarkan status autentikasi & onboarding
  const proceedToNextScreen = async () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    try {
      const user = useAuthStore.getState().user;
      const accessToken = useAuthStore.getState().accessToken;

      // 1. Jika sudah login -> langsung ke dashboard utama
      if (user && accessToken) {
        router.replace('/(tabs)/commuter');
        return;
      }

      // 2. Cek apakah pengguna sudah pernah menyelesaikan onboarding (Information Screen)
      const onboardingCompleted = await SecureStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);

      if (onboardingCompleted === 'true') {
        // Pengguna lama namun belum login -> masuk ke halaman utama sebagai tamu
        router.replace('/(tabs)/commuter');
      } else {
        // Pengguna baru -> tampilkan 3 slide information screen
        router.replace('/information');
      }
    } catch (error) {
      console.warn('[SplashScreen] Navigasi gagal, fallback ke information screen:', error);
      router.replace('/information');
    }
  };

  // Sesuaikan warna animasi Lottie secara dinamis:
  // Mode Gelap: Background hitam (#000000), Teks putih [1, 1, 1]
  // Mode Terang: Background putih (#FFFFFF), Teks hitam [0, 0, 0]
  const themedSource = useMemo(() => {
    try {
      const cloned = JSON.parse(JSON.stringify(splashAnimation));
      const textLayer = cloned.layers?.find((l: any) => l.nm === 'Jejaring Sewu');
      const bgLayer = cloned.layers?.find((l: any) => l.nm === 'Android Compact - 1 Bg');

      if (isDark) {
        // Mode Gelap
        if (bgLayer) {
          const fillShape = bgLayer.shapes?.find((s: any) => s.ty === 'fl');
          if (fillShape) {
            fillShape.c = { a: 0, k: [0, 0, 0] };
          }
        }
        if (textLayer) {
          const fillShape = textLayer.shapes?.find((s: any) => s.ty === 'fl');
          if (fillShape && fillShape.c) {
            fillShape.c = {
              a: 1,
              k: [
                { o: { x: 0.33, y: 1 }, i: { x: 0.68, y: 1 }, s: [0, 0, 0], t: 0 },
                { s: [1, 1, 1], t: 120 },
              ],
            };
          }
        }
      } else {
        // Mode Terang
        if (bgLayer) {
          const fillShape = bgLayer.shapes?.find((s: any) => s.ty === 'fl');
          if (fillShape) {
            fillShape.c = { a: 0, k: [1, 1, 1] };
          }
        }
        if (textLayer) {
          const fillShape = textLayer.shapes?.find((s: any) => s.ty === 'fl');
          if (fillShape && fillShape.c) {
            fillShape.c = {
              a: 1,
              k: [
                { o: { x: 0.33, y: 1 }, i: { x: 0.68, y: 1 }, s: [1, 1, 1], t: 0 },
                { s: [0, 0, 0], t: 120 },
              ],
            };
          }
        }
      }
      return cloned;
    } catch {
      return splashAnimation;
    }
  }, [isDark]);

  useEffect(() => {
    // Fallback timer maksimal 2.8 detik jika animasi Lottie selesai lebih awal / tersendat
    const timeout = setTimeout(() => {
      proceedToNextScreen();
    }, 2800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={proceedToNextScreen}>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <LottieView
          ref={lottieRef}
          source={themedSource}
          autoPlay
          loop={false}
          speed={1.0}
          onAnimationFinish={proceedToNextScreen}
          style={styles.lottie}
          resizeMode="cover"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
