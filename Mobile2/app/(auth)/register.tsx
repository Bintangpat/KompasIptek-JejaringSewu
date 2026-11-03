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
import { ShieldCheck, HeartHandshake } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { authApi } from '@/features/auth/api';
import { registerSchema } from '@/features/auth/schemas';
import { VulnerabilityStatus } from '@/types/enums';

export default function RegisterScreen() {
  const router = useRouter();

  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pekonId, setPekonId] = useState('pekon-pagelaran-01');
  const [isDisability, setIsDisability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    setErrors({});
    const formData = {
      nik: nik.trim(),
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim() || undefined,
      password,
      confirmPassword,
      pekonId,
      vulnerabilityFlags: isDisability ? [VulnerabilityStatus.DISABILITAS_FISIK] : [],
    };

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await authApi.register({
        nik: formData.nik,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        pekonId: formData.pekonId,
        vulnerabilityFlags: formData.vulnerabilityFlags,
      });

      Alert.alert(
        'Registrasi Berhasil!',
        'Akun Anda berhasil dibuat. Silakan verifikasi nomor HP Anda dengan kode OTP.',
        [
          {
            text: 'Verifikasi OTP',
            onPress: () =>
              router.push({
                pathname: '/(auth)/otp' as any,
                params: { identifier: formData.phoneNumber },
              }),
          },
        ]
      );
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal mendaftarkan akun. Silakan periksa kembali data Anda.';
      Alert.alert('Gagal Mendaftar', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="p-5 my-6"
      >
        <View className="items-center mb-6">
          <View className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 items-center justify-center mb-2">
            <ShieldCheck size={30} color="#00F2A9" />
          </View>
          <Text className="text-foreground font-black text-xl">Registrasi Warga Pekon</Text>
          <Text className="text-muted-foreground text-xs text-center mt-0.5">
            Daftarkan diri Anda untuk berpartisipasi dalam ekosistem Kompas Pekon.
          </Text>
        </View>

        <Card>
          <Card.Header>
            <Card.Title>Data Identitas KTP</Card.Title>
            <Card.Description>Data Anda dilindungi enkripsi pgcrypto & zero-trust.</Card.Description>
          </Card.Header>

          <Card.Content className="gap-3">
            <Input
              label="NIK KTP (16 Digit)"
              placeholder="1801xxxxxxxxxxxx"
              keyboardType="numeric"
              maxLength={16}
              value={nik}
              onChangeText={setNik}
              errorMessage={errors.nik}
            />

            <Input
              label="Nama Lengkap (Sesuai KTP)"
              placeholder="Contoh: Suratno Rahardjo"
              value={fullName}
              onChangeText={setFullName}
              errorMessage={errors.fullName}
            />

            <Input
              label="Nomor WhatsApp Aktif"
              placeholder="08123456789"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              errorMessage={errors.phoneNumber}
            />

            <Input
              label="Email (Opsional)"
              placeholder="nama@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              errorMessage={errors.email}
            />

            <Input
              label="Kata Sandi"
              placeholder="Minimal 8 karakter (huruf & angka)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              errorMessage={errors.password}
            />

            <Input
              label="Konfirmasi Kata Sandi"
              placeholder="Ulangi kata sandi..."
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              errorMessage={errors.confirmPassword}
            />

            {/* Zero-Discrimination Inclusivity Switch */}
            <View className="bg-popover border border-border p-3.5 rounded-2xl flex-row items-center justify-between mt-1">
              <View className="flex-1 mr-3">
                <View className="flex-row items-center">
                  <HeartHandshake size={15} color="#00F2A9" />
                  <Text className="font-bold text-xs text-foreground ml-1.5">
                    Penyandang Disabilitas
                  </Text>
                </View>
                <Text className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                  Akses prioritas tugas inklusif ramah disabilitas (Zero-Discrimination).
                </Text>
              </View>
              <Switch value={isDisability} onValueChange={setIsDisability} />
            </View>
          </Card.Content>

          <Card.Footer className="gap-2.5">
            <Button
              variant="primary"
              size="lg"
              loading={submitting}
              onPress={handleRegister}
              className="w-full"
            >
              Daftar Akun Warga
            </Button>
          </Card.Footer>
        </Card>

        <View className="items-center mt-5 mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-muted-foreground text-xs">
              Sudah memiliki akun? <Text className="text-primary font-bold">Masuk di Sini</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
