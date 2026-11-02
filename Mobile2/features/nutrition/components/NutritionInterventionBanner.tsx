import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Gift, ShoppingBag } from 'lucide-react-native';

interface NutritionInterventionBannerProps {
  onOpenCatalog: () => void;
  isLargeFont?: boolean;
}

export const NutritionInterventionBanner: React.FC<NutritionInterventionBannerProps> = ({
  onOpenCatalog,
  isLargeFont = false,
}) => {
  return (
    <View className="bg-pekon-card border border-pekon-border rounded-2xl p-5 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Gift size={18} color="#00F2A9" />
          <Text className={`text-white font-bold ml-2 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            Intervensi Pangan Stunting
          </Text>
        </View>
        <View className="bg-pekon-primary/10 px-2 py-0.5 rounded border border-pekon-primary/20">
          <Text className="text-pekon-primary text-[10px] font-bold">PROTEIN HEWANI</Text>
        </View>
      </View>

      <Text className={`text-pekon-muted mb-3 ${isLargeFont ? 'text-xs leading-relaxed' : 'text-[11px]'}`}>
        Tukarkan poin reputasi hasil kerja nyata Anda untuk paket pangan berprotein hewani lokal pekon (Telur Bebek, Ikan Nila, & Daun Kelor) untuk mencegah gagal tumbuh balita.
      </Text>

      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Buka katalog pangan bergizi pekon untuk tukar poin"
        className="bg-pekon-surface border border-pekon-primary/40 py-2.5 rounded-xl items-center flex-row justify-center"
        onPress={onOpenCatalog}
      >
        <ShoppingBag size={14} color="#00F2A9" />
        <Text className="text-pekon-primary font-bold text-xs ml-1.5">Buka Katalog Pangan Bergizi</Text>
      </TouchableOpacity>
    </View>
  );
};
