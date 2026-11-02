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
import { X, ShieldCheck } from 'lucide-react-native';

const PRESET_LOCATIONS = [
  { name: 'Pekon Pagelaran', lat: -5.3421, lng: 104.9452 },
  { name: 'Pekon Sukoharjo', lat: -5.3051, lng: 104.9921 },
  { name: 'Pekon Gadingrejo', lat: -5.3789, lng: 105.0312 },
  { name: 'Pekon Banyumas', lat: -5.2891, lng: 104.9123 },
  { name: 'Pekon Pardasuka', lat: -5.4215, lng: 104.9782 },
  { name: 'Pekon Ambarawa', lat: -5.3621, lng: 104.9812 },
  { name: 'Pasar Induk Pringsewu', lat: -5.3582, lng: 104.9744 },
  { name: 'RSUD Pringsewu', lat: -5.3712, lng: 104.9651 },
  { name: 'Terminal Pringsewu', lat: -5.3521, lng: 104.9811 },
  { name: 'Komplek Pemkab Pringsewu', lat: -5.3601, lng: 104.9902 },
];

interface CreateRouteModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    originName: string;
    destinationName: string;
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    vehicleType: string;
  }) => Promise<void>;
  submitting: boolean;
}

export const CreateRouteModal: React.FC<CreateRouteModalProps> = ({
  visible,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [originLat, setOriginLat] = useState<number>(-5.3421);
  const [originLng, setOriginLng] = useState<number>(104.9452);
  const [destLat, setDestLat] = useState<number>(-5.3582);
  const [destLng, setDestLng] = useState<number>(104.9744);
  const [vehicleType, setVehicleType] = useState('Motor (Bagasi Sedang)');

  const handleSubmit = async () => {
    await onSubmit({
      originName,
      destinationName,
      originLat,
      originLng,
      destLat,
      destLng,
      vehicleType,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-pekon-surface rounded-t-3xl border-t border-pekon-border p-5 max-h-[90%]">
          <View className="flex-row justify-between items-center pb-3 border-b border-pekon-border">
            <Text className="text-white font-bold text-base">Buka Rute Perjalanan Komuter</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#84958A" />
            </TouchableOpacity>
          </View>

          <ScrollView className="my-3">
            {/* Asal Perjalanan */}
            <Text className="text-pekon-muted text-xs font-semibold mb-1">Pekon Asal Perjalanan *</Text>
            <TextInput
              value={originName}
              onChangeText={setOriginName}
              placeholder="Contoh: Pekon Pagelaran Utara"
              placeholderTextColor="#84958A"
              className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs mb-2"
            />

            {/* Preset Quick Select Asal */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              {PRESET_LOCATIONS.slice(0, 5).map((loc) => (
                <TouchableOpacity
                  key={loc.name}
                  onPress={() => {
                    setOriginName(loc.name);
                    setOriginLat(loc.lat);
                    setOriginLng(loc.lng);
                  }}
                  className="mr-1.5 bg-pekon-card border border-pekon-border px-2.5 py-1 rounded-full"
                >
                  <Text className="text-pekon-muted text-[10px]">{loc.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tujuan Perjalanan */}
            <Text className="text-pekon-muted text-xs font-semibold mb-1">Tujuan Perjalanan (Pasar/Kota) *</Text>
            <TextInput
              value={destinationName}
              onChangeText={setDestinationName}
              placeholder="Contoh: Pasar Induk Pringsewu"
              placeholderTextColor="#84958A"
              className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs mb-2"
            />

            {/* Preset Quick Select Tujuan */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              {PRESET_LOCATIONS.slice(5).map((loc) => (
                <TouchableOpacity
                  key={loc.name}
                  onPress={() => {
                    setDestinationName(loc.name);
                    setDestLat(loc.lat);
                    setDestLng(loc.lng);
                  }}
                  className="mr-1.5 bg-pekon-card border border-pekon-border px-2.5 py-1 rounded-full"
                >
                  <Text className="text-pekon-muted text-[10px]">{loc.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Jenis Kendaraan / Bagasi */}
            <Text className="text-pekon-muted text-xs font-semibold mb-1">Kapasitas Bagasi Kendaraan</Text>
            <View className="flex-row space-x-2 mb-4">
              {['Motor (Kardus Sedang)', 'Mobil (Bagasi Luas)'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setVehicleType(type)}
                  className={`flex-1 p-2.5 rounded-xl border items-center ${vehicleType === type ? 'bg-pekon-primary/10 border-pekon-primary' : 'bg-pekon-card border-pekon-border'}`}
                >
                  <Text className={`text-xs font-bold ${vehicleType === type ? 'text-pekon-primary' : 'text-pekon-muted'}`}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl mb-3 flex-row items-center">
              <ShieldCheck size={18} color="#34D399" />
              <Text className="text-emerald-300 text-[11px] ml-2 flex-1">
                Rute Anda akan diverifikasi geospasial via GPS dan terdaftar di Bursa Komuter Pekon.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Mulai dan Buka Rute Perjalanan"
            disabled={submitting}
            onPress={handleSubmit}
            className={`p-3.5 rounded-xl items-center ${submitting ? 'bg-pekon-border' : 'bg-pekon-primary'}`}
          >
            {submitting ? (
              <ActivityIndicator color="#0F1416" size="small" />
            ) : (
              <Text className="text-pekon-bg font-bold text-sm">Mulai & Buka Rute Perjalanan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
