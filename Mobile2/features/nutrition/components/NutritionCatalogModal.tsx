import React from 'react';
import { View } from 'react-native';
import { Apple } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { NutritionPackageCard } from './NutritionPackageCard';

interface NutritionCatalogModalProps {
  visible: boolean;
  packages: any[];
  loading: boolean;
  redeemingPackageId: string | null;
  onClose: () => void;
  onRedeem: (pkg: any) => void;
}

export const NutritionCatalogModal: React.FC<NutritionCatalogModalProps> = ({
  visible,
  packages,
  loading,
  redeemingPackageId,
  onClose,
  onRedeem,
}) => {
  return (
    <BottomSheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Content>
        <BottomSheet.Header title="Katalog Pangan Bergizi Pekon" />

        <BottomSheet.Body>
          <View className="py-1">
            <View className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex-row items-center mb-3">
              <Apple size={18} color="#10B981" />
              <Text className="text-foreground text-xs ml-2 flex-1">
                Pencegahan Stunting Berbasis Poin PoW. Tukarkan poin bukti kerja Anda dengan paket pangan hewani bergizi.
              </Text>
            </View>

            {loading ? (
              <View className="py-8 items-center">
                <Spinner size="lg" />
                <Text className="text-muted-foreground text-xs mt-3">Memuat paket pangan pekon...</Text>
              </View>
            ) : packages.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-muted-foreground text-xs">Belum ada paket pangan aktif saat ini.</Text>
              </View>
            ) : (
              packages.map((pkg) => (
                <NutritionPackageCard
                  key={pkg.id}
                  item={pkg}
                  isRedeeming={redeemingPackageId === pkg.id}
                  onRedeem={onRedeem}
                />
              ))
            )}
          </View>
        </BottomSheet.Body>

        <BottomSheet.Footer>
          <Button
            variant="outline"
            size="md"
            onPress={onClose}
            className="w-full"
          >
            Tutup
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
