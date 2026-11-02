import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { X, MapPin } from 'lucide-react-native';

interface CreateOrderModalProps {
  visible: boolean;
  selectedRoute: any | null;
  currentCoords: { lat: number; lng: number } | null;
  onClose: () => void;
  onSubmit: (itemDescription: string, fuelShareCost: string) => Promise<void>;
  submitting: boolean;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  visible,
  selectedRoute,
  currentCoords,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [itemDescription, setItemDescription] = useState('');
  const [fuelShareCost, setFuelShareCost] = useState('7500');

  const handleSubmit = async () => {
    await onSubmit(itemDescription, fuelShareCost);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-pekon-surface rounded-t-3xl border-t border-pekon-border p-5 max-h-[85%]">
          <View className="flex-row justify-between items-center pb-3 border-b border-pekon-border">
            <Text className="text-white font-bold text-base">Titip Barang Searah</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#84958A" />
            </TouchableOpacity>
          </View>

          {selectedRoute && (
            <View className="bg-pekon-card border border-pekon-border rounded-xl p-3 my-3">
              <Text className="text-pekon-muted text-[10px] uppercase font-bold">Rute Kurir Komuter</Text>
              <Text className="text-white font-bold text-xs mt-0.5">
                {selectedRoute.originName} ➔ {selectedRoute.destinationName}
              </Text>
            </View>
          )}

          <ScrollView className="my-1">
            <Text className="text-pekon-muted text-xs font-semibold mb-1">Deskripsi Barang Titipan *</Text>
            <TextInput
              value={itemDescription}
              onChangeText={setItemDescription}
              placeholder="Contoh: Paket dokumen KTP pekon, atau 2 botol madu hutan"
              placeholderTextColor="#84958A"
              multiline
              numberOfLines={3}
              className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs mb-3 text-start"
            />

            <Text className="text-pekon-muted text-xs font-semibold mb-1">Patungan Bensin yang Ditawarkan (Rp) *</Text>
            <TextInput
              value={fuelShareCost}
              onChangeText={setFuelShareCost}
              placeholder="7500"
              keyboardType="numeric"
              placeholderTextColor="#84958A"
              className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs mb-3"
            />

            {/* Titik Jemput GPS Info */}
            <View className="bg-pekon-bg border border-pekon-border p-3 rounded-xl mb-3 flex-row items-center">
              <MapPin size={16} color="#00F2A9" />
              <View className="ml-2.5 flex-1">
                <Text className="text-white text-xs font-semibold">Titik Jemput Otomatis (GPS)</Text>
                <Text className="text-pekon-muted text-[10px]">
                  {currentCoords ? `Lat: ${currentCoords.lat.toFixed(4)}, Lng: ${currentCoords.lng.toFixed(4)}` : 'Mendeteksi koordinat...'}
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Kirim Permintaan Titipan Jastip"
            disabled={submitting}
            onPress={handleSubmit}
            className={`p-3.5 rounded-xl items-center ${submitting ? 'bg-pekon-border' : 'bg-pekon-primary'}`}
          >
            {submitting ? (
              <ActivityIndicator color="#0F1416" size="small" />
            ) : (
              <Text className="text-pekon-bg font-bold text-sm">Kirim Permintaan Titipan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
