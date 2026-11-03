import React, { useState } from 'react';
import { View } from 'react-native';
import { Sprout } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

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
    if (!commodityName.trim() || isNaN(kg) || isNaN(minPrice)) return;

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
    <BottomSheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Content>
        <BottomSheet.Header title="Posting Hasil Panen Baru" />

        <BottomSheet.Body>
          <View className="gap-3.5 py-1">
            <View className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex-row items-center">
              <Sprout size={18} color="#10B981" />
              <Text className="text-foreground text-xs ml-2 flex-1">
                Buka lelang hasil bumi ke jaringan pengepul jujur pekon dengan transparansi harga.
              </Text>
            </View>

            <Input
              label="Nama Komoditas Panen *"
              placeholder="Misal: Singkong Mukibat, Kakao Fermentasi, Ikan Nila"
              value={commodityName}
              onChangeText={setCommodityName}
            />

            <Input
              label="Estimasi Berat Panen (Kg) *"
              placeholder="Contoh: 1500"
              keyboardType="numeric"
              value={estimatedKg}
              onChangeText={setEstimatedKg}
            />

            <Input
              label="Batas Minimal Harga Jual (Rp/Kg) *"
              placeholder="Contoh: 2500"
              keyboardType="numeric"
              value={minPricePerKg}
              onChangeText={setMinPricePerKg}
            />
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
            Tayangkan ke Bursa Panen Pekon
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
