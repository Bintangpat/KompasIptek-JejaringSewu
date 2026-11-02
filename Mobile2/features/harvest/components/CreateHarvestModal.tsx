import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';

interface CreateHarvestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    commodityName: string;
    estimatedKg: number;
    minPricePerKg: number;
  }) => Promise<void>;
  submitting: boolean;
}

export const CreateHarvestModal: React.FC<CreateHarvestModalProps> = ({
  visible,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [commodityName, setCommodityName] = useState('');
  const [estimatedKg, setEstimatedKg] = useState('');
  const [minPricePerKg, setMinPricePerKg] = useState('');

  const handleSubmit = async () => {
    const kg = parseFloat(estimatedKg);
    const minPrice = parseFloat(minPricePerKg);
    await onSubmit({
      commodityName: commodityName.trim(),
      estimatedKg: kg,
      minPricePerKg: minPrice,
    });
    setCommodityName('');
    setEstimatedKg('');
    setMinPricePerKg('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black/80 justify-end"
      >
        <View className="bg-pekon-surface rounded-t-3xl border-t border-pekon-border p-5 space-y-4">
          <View className="flex-row justify-between items-center pb-2 border-b border-pekon-border/60">
            <View>
              <Text className="text-white font-bold text-base">Posting Hasil Panen Baru</Text>
              <Text className="text-pekon-muted text-xs">Buka lelang hasil bumi ke jaringan pengepul jujur pekon</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#84958A" />
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            <View>
              <Text className="text-slate-300 text-xs font-semibold mb-1">Nama Komoditas Panen</Text>
              <TextInput
                className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs"
                placeholder="Misal: Singkong Mukibat, Kakao Fermentasi, Ikan Nila"
                placeholderTextColor="#84958A"
                value={commodityName}
                onChangeText={setCommodityName}
              />
            </View>

            <View>
              <Text className="text-slate-300 text-xs font-semibold mb-1">Estimasi Berat Panen (Kg)</Text>
              <TextInput
                className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs"
                placeholder="Contoh: 1500"
                placeholderTextColor="#84958A"
                keyboardType="numeric"
                value={estimatedKg}
                onChangeText={setEstimatedKg}
              />
            </View>

            <View>
              <Text className="text-slate-300 text-xs font-semibold mb-1">Batas Minimal Harga Jual (Rp/Kg)</Text>
              <TextInput
                className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs"
                placeholder="Contoh: 2500"
                placeholderTextColor="#84958A"
                keyboardType="numeric"
                value={minPricePerKg}
                onChangeText={setMinPricePerKg}
              />
            </View>
          </View>

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
                <Text className="text-pekon-bg font-bold text-xs">Posting ke Bursa</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
