import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
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
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-pekon-surface rounded-t-3xl border-t border-pekon-border p-5 max-h-[85%]">
          <View className="flex-row justify-between items-center pb-3 border-b border-pekon-border">
            <View>
              <Text className="text-white font-bold text-base">Katalog Pangan Bergizi Pekon</Text>
              <Text className="text-pekon-muted text-xs">Pencegahan Stunting Berbasis Poin PoW</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#84958A" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#00F2A9" className="my-8" />
          ) : (
            <FlatList
              data={packages}
              keyExtractor={(item) => item.id}
              className="my-3"
              renderItem={({ item }) => (
                <NutritionPackageCard
                  item={item}
                  isRedeeming={redeemingPackageId === item.id}
                  onRedeem={onRedeem}
                />
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
