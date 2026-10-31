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
import { PekonPicker } from '../../src/components/ui/PekonPicker';
import { VulnerabilityPicker } from '../../src/components/ui/VulnerabilityPicker';
import { registerSchema } from '../../src/features/auth/schemas';
import { useRegister, useSendOtp, usePekonList } from '../../src/features/auth/hooks';
import { VulnerabilityStatus } from '../../src/types/enums';
import { Pekon } from '../../src/types/entities';
import { getErrorMessage } from '../../src/lib/error-mapping';

export default function RegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegister();
  const sendOtpMutation = useSendOtp();
  const { data: pekonResponse } = usePekonList();

  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPekon, setSelectedPekon] = useState<Pekon | null>(null);
  const [vulnerabilityFlags, setVulnerabilityFlags] = useState<VulnerabilityStatus[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    setErrors({});

    const formData = {
      nik: nik.trim(),
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim() ? email.trim() : undefined,
      password,
      confirmPassword,
      pekonId: selectedPekon?.id || '',
      vulnerabilityFlags: vulnerabilityFlags.length > 0 ? vulnerabilityFlags : undefined,
    };

    console.log('[Register Screen] Validating form data...', {
      ...formData,
      password: '***',
      confirmPassword: '***',
    });

    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      let firstErrorMessage = '';
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
        if (!firstErrorMessage) firstErrorMessage = issue.message;
      });
      setErrors(fieldErrors);

      console.warn('[Register Screen] Validation failed:', fieldErrors);
      Alert.alert(
        'Periksa Isian Formulir',
        firstErrorMessage || 'Pastikan semua kolom wajib telah diisi dengan benar.'
      );
      return;
    }

    try {
      console.log('[Register Screen] Sending request to backend...');
      const result = await registerMutation.mutateAsync({
        nik: formData.nik,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        pekonId: formData.pekonId,
        vulnerabilityFlags: formData.vulnerabilityFlags,
      });

      console.log('[Register Screen] Registration successful:', result);

      // Send OTP for confirmation
      try {
        await sendOtpMutation.mutateAsync({
          identifier: formData.phoneNumber,
          purpose: 'REGISTRATION',
        });
      } catch (otpErr) {
        console.warn('Auto send OTP note:', otpErr);
      }

      Alert.alert(
        'Pendaftaran Berhasil',
        'Akun Anda berhasil didaftarkan. Silakan masukkan kode verifikasi OTP yang dikirimkan.',
        [
          {
            text: 'Lanjutkan',
            onPress: () => {
              router.push({
                pathname: '/(auth)/otp-verify',
                params: {
                  identifier: formData.phoneNumber,
                  purpose: 'REGISTRATION',
                },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('[Register Screen Error]', error);
      const errorCode = error.response?.data?.errorCode;
      const message = error.response?.data?.message;
      const networkOrStatus = error.message || 'Koneksi ke server gagal.';
      Alert.alert(
        'Pendaftaran Gagal',
        getErrorMessage(errorCode, message || `${networkOrStatus} Periksa jaringan backend.`)
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
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Identitas Kependudukan</Text>

          <Input
            label="Nomor Induk Kependudukan (NIK)"
            placeholder="16 digit NIK sesuai KTP"
            value={nik}
            onChangeText={setNik}
            keyboardType="number-pad"
            maxLength={16}
            error={errors.nik}
            helperText="NIK disimpan secara terenkripsi (AES-256) untuk verifikasi Pekon"
          />

          <Input
            label="Nama Lengkap Sesuai KTP"
            placeholder="Contoh: Budi Santoso"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            error={errors.fullName}
          />

          <PekonPicker
            selectedPekonId={selectedPekon?.id}
            onSelect={setSelectedPekon}
            error={errors.pekonId}
            pekons={pekonResponse?.data}
          />

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Kontak & Keamanan Akun</Text>

          <Input
            label="Nomor WhatsApp"
            placeholder="08123456789"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            helperText="Format: 08xxxxxxxxxx (10-13 digit)"
          />

          <Input
            label="Alamat Email (Opsional)"
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Kata Sandi"
            placeholder="Minimal 8 karakter (huruf besar, kecil, angka)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            helperText="Wajib mengandung kombinasi huruf besar, kecil, dan angka"
          />

          <Input
            label="Konfirmasi Kata Sandi"
            placeholder="Ulangi kata sandi Anda..."
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <VulnerabilityPicker
            selectedFlags={vulnerabilityFlags}
            onChange={setVulnerabilityFlags}
          />

          <Button
            title="Daftar Sekarang"
            onPress={handleRegister}
            loading={registerMutation.isPending || sendOtpMutation.isPending}
            style={styles.submitButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Sudah memiliki akun?</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Kembali ke halaman masuk"
          >
            <Text style={styles.loginLink}>Masuk di Sini</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 14,
  },
  submitButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
});
