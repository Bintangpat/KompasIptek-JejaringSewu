import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { X, KeyRound, AlertCircle } from 'lucide-react-native';
import { verifyOtpSchema } from '../schemas';

interface OtpVerifyModalProps {
  visible: boolean;
  identifier: string;
  onClose: () => void;
  onVerify: (otpCode: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
  submitting?: boolean;
}

export const OtpVerifyModal: React.FC<OtpVerifyModalProps> = ({
  visible,
  identifier,
  onClose,
  onVerify,
  onResendOtp,
  submitting = false,
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (visible && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [visible, countdown]);

  const handleVerify = async () => {
    setError(null);
    const result = verifyOtpSchema.safeParse({ identifier, otpCode });
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Kode OTP harus 6 digit angka');
      return;
    }

    try {
      await onVerify(otpCode);
      setOtpCode('');
    } catch (err: any) {
      setError(err.message || 'Kode OTP tidak valid atau kedaluwarsa');
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await onResendOtp();
      setCountdown(60);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim ulang kode OTP');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-pekon-surface rounded-t-3xl border-t border-pekon-border p-5 space-y-4">
          <View className="flex-row justify-between items-center pb-2 border-b border-pekon-border">
            <View>
              <Text className="text-white font-bold text-base">Verifikasi Kode OTP</Text>
              <Text className="text-pekon-muted text-xs">
                Masukkan 6 digit kode yang dikirim ke {identifier}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#84958A" />
            </TouchableOpacity>
          </View>

          <View className="items-center py-2">
            <View className="w-12 h-12 rounded-full bg-pekon-primary/10 items-center justify-center mb-3">
              <KeyRound size={24} color="#00F2A9" />
            </View>

            <TextInput
              className="bg-pekon-card border-2 border-pekon-primary rounded-2xl py-3 px-6 text-white text-2xl font-bold tracking-widest text-center w-52"
              placeholder="000000"
              placeholderTextColor="#84958A"
              keyboardType="number-pad"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
              autoFocus
            />

            {error && (
              <View className="flex-row items-center mt-2">
                <AlertCircle size={12} color="#F43F5E" />
                <Text className="text-rose-400 text-xs ml-1">{error}</Text>
              </View>
            )}

            {/* Dev Mode Simulation Hint */}
            <View className="bg-pekon-card border border-pekon-border/70 rounded-xl p-2.5 mt-3 w-full">
              <Text className="text-pekon-subtle text-[10px] text-center">
                Terintegrasi Firebase Cloud Messaging (jejaringsewu-dev). Pada mode development, kode OTP juga dapat dipantau via log FCM backend.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-pekon-primary py-3.5 rounded-xl items-center flex-row justify-center"
            onPress={handleVerify}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#0F1416" size="small" />
            ) : (
              <Text className="text-pekon-bg font-bold text-sm">Verifikasi OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center py-1"
            onPress={handleResend}
            disabled={countdown > 0}
          >
            <Text className="text-xs text-pekon-muted">
              {countdown > 0 ? (
                `Kirim ulang kode dalam ${countdown} detik`
              ) : (
                <Text className="text-pekon-primary font-bold">Kirim Ulang Kode OTP</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
