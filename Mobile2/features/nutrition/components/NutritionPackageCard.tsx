import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface NutritionPackageCardProps {
  item: any;
  isRedeeming: boolean;
  onRedeem: (pkg: any) => void;
}

export const NutritionPackageCard: React.FC<NutritionPackageCardProps> = ({
  item,
  isRedeeming,
  onRedeem,
}) => {
  return (
    <View className="bg-pekon-card border border-pekon-border rounded-xl p-4 mb-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Text className="text-white font-bold text-sm">{item.packageName}</Text>
          <Text className="text-pekon-muted text-xs mt-1 leading-relaxed">
            {item.description}
          </Text>
        </View>
        <View className="bg-pekon-primary/10 border border-pekon-primary/30 px-2.5 py-1 rounded-lg items-center">
          <Text className="text-pekon-primary font-black text-sm">{item.pointCost}</Text>
          <Text className="text-pekon-primary text-[9px] font-bold">POIN</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-3 border-t border-pekon-border/60 mt-3">
        <View className="flex-row items-center flex-1 mr-2">
          <Sparkles size={12} color="#00F2A9" />
          <Text className="text-pekon-subtle text-[10px] ml-1 flex-1" numberOfLines={1}>
            {item.pickupLocation}
          </Text>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Tukarkan ${item.pointCost} poin untuk ${item.packageName}`}
          disabled={isRedeeming}
          onPress={() => onRedeem(item)}
          className="bg-pekon-primary px-3 py-1.5 rounded-lg"
        >
          {isRedeeming ? (
            <ActivityIndicator size="small" color="#0F1416" />
          ) : (
            <Text className="text-pekon-bg font-bold text-xs">Tukar Poin</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
