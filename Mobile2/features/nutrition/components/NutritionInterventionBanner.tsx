import React from 'react';
import { View } from 'react-native';
import { Gift, ShoppingBag } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface NutritionInterventionBannerProps {
  onOpenCatalog: () => void;
  isLargeFont?: boolean;
}

export const NutritionInterventionBanner: React.FC<NutritionInterventionBannerProps> = ({
  onOpenCatalog,
  isLargeFont = false,
}) => {
  return (
    <Card className="bg-card border-border p-5 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Gift size={18} color="#10B981" />
          <Text className={`text-foreground font-bold ml-2 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            Intervensi Pangan Stunting
          </Text>
        </View>
        <Badge variant="success" size="xs">
          PROTEIN HEWANI
        </Badge>
      </View>

      <Text className={`text-muted-foreground mb-3 leading-relaxed ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>
        Tukarkan poin reputasi hasil kerja nyata Anda untuk paket pangan berprotein hewani lokal pekon (Telur Bebek, Ikan Nila, & Daun Kelor) untuk mencegah gagal tumbuh balita.
      </Text>

      <Button
        variant="outline"
        size="md"
        className="w-full flex-row items-center justify-center"
        onPress={onOpenCatalog}
      >
        <ShoppingBag size={14} color="#10B981" />
        <Text className="text-primary font-bold text-xs ml-1.5">Buka Katalog Pangan Bergizi</Text>
      </Button>
    </Card>
  );
};
