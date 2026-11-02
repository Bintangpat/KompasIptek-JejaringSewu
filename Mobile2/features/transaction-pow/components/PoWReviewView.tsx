import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Send, RefreshCw } from 'lucide-react-native';

interface PoWPhotoData {
  uri: string;
  hash: string;
  gpsLat: number;
  gpsLng: number;
  accuracy: number;
  timestamp: string;
}

interface PoWReviewViewProps {
  capturedPhoto: PoWPhotoData;
  selectedTx: any | null;
  submitting: boolean;
  onSubmit: () => void;
  onRetake: () => void;
  getTxTypeLabel: (type: string) => string;
}

export const PoWReviewView: React.FC<PoWReviewViewProps> = ({
  capturedPhoto,
  selectedTx,
  submitting,
  onSubmit,
  onRetake,
  getTxTypeLabel,
}) => {
  return (
    <View className="flex-1 p-4 justify-between">
      <View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-bold text-base">Pratinjau Bukti Kerja (PoW)</Text>
          <View className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
            <Text className="text-emerald-400 text-[10px] font-bold">KAMERA LANGSUNG</Text>
          </View>
        </View>

        {/* Gambar Ber-Watermark */}
        <View className="rounded-2xl overflow-hidden border border-pekon-border relative bg-pekon-card">
          <Image source={{ uri: capturedPhoto.uri }} className="w-full h-84" resizeMode="cover" />

          {/* Overlay Watermark Permanen */}
          <View className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
            <Text className="text-emerald-400 font-bold text-xs">TERTANDATANGANI SECARA KRIPTOGRAFIS</Text>
            <Text className="text-white text-xs font-mono mt-0.5">
              SHA-256: {capturedPhoto.hash.substring(0, 24)}...
            </Text>
            <Text className="text-pekon-muted text-[11px] mt-0.5">
              GPS: {capturedPhoto.gpsLat.toFixed(5)}, {capturedPhoto.gpsLng.toFixed(5)} (±{capturedPhoto.accuracy.toFixed(0)}m) • {capturedPhoto.timestamp} WIB
            </Text>
          </View>
        </View>

        {/* Info Transaksi Terkait */}
        <View className="mt-3 p-3 bg-pekon-card border border-pekon-border rounded-xl">
          <Text className="text-pekon-subtle text-[11px]">Transaksi yang Dibuktikan:</Text>
          <Text className="text-white font-bold text-xs mt-0.5">
            {selectedTx
              ? `${getTxTypeLabel(selectedTx.type)} • Total: Rp ${Number(selectedTx.grossAmount).toLocaleString('id-ID')}`
              : 'Mode Uji Coba Mandiri (Tanpa Transaksi Database)'}
          </Text>
        </View>
      </View>

      {/* Tombol Eksekusi Kirim / Ambil Ulang */}
      <View className="gap-2.5 pb-2">
        <TouchableOpacity
          className="bg-pekon-primary py-3.5 rounded-xl flex-row items-center justify-center"
          onPress={onSubmit}
          disabled={submitting}
          accessible={true}
          accessibilityLabel="Kirim dan verifikasi bukti kerja ke server pekon"
        >
          {submitting ? (
            <ActivityIndicator color="#0F1416" />
          ) : (
            <>
              <Send size={16} color="#0F1416" />
              <Text className="text-pekon-bg font-bold text-sm ml-2">Kirim & Verifikasi Transaksi</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-pekon-surface border border-pekon-border py-3 rounded-xl flex-row items-center justify-center"
          onPress={onRetake}
          accessible={true}
          accessibilityLabel="Ambil ulang foto bukti kerja"
        >
          <RefreshCw size={15} color="#84958A" />
          <Text className="text-pekon-text font-semibold text-xs ml-2">Ambil Ulang Foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
