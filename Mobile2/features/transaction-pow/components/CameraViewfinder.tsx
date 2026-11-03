import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera';
import {
  ChevronDown,
  MapPin,
  AlertTriangle,
  SwitchCamera,
} from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';

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
            onPress={onOpenTxSelector}
            accessible={true}
            accessibilityLabel="Pilih transaksi aktif untuk dibuktikan"
          >
            <Card className="bg-popover/90 border-border p-3 flex-row items-center justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Target Verifikasi Transaksi:
                </Text>
                <Text className="text-foreground text-xs font-bold mt-0.5" numberOfLines={1}>
                  {selectedTx
                    ? `${getTxTypeLabel(selectedTx.type)} • Rp ${Number(selectedTx.grossAmount).toLocaleString('id-ID')}`
                    : activeTransactionsCount > 0
                    ? 'Pilih Transaksi Aktif...'
                    : 'Belum Ada Transaksi Aktif (Mode Uji Coba)'}
                </Text>
              </View>
              <ChevronDown size={16} color="#10B981" />
            </Card>
          </TouchableOpacity>

          {/* Status Geotagging & Toleransi GPS */}
          <Card className="bg-popover/90 border-border px-3 py-2 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <MapPin size={13} color={isGpsAccurate ? '#10B981' : '#F59E0B'} />
              <Text className="text-foreground text-[11px] font-semibold ml-1.5" numberOfLines={1}>
                GPS: {location?.coords.latitude.toFixed(4) || '-5.3421'}, {location?.coords.longitude.toFixed(4) || '104.9452'} (±{accuracyMeters.toFixed(0)}m)
              </Text>
            </View>
            {isGpsAccurate ? (
              <Badge variant="success" size="xs">
                AKURAT
              </Badge>
            ) : (
              <Badge variant="warning" size="xs">
                LEMAH
              </Badge>
            )}
          </Card>
        </View>

        {/* Shutter Bar & Tombol Flip Camera */}
        <View className="absolute bottom-8 left-0 right-0 flex-row items-center justify-around px-8">
          {/* Tombol Flip Camera Depan / Belakang */}
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-popover/90 border border-border items-center justify-center"
            onPress={() => setFacing((prev) => (prev === 'front' ? 'back' : 'front'))}
            accessible={true}
            accessibilityLabel="Putar kamera depan atau belakang"
          >
            <SwitchCamera size={20} color="#10B981" />
          </TouchableOpacity>

          {/* Tombol Ambil Foto Shutter */}
          <View className="items-center">
            <TouchableOpacity
              className="w-20 h-20 rounded-full border-4 border-primary bg-background/80 items-center justify-center shadow-lg"
              onPress={onCapture}
              disabled={isCapturing}
              accessible={true}
              accessibilityLabel="Ambil foto bukti kerja selfie proof of work"
            >
              {isCapturing ? (
                <Spinner size="md" />
              ) : (
                <View className="w-14 h-14 rounded-full bg-primary" />
              )}
            </TouchableOpacity>
            <Text className="text-foreground text-[11px] font-semibold mt-1.5 shadow-sm">
              {facing === 'front' ? 'Selfie Kerja' : 'Foto Objek'}
            </Text>
          </View>

          {/* Placeholder Seimbang */}
          <View className="w-12 h-12 opacity-0">
            <SwitchCamera size={20} color="#10B981" />
          </View>
        </View>
      </CameraView>
    </View>
  );
};
