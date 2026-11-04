import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyRound, CheckCircle2 } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { Text } from '@/components/ui/text';
import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ identifier?: string }>();
  const identifier = params.identifier || '08123456789';

  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerifyOtp = async (codeToVerify = otpCode) => {
    if (codeToVerify.length !== 6) {
      setError('Kode OTP harus terdiri dari 6 digit angka');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await authApi.verifyOtp({
        identifier,
        otpCode: codeToVerify,
      });

      Alert.alert(
        'Verifikasi Sukses!',
        'Nomor Anda berhasil diverifikasi. Silakan masuk menggunakan akun Anda.',
        [{ text: 'Lanjut Masuk', onPress: () => router.replace('/(auth)/login' as any) }]
      );
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Kode OTP tidak valid atau telah kedaluwarsa.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await authApi.sendOtp({
        identifier,
        purpose: 'REGISTRATION',
      });
      setCountdown(60);
      setError(null);
      Alert.alert('OTP Dikirim', 'Kode OTP baru telah dikirimkan ke nomor WhatsApp Anda.');
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim ulang kode OTP.');
    }
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
        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 items-center justify-center mb-3">
            <KeyRound size={32} color="#00F2A9" />
          </View>
          <Text className="text-foreground font-black text-2xl">Verifikasi OTP</Text>
          <Text className="text-muted-foreground text-xs text-center mt-1 px-4 leading-relaxed">
            Masukkan 6 digit kode yang dikirimkan via Notifikasi Push HP ke {identifier}. Jika notifikasi tidak muncul, periksa kotak masuk atau spam email Anda.
          </Text>
        </View>

        <Card>
          <Card.Header>
            <Card.Title>Kode Otentikasi</Card.Title>
            <Card.Description>Kode berlaku selama 5 menit.</Card.Description>
          </Card.Header>

          <Card.Content className="items-center py-2 gap-4">
            <OtpInput
              length={6}
              value={otpCode}
              onChangeText={(val) => {
                setOtpCode(val);
                if (val.length === 6) handleVerifyOtp(val);
              }}
              type="numeric"
            />

            {error && (
              <Text className="text-destructive text-xs text-center font-medium mt-1">
                {error}
              </Text>
            )}

            {/* Dev Mode Simulation Hint */}
            <View className="bg-popover border border-border p-3 rounded-xl w-full mt-2">
              <Text className="text-muted-foreground text-[11px] text-center leading-relaxed">
                <Text className="font-bold text-primary">Mode Simulasi Backend:</Text> Pada terminal
                NestJS, periksa log FCM provider atau Resend email provider untuk membaca kode OTP 6-digit.
              </Text>
            </View>
          </Card.Content>

          <Card.Footer className="gap-2.5">
            <Button
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={otpCode.length !== 6}
              onPress={() => handleVerifyOtp()}
              className="w-full"
            >
              Verifikasi Sekarang
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={countdown > 0}
              onPress={handleResendOtp}
              className="w-full"
            >
              <Text className="text-muted-foreground text-xs">
                {countdown > 0
                  ? `Kirim ulang kode dalam ${countdown} detik`
                  : 'Kirim Ulang Kode OTP'}
              </Text>
            </Button>
          </Card.Footer>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
