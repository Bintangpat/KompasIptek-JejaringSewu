import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { ShieldCheck, User, Phone, Lock, HeartHandshake } from 'lucide-react-native';
import { registerSchema } from '../schemas';
import { VulnerabilityStatus } from '@/types/enums';

interface RegisterFormProps {
  onSubmit: (data: {
    nik: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
    password: string;
    confirmPassword: string;
    pekonId: string;
    vulnerabilityFlags?: VulnerabilityStatus[];
  }) => Promise<void>;
  onSwitchToLogin?: () => void;
  submitting?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  submitting = false,
}) => {
  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pekonId, setPekonId] = useState('pekon-pagelaran-01');
  const [isDisability, setIsDisability] = useState(false);
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

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      Alert.alert('Gagal Mendaftar', err.message || 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <ScrollView className="bg-pekon-card border border-pekon-border rounded-2xl p-5 space-y-3">
      <View className="flex-row items-center mb-1">
        <ShieldCheck size={20} color="#00F2A9" />
        <Text className="text-white font-bold text-base ml-2">Registrasi Warga Pekon</Text>
      </View>

      <View>
        <Text className="text-slate-300 text-xs font-semibold mb-1">NIK KTP (16 Digit) *</Text>
        <TextInput
          className="bg-pekon-surface border border-pekon-border rounded-xl p-2.5 text-white text-xs"
          placeholder="1801xxxxxxxxxxxx"
          placeholderTextColor="#84958A"
          keyboardType="numeric"
          maxLength={16}
          value={nik}
          onChangeText={setNik}
        />
        {errors.nik && <Text className="text-rose-400 text-[10px] mt-1">{errors.nik}</Text>}
      </View>

      <View className="mt-1">
        <Text className="text-slate-300 text-xs font-semibold mb-1">Nama Lengkap (Sesuai KTP) *</Text>
        <TextInput
          className="bg-pekon-surface border border-pekon-border rounded-xl p-2.5 text-white text-xs"
          placeholder="Contoh: Suratno Rahardjo"
          placeholderTextColor="#84958A"
          value={fullName}
          onChangeText={setFullName}
        />
        {errors.fullName && <Text className="text-rose-400 text-[10px] mt-1">{errors.fullName}</Text>}
      </View>

      <View className="mt-1">
        <Text className="text-slate-300 text-xs font-semibold mb-1">Nomor WhatsApp Aktif *</Text>
        <TextInput
          className="bg-pekon-surface border border-pekon-border rounded-xl p-2.5 text-white text-xs"
          placeholder="08123456789"
          placeholderTextColor="#84958A"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        {errors.phoneNumber && <Text className="text-rose-400 text-[10px] mt-1">{errors.phoneNumber}</Text>}
      </View>

      <View className="mt-1">
        <Text className="text-slate-300 text-xs font-semibold mb-1">Kata Sandi *</Text>
        <TextInput
          className="bg-pekon-surface border border-pekon-border rounded-xl p-2.5 text-white text-xs"
          placeholder="Minimal 8 karakter (huruf & angka)"
          placeholderTextColor="#84958A"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text className="text-rose-400 text-[10px] mt-1">{errors.password}</Text>}
      </View>

      <View className="mt-1">
        <Text className="text-slate-300 text-xs font-semibold mb-1">Konfirmasi Kata Sandi *</Text>
        <TextInput
          className="bg-pekon-surface border border-pekon-border rounded-xl p-2.5 text-white text-xs"
          placeholder="Ulangi kata sandi..."
          placeholderTextColor="#84958A"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {errors.confirmPassword && (
          <Text className="text-rose-400 text-[10px] mt-1">{errors.confirmPassword}</Text>
        )}
      </View>

      {/* Disabilitas Switch */}
      <View className="bg-pekon-surface p-3 rounded-xl border border-pekon-border flex-row items-center justify-between mt-2">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center">
            <HeartHandshake size={14} color="#00F2A9" />
            <Text className="text-white text-xs font-bold ml-1.5">Penyandang Disabilitas</Text>
          </View>
          <Text className="text-pekon-subtle text-[10px] mt-0.5">
            Mendapatkan akses prioritas ke tugas inklusif ramah disabilitas (Zero-Discrimination).
          </Text>
        </View>
        <Switch
          value={isDisability}
          onValueChange={setIsDisability}
          trackColor={{ false: '#374151', true: '#00F2A9' }}
          thumbColor={isDisability ? '#0F1416' : '#9CA3AF'}
        />
      </View>

      <TouchableOpacity
        className="bg-pekon-primary py-3.5 rounded-xl items-center flex-row justify-center mt-3"
        onPress={handleRegister}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#0F1416" size="small" />
        ) : (
          <Text className="text-pekon-bg font-bold text-sm">Daftar Akun Warga</Text>
        )}
      </TouchableOpacity>

      {onSwitchToLogin && (
        <TouchableOpacity className="items-center pt-2" onPress={onSwitchToLogin}>
          <Text className="text-pekon-muted text-xs">
            Sudah memiliki akun? <Text className="text-pekon-primary font-bold">Masuk di Sini</Text>
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
