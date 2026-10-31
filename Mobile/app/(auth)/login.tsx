import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { loginSchema } from '../../src/features/auth/schemas';
import { useLogin } from '../../src/features/auth/hooks';
import { getErrorMessage } from '../../src/lib/error-mapping';

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleLogin = async () => {
    setErrors({});
    const validation = loginSchema.safeParse({ identifier, password });

    if (!validation.success) {
      const fieldErrors: { identifier?: string; password?: string } = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'identifier' | 'password';
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await loginMutation.mutateAsync({
        identifier: identifier.trim(),
        password,
      });
      // AuthLayout will automatically redirect to /(app)/commuter once isAuthenticated is true
    } catch (error: any) {
      const errorCode = error.response?.data?.errorCode;
      const message = error.response?.data?.message;
      Alert.alert(
        'Gagal Masuk',
        getErrorMessage(errorCode, message || 'Periksa kembali nomor HP/email dan kata sandi Anda.')
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>JEJARING-SEWU</Text>
          <Text style={styles.appSubtitle}>
            Sinergi Pekon & Ekonomi Sirkular Kabupaten Pringsewu
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Masuk ke Akun Anda</Text>

          <Input
            label="Nomor WhatsApp atau Email"
            placeholder="08123456789 atau nama@email.com"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.identifier}
          />

          <Input
            label="Kata Sandi"
            placeholder="Masukkan kata sandi..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => router.push('/(auth)/forgot-password')}
            accessibilityLabel="Lupa kata sandi? Ketuk untuk mengatur ulang"
          >
            <Text style={styles.forgotText}>Lupa kata sandi?</Text>
          </TouchableOpacity>

          <Button
            title="Masuk Sekarang"
            onPress={handleLogin}
            loading={loginMutation.isPending}
            style={styles.submitButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum memiliki akun warga?</Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            accessibilityLabel="Daftar Akun Baru"
          >
            <Text style={styles.registerLink}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  card: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
});
