import React from 'react';
import { View } from 'react-native';
import { MapPin, Sparkles } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

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
    <Card className="bg-card border-border p-4 mb-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 pr-2">
          <Text className="text-foreground font-bold text-sm">{item.packageName}</Text>
          <Text className="text-muted-foreground text-xs mt-1 leading-relaxed">
            {item.description}
          </Text>
        </View>
        <Badge variant="default" size="md">
          {item.pointCost} POIN
        </Badge>
      </View>

      <View className="flex-row justify-between items-center pt-3 border-t border-border mt-3">
        <View className="flex-row items-center flex-1 mr-2">
          <MapPin size={13} color="#10B981" />
          <Text className="text-muted-foreground text-[11px] ml-1 flex-1" numberOfLines={1}>
            {item.pickupLocation}
          </Text>
        </View>
        <Button
          variant="primary"
          size="sm"
          loading={isRedeeming}
          onPress={() => onRedeem(item)}
        >
          Tukar Poin
        </Button>
      </View>
    </Card>
  );
};
