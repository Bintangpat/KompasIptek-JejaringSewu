import React from 'react';
import { View, Image } from 'react-native';
import { Send, RefreshCw } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

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
          <Text className="text-foreground font-bold text-base">Pratinjau Bukti Kerja (PoW)</Text>
          <Badge variant="success" size="xs">
            KAMERA LANGSUNG
          </Badge>
        </View>

        {/* Gambar Ber-Watermark */}
        <View className="rounded-2xl overflow-hidden border border-border relative bg-card">
          <Image source={{ uri: capturedPhoto.uri }} className="w-full h-80" resizeMode="cover" />

          {/* Overlay Watermark Permanen */}
          <View className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
            <Text className="text-primary font-bold text-xs">TERTANDATANGANI SECARA KRIPTOGRAFIS</Text>
            <Text className="text-white text-xs font-mono mt-0.5">
              SHA-256: {capturedPhoto.hash.substring(0, 24)}...
            </Text>
            <Text className="text-slate-300 text-[11px] mt-0.5">
              GPS: {capturedPhoto.gpsLat.toFixed(5)}, {capturedPhoto.gpsLng.toFixed(5)} (±{capturedPhoto.accuracy.toFixed(0)}m) • {capturedPhoto.timestamp} WIB
            </Text>
          </View>
        </View>

        {/* Info Transaksi Terkait */}
        <Card className="mt-3 p-3 bg-card border-border">
          <Text className="text-muted-foreground text-[11px]">Transaksi yang Dibuktikan:</Text>
          <Text className="text-foreground font-bold text-xs mt-0.5">
            {selectedTx
              ? `${getTxTypeLabel(selectedTx.type)} • Total: Rp ${Number(selectedTx.grossAmount).toLocaleString('id-ID')}`
              : 'Mode Uji Coba Mandiri (Tanpa Transaksi Database)'}
          </Text>
        </Card>
      </View>

      {/* Tombol Eksekusi Kirim / Ambil Ulang */}
      <View className="gap-2.5 pb-2">
        <Button
          variant="primary"
          size="lg"
          loading={submitting}
          onPress={onSubmit}
          className="w-full flex-row items-center justify-center"
        >
          <Send size={16} color="#FFFFFF" />
          <Text className="text-primary-foreground font-bold text-sm ml-2">Kirim & Verifikasi Transaksi</Text>
        </Button>

        <Button
          variant="outline"
          size="md"
          onPress={onRetake}
          className="w-full flex-row items-center justify-center"
        >
          <RefreshCw size={14} color="#84958A" />
          <Text className="text-foreground font-semibold text-xs ml-2">Ambil Ulang Foto</Text>
        </Button>
      </View>
    </View>
  );
};
