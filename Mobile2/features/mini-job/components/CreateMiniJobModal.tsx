import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, HeartHandshake } from 'lucide-react-native';

interface CreateMiniJobModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    wageAmount: number;
    isDisabilityFriendly: boolean;
  }) => Promise<void>;
  submitting: boolean;
}

export const CreateMiniJobModal: React.FC<CreateMiniJobModalProps> = ({
  visible,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobWage, setJobWage] = useState('');
  const [jobIsDisabilityFriendly, setJobIsDisabilityFriendly] = useState(true);

  const handleSubmit = async () => {
    const wage = parseFloat(jobWage);
    await onSubmit({
      title: jobTitle.trim(),
      description: jobDescription.trim(),
      wageAmount: wage,
      isDisabilityFriendly: jobIsDisabilityFriendly,
    });
    setJobTitle('');
    setJobDescription('');
    setJobWage('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black/80 justify-end"
      >
        <View className="bg-pekon-surface rounded-t-3xl border-t border-pekon-border p-5 space-y-4 max-h-[90%]">
          <View className="flex-row justify-between items-center pb-2 border-b border-pekon-border/60">
            <View>
              <Text className="text-white font-bold text-base">Buka Lowongan Kerja Mikro</Text>
              <Text className="text-pekon-muted text-xs">Berdayakan tenaga kerja warga desa dengan upah harian adil</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#84958A" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-3">
            <View>
              <Text className="text-slate-300 text-xs font-semibold mb-1">Judul Tugas / Pekerjaan</Text>
              <TextInput
                className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs"
                placeholder="Misal: Sortir Biji Kopi, Antar Kardus Bibit"
                placeholderTextColor="#84958A"
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>

            <View className="mt-2">
              <Text className="text-slate-300 text-xs font-semibold mb-1">Deskripsi & Instruksi Kerja</Text>
              <TextInput
                className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs"
                placeholder="Tuliskan detail pekerjaan, lokasi dan estimasi waktu..."
                placeholderTextColor="#84958A"
                multiline
                numberOfLines={3}
                value={jobDescription}
                onChangeText={setJobDescription}
              />
            </View>

            <View className="mt-2">
              <Text className="text-slate-300 text-xs font-semibold mb-1">Nominal Upah Tunai (Rp)</Text>
              <TextInput
                className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs"
                placeholder="Contoh: 25000"
                placeholderTextColor="#84958A"
                keyboardType="numeric"
                value={jobWage}
                onChangeText={setJobWage}
              />
            </View>

            {/* Switch Zero-Discrimination */}
            <View className="bg-pekon-card p-3 rounded-xl border border-pekon-border/70 flex-row items-center justify-between mt-3">
              <View className="flex-1 mr-3">
                <View className="flex-row items-center">
                  <HeartHandshake size={14} color="#00F2A9" />
                  <Text className="text-white text-xs font-bold ml-1.5">Ramah Disabilitas (Zero-Discrimination)</Text>
                </View>
                <Text className="text-pekon-subtle text-[10px] mt-0.5">
                  Tugas dapat diselesaikan dengan aman oleh warga difabel / lansia. Kunci tugas otomatis (auto-accept).
                </Text>
              </View>
              <Switch
                value={jobIsDisabilityFriendly}
                onValueChange={setJobIsDisabilityFriendly}
                trackColor={{ false: '#374151', true: '#00F2A9' }}
                thumbColor={jobIsDisabilityFriendly ? '#0F1416' : '#9CA3AF'}
              />
            </View>
          </ScrollView>

          <View className="flex-row gap-3 pt-2">
            <TouchableOpacity
              className="flex-1 bg-pekon-card border border-pekon-border py-3 rounded-xl items-center"
              onPress={onClose}
            >
              <Text className="text-pekon-muted font-bold text-xs">Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-pekon-primary py-3 rounded-xl items-center flex-row justify-center"
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#0F1416" />
              ) : (
                <Text className="text-pekon-bg font-bold text-xs">Pasang Lowongan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
