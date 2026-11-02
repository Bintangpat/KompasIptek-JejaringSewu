import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
import {
  ChevronDown,
  MapPin,
  AlertTriangle,
  SwitchCamera,
} from 'lucide-react-native';

interface CameraViewfinderProps {
  cameraRef: any;
  facing: 'front' | 'back';
  setFacing: React.Dispatch<React.SetStateAction<'front' | 'back'>>;
  selectedTx: any | null;
  activeTransactionsCount: number;
  onOpenTxSelector: () => void;
  location: any;
  accuracyMeters: number;
  isGpsAccurate: boolean;
  isCapturing: boolean;
  onCapture: () => void;
  getTxTypeLabel: (type: string) => string;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  cameraRef,
  facing,
  setFacing,
  selectedTx,
  activeTransactionsCount,
  onOpenTxSelector,
  location,
  accuracyMeters,
  isGpsAccurate,
  isCapturing,
  onCapture,
  getTxTypeLabel,
}) => {
  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        {/* Overlay Header: Pemilih Transaksi Aktif & Status GPS */}
        <View className="absolute top-4 left-4 right-4 gap-2">
          {/* Kartu Pemilih Transaksi */}
          <TouchableOpacity
            className="bg-pekon-bg/90 border border-pekon-border p-3 rounded-xl flex-row items-center justify-between"
            onPress={onOpenTxSelector}
            accessible={true}
            accessibilityLabel="Pilih transaksi aktif untuk dibuktikan"
          >
            <View className="flex-1 mr-2">
              <Text className="text-[10px] font-bold text-pekon-primary uppercase tracking-wider">
                Target Verifikasi Transaksi:
              </Text>
              <Text className="text-white text-xs font-bold mt-0.5" numberOfLines={1}>
                {selectedTx
                  ? `${getTxTypeLabel(selectedTx.type)} • Rp ${Number(selectedTx.grossAmount).toLocaleString('id-ID')}`
                  : activeTransactionsCount > 0
                  ? 'Pilih Transaksi Aktif...'
                  : 'Belum Ada Transaksi Aktif (Mode Uji Coba)'}
              </Text>
            </View>
            <ChevronDown size={16} color="#00F2A9" />
          </TouchableOpacity>

          {/* Status Geotagging & Toleransi GPS */}
          <View className="bg-pekon-bg/90 border border-pekon-border px-3 py-2 rounded-xl flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <MapPin size={13} color={isGpsAccurate ? '#00F2A9' : '#F59E0B'} />
              <Text className="text-white text-[11px] font-semibold ml-1.5" numberOfLines={1}>
                GPS: {location?.coords.latitude.toFixed(4) || '-5.3421'}, {location?.coords.longitude.toFixed(4) || '104.9452'} (±{accuracyMeters.toFixed(0)}m)
              </Text>
            </View>
            {isGpsAccurate ? (
              <View className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                <Text className="text-emerald-400 text-[9px] font-bold">AKURAT</Text>
              </View>
            ) : (
              <View className="bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 flex-row items-center">
                <AlertTriangle size={9} color="#F59E0B" />
                <Text className="text-amber-400 text-[9px] font-bold ml-1">LEMAH</Text>
              </View>
            )}
          </View>
        </View>

        {/* Shutter Bar & Tombol Flip Camera */}
        <View className="absolute bottom-8 left-0 right-0 flex-row items-center justify-around px-8">
          {/* Tombol Flip Camera Depan / Belakang */}
          <TouchableOpacity
            className="w-13 h-13 rounded-full bg-pekon-surface/85 border border-pekon-border items-center justify-center p-3"
            onPress={() => setFacing((prev) => (prev === 'front' ? 'back' : 'front'))}
            accessible={true}
            accessibilityLabel="Putar kamera depan atau belakang"
          >
            <SwitchCamera size={22} color="#00F2A9" />
          </TouchableOpacity>

          {/* Tombol Ambil Foto Shutter */}
          <View className="items-center">
            <TouchableOpacity
              className="w-20 h-20 rounded-full border-4 border-pekon-primary bg-pekon-surface/80 items-center justify-center"
              onPress={onCapture}
              disabled={isCapturing}
              accessible={true}
              accessibilityLabel="Ambil foto bukti kerja selfie proof of work"
            >
              {isCapturing ? (
                <ActivityIndicator color="#00F2A9" />
              ) : (
                <View className="w-14 h-14 rounded-full bg-pekon-primary" />
              )}
            </TouchableOpacity>
            <Text className="text-white text-[11px] font-semibold mt-1.5">
              {facing === 'front' ? 'Selfie Kerja' : 'Foto Objek'}
            </Text>
          </View>

          {/* Placeholder Seimbang */}
          <View className="w-13 h-13 p-3 opacity-0">
            <SwitchCamera size={22} color="#00F2A9" />
          </View>
        </View>
      </CameraView>
    </View>
  );
};
