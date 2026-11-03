import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, UserCheck, Phone, Lock, Compass } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';
import { loginSchema } from '@/features/auth/schemas';

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleLogin = async (idVal = identifier, pwdVal = password) => {
    setErrors({});
    const validation = loginSchema.safeParse({
      identifier: idVal.trim(),
      password: pwdVal,
    });

    if (!validation.success) {
      const fieldErrors: { identifier?: string; password?: string } = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'identifier' | 'password';
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await authApi.login({
        identifier: idVal.trim(),
        password: pwdVal,
      });

      if (response && response.accessToken) {
        const { accessToken, user, refreshToken } = response;
        await setSession(accessToken, user, refreshToken);
        Alert.alert('Berhasil Masuk', `Selamat datang kembali, ${user.fullName}!`, [
          { text: 'Lanjut ke Aplikasi', onPress: () => router.replace('/(tabs)/commuter') },
        ]);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Periksa kembali nomor WhatsApp atau kata sandi Anda.';
      Alert.alert('Gagal Masuk', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIdentifier('081234567894');
    setPassword('WargaSlamet123!');
    await handleLogin('081234567894', 'WargaSlamet123!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        className="p-5"
      >
        {/* Header Branding */}
        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 items-center justify-center mb-3">
            <ShieldCheck size={36} color="#00F2A9" />
          </View>
          <Text className="text-foreground font-black text-2xl tracking-wide">
            JEJARING-SEWU
          </Text>
          <Text className="text-muted-foreground text-xs text-center mt-1 px-4 leading-relaxed">
            Platform Logistik & Ekonomi Kerakyatan Pekon Kabupaten Pringsewu
          </Text>
        </View>

        {/* Card Form */}
        <Card>
          <Card.Header>
            <Card.Title>Masuk ke Akun Anda</Card.Title>
            <Card.Description>
              Akses rute komuter pekon, bursa hasil bumi, dan skor kredit BUMDes.
            </Card.Description>
          </Card.Header>

          <Card.Content className="gap-3">
            <Input
              label="Nomor WhatsApp atau Email"
              placeholder="08123456789 atau nama@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={identifier}
              onChangeText={setIdentifier}
              errorMessage={errors.identifier}
            />

            <Input
              label="Kata Sandi"
              placeholder="Masukkan kata sandi..."
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              errorMessage={errors.password}
            />
          </Card.Content>

          <Card.Footer className="gap-2.5">
            <Button
              variant="primary"
              size="lg"
              loading={submitting}
              onPress={() => handleLogin()}
              className="w-full"
            >
              Masuk Sekarang
            </Button>

            {/* Quick Demo Login */}
            <Button
              variant="outline"
              size="md"
              onPress={handleDemoLogin}
              className="w-full flex-row items-center justify-center"
            >
              <UserCheck size={15} color="#00F2A9" />
              <Text className="text-primary font-bold text-xs ml-1.5">
                Masuk Cepat Demo: Pak Slamet (Petani)
              </Text>
            </Button>

            {/* Guest Browsing */}
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.replace('/(tabs)/commuter')}
              className="w-full flex-row items-center justify-center mt-1"
            >
              <Compass size={14} color="#84958A" />
              <Text className="text-muted-foreground text-xs ml-1.5">
                Jelajahi Dulu Tanpa Masuk (Mode Tamu)
              </Text>
            </Button>
          </Card.Footer>
        </Card>

        {/* Footer Link */}
        <View className="items-center mt-6">
          <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
            <Text className="text-muted-foreground text-xs">
              Belum punya akun warga?{' '}
              <Text className="text-primary font-bold">Daftar Akun Baru</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
