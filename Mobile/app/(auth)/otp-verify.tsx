import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { verifyOtpSchema } from '../../src/features/auth/schemas';
import { useVerifyOtp, useSendOtp } from '../../src/features/auth/hooks';
import { getErrorMessage } from '../../src/lib/error-mapping';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ identifier?: string; purpose?: string }>();
  const identifier = params.identifier || '';
  const purpose = (params.purpose as 'REGISTRATION' | 'FORGOT_PASSWORD' | 'VERIFY_ACTION') || 'REGISTRATION';

  const verifyOtpMutation = useVerifyOtp();
  const sendOtpMutation = useSendOtp();

  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    setError(undefined);

    const validation = verifyOtpSchema.safeParse({ identifier, otpCode: otpCode.trim() });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message);
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({
        identifier,
        otpCode: otpCode.trim(),
      });

      if (purpose === 'FORGOT_PASSWORD') {
        router.push({
          pathname: '/(auth)/reset-password',
          params: { identifier, otpCode: otpCode.trim() },
        });
      } else {
        Alert.alert(
          'Verifikasi Berhasil',
          'Akun Anda telah terverifikasi. Silakan masuk dengan kata sandi Anda.',
          [
            {
              text: 'Masuk Sekarang',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
      }
    } catch (err: any) {
      const errorCode = err.response?.data?.errorCode;
      const message = err.response?.data?.message;
      setError(getErrorMessage(errorCode, message || 'Kode OTP salah atau telah kadaluarsa.'));
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await sendOtpMutation.mutateAsync({
        identifier,
        purpose,
      });
      setCountdown(60);
      Alert.alert('Kode Baru Terkirim', 'Kode OTP baru telah dikirimkan ke WhatsApp/SMS Anda.');
    } catch (err: any) {
      Alert.alert('Gagal Mengirim OTP', 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.title}>Masukkan 6-Digit Kode OTP</Text>
          <Text style={styles.subtitle}>
            Kode verifikasi telah dikirimkan ke nomor WhatsApp/Email:{'\n'}
            <Text style={styles.identifierText}>{identifier}</Text>
          </Text>

          <Input
            label="Kode OTP"
            placeholder="Contoh: 123456"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
            error={error}
            inputStyle={styles.otpInput}
            accessibilityLabel="Masukkan 6 digit kode OTP"
          />

          <Button
            title="Verifikasi Kode"
            onPress={handleVerify}
            loading={verifyOtpMutation.isPending}
            style={styles.submitButton}
          />

          <View style={styles.resendContainer}>
            {countdown > 0 ? (
              <Text style={styles.countdownText}>
                Kirim ulang kode dalam <Text style={styles.timer}>{countdown} detik</Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={sendOtpMutation.isPending}
                accessibilityLabel="Kirim ulang kode OTP"
              >
                <Text style={styles.resendLink}>Kirim Ulang Kode OTP</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  identifierText: {
    fontWeight: '700',
    color: '#059669',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  countdownText: {
    fontSize: 13,
    color: '#6b7280',
  },
  timer: {
    fontWeight: '700',
    color: '#059669',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
});
