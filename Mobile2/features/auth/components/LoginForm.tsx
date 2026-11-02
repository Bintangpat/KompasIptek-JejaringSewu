import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ShieldCheck, UserCheck, Lock, Phone } from 'lucide-react-native';
import { loginSchema } from '../schemas';

interface LoginFormProps {
  onSubmit: (identifier: string, password: string) => Promise<void>;
  onDemoLogin: () => Promise<void>;
  onSwitchToRegister?: () => void;
  submitting?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onDemoLogin,
  onSwitchToRegister,
  submitting = false,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleLogin = async () => {
    setErrors({});
    const result = loginSchema.safeParse({ identifier: identifier.trim(), password });
    if (!result.success) {
      const fieldErrors: { identifier?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'identifier' | 'password';
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit(identifier.trim(), password);
    } catch (err: any) {
      Alert.alert('Gagal Masuk', err.message || 'Periksa nomor HP / kata sandi Anda.');
    }
  };

  return (
    <View className="bg-pekon-card border border-pekon-border rounded-2xl p-5 space-y-4">
      <View className="flex-row items-center mb-1">
        <ShieldCheck size={20} color="#00F2A9" />
        <Text className="text-white font-bold text-base ml-2">Masuk Akun Warga</Text>
      </View>

      <View>
        <Text className="text-slate-300 text-xs font-semibold mb-1">Nomor WhatsApp atau Email</Text>
        <View className="flex-row items-center bg-pekon-surface border border-pekon-border rounded-xl px-3 py-2.5">
          <Phone size={14} color="#84958A" />
          <TextInput
            className="flex-1 text-white text-xs ml-2"
            placeholder="08123456789 atau warga@pekon.id"
            placeholderTextColor="#84958A"
            keyboardType="email-address"
            autoCapitalize="none"
            value={identifier}
            onChangeText={setIdentifier}
          />
        </View>
        {errors.identifier && (
          <Text className="text-rose-400 text-[10px] mt-1">{errors.identifier}</Text>
        )}
      </View>

      <View className="mt-2">
        <Text className="text-slate-300 text-xs font-semibold mb-1">Kata Sandi</Text>
        <View className="flex-row items-center bg-pekon-surface border border-pekon-border rounded-xl px-3 py-2.5">
          <Lock size={14} color="#84958A" />
          <TextInput
            className="flex-1 text-white text-xs ml-2"
            placeholder="Masukkan kata sandi..."
            placeholderTextColor="#84958A"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {errors.password && (
          <Text className="text-rose-400 text-[10px] mt-1">{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity
        className="bg-pekon-primary py-3.5 rounded-xl items-center flex-row justify-center mt-3"
        onPress={handleLogin}
        disabled={submitting}
        accessible={true}
        accessibilityLabel="Tombol masuk ke akun warga"
      >
        {submitting ? (
          <ActivityIndicator color="#0F1416" size="small" />
        ) : (
          <Text className="text-pekon-bg font-bold text-sm">Masuk Sekarang</Text>
        )}
      </TouchableOpacity>

      {/* Demo Warga Quick Action */}
      <TouchableOpacity
        className="bg-pekon-surface border border-pekon-primary/40 py-2.5 rounded-xl items-center flex-row justify-center mt-1"
        onPress={onDemoLogin}
        accessible={true}
        accessibilityLabel="Masuk cepat menggunakan akun demo Pak Slamet"
      >
        <UserCheck size={14} color="#00F2A9" />
        <Text className="text-pekon-primary font-bold text-xs ml-1.5">
          Masuk Cepat Demo: Pak Slamet (Petani)
        </Text>
      </TouchableOpacity>

      {onSwitchToRegister && (
        <TouchableOpacity
          className="items-center pt-2"
          onPress={onSwitchToRegister}
        >
          <Text className="text-pekon-muted text-xs">
            Belum punya akun warga? <Text className="text-pekon-primary font-bold">Daftar Akun Baru</Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
