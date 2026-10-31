import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { forgotPasswordSchema } from '../../src/features/auth/schemas';
import { useForgotPassword } from '../../src/features/auth/hooks';
import { getErrorMessage } from '../../src/lib/error-mapping';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();

  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async () => {
    setError(undefined);
    const validation = forgotPasswordSchema.safeParse({ identifier: identifier.trim() });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message);
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync(identifier.trim());
      Alert.alert(
        'Kode OTP Terkirim',
        'Kode verifikasi untuk mereset kata sandi telah dikirimkan ke nomor WhatsApp/email Anda.',
        [
          {
            text: 'Masukkan OTP',
            onPress: () => {
              router.push({
                pathname: '/(auth)/otp-verify',
                params: {
                  identifier: identifier.trim(),
                  purpose: 'FORGOT_PASSWORD',
                },
              });
            },
          },
        ]
      );
    } catch (err: any) {
      const errorCode = err.response?.data?.errorCode;
      const message = err.response?.data?.message;
      setError(getErrorMessage(errorCode, message || 'Akun tidak ditemukan atau terjadi kesalahan.'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.title}>Atur Ulang Kata Sandi</Text>
          <Text style={styles.subtitle}>
            Masukkan nomor WhatsApp atau email yang terdaftar untuk menerima kode verifikasi OTP.
          </Text>

          <Input
            label="Nomor WhatsApp atau Email"
            placeholder="08123456789 atau nama@email.com"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <Button
            title="Kirim Kode OTP"
            onPress={handleSubmit}
            loading={forgotPasswordMutation.isPending}
            style={styles.submitButton}
          />
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
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 20,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 8,
  },
});
