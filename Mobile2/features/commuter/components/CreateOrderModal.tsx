import React, { useState } from 'react';
import { View } from 'react-native';
import { MapPin, PackageCheck } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

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
    if (!itemDescription.trim()) return;
    await onSubmit(itemDescription, fuelShareCost);
  };

  return (
    <BottomSheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Content>
        <BottomSheet.Header title="Titip Barang Searah" />

        <BottomSheet.Body>
          <View className="gap-3.5 py-1">
            {selectedRoute && (
              <Card className="bg-card border-border p-3">
                <Text className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  Rute Kurir Komuter
                </Text>
                <Text className="text-foreground font-bold text-sm mt-0.5">
                  {selectedRoute.originName} ➔ {selectedRoute.destinationName}
                </Text>
              </Card>
            )}

            <Input
              label="Deskripsi Barang Titipan *"
              value={itemDescription}
              onChangeText={setItemDescription}
              placeholder="Contoh: Paket dokumen KTP pekon, atau 2 botol madu hutan"
            />

            <Input
              label="Patungan Bensin yang Ditawarkan (Rp) *"
              value={fuelShareCost}
              onChangeText={setFuelShareCost}
              placeholder="7500"
              keyboardType="numeric"
            />

            {/* Titik Jemput GPS Info */}
            <View className="bg-muted/40 border border-border p-3 rounded-xl flex-row items-center">
              <MapPin size={16} className="text-primary" color="#10B981" />
              <View className="ml-2.5 flex-1">
                <Text className="text-foreground text-xs font-semibold">Titik Jemput Otomatis (GPS)</Text>
                <Text className="text-muted-foreground text-[10px] mt-0.5">
                  {currentCoords
                    ? `Lat: ${currentCoords.lat.toFixed(4)}, Lng: ${currentCoords.lng.toFixed(4)}`
                    : 'Mendeteksi koordinat...'}
                </Text>
              </View>
            </View>
          </View>
        </BottomSheet.Body>

        <BottomSheet.Footer>
          <Button
            variant="primary"
            size="lg"
            loading={submitting}
            onPress={handleSubmit}
            className="w-full"
          >
            Kirim Permintaan Titipan Jastip
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
