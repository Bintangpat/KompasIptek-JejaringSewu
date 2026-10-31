import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { resetPasswordSchema } from '../../src/features/auth/schemas';
import { useResetPassword } from '../../src/features/auth/hooks';
import { getErrorMessage } from '../../src/lib/error-mapping';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ identifier?: string; otpCode?: string }>();
  const identifier = params.identifier || '';
  const initialOtp = params.otpCode || '';

  const resetPasswordMutation = useResetPassword();

  const [otpCode, setOtpCode] = useState(initialOtp);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleReset = async () => {
    setErrors({});
    const validation = resetPasswordSchema.safeParse({
      identifier,
      otpCode: otpCode.trim(),
      newPassword,
      confirmNewPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        identifier,
        otpCode: otpCode.trim(),
        newPassword,
      });

      Alert.alert(
        'Kata Sandi Diperbarui',
        'Kata sandi Anda berhasil diubah. Silakan masuk kembali dengan kata sandi baru.',
        [
          {
            text: 'Masuk',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (err: any) {
      const errorCode = err.response?.data?.errorCode;
      const message = err.response?.data?.message;
      Alert.alert('Gagal', getErrorMessage(errorCode, message || 'Gagal mengubah kata sandi.'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.title}>Buat Kata Sandi Baru</Text>
          <Text style={styles.subtitle}>
            Akun: <Text style={styles.identifierText}>{identifier}</Text>
          </Text>

          <Input
            label="Kode OTP"
            placeholder="6 digit OTP"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
            error={errors.otpCode}
          />

          <Input
            label="Kata Sandi Baru"
            placeholder="Minimal 8 karakter (huruf besar, kecil, angka)"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            error={errors.newPassword}
          />

          <Input
            label="Konfirmasi Kata Sandi Baru"
            placeholder="Ulangi kata sandi baru..."
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
            error={errors.confirmNewPassword}
          />

          <Button
            title="Simpan Kata Sandi"
            onPress={handleReset}
            loading={resetPasswordMutation.isPending}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 20,
  },
  identifierText: {
    fontWeight: '700',
    color: '#059669',
  },
  submitButton: {
    marginTop: 8,
  },
});
