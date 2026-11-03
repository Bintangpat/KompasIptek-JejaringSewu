import React from 'react';
import { View } from 'react-native';
import { User, MapPin, ArrowRight, PackageCheck } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface CommuterRouteCardProps {
  route: any;
  onOrderPress: (route: any) => void;
}

export const CommuterRouteCard: React.FC<CommuterRouteCardProps> = ({
  route,
  onOrderPress,
}) => {
  const distanceKm = route.distance_meters ? (route.distance_meters / 1000).toFixed(1) : null;

  return (
    <Card className="bg-card border-border p-4 mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-full bg-primary/10 items-center justify-center mr-2">
            <User size={14} color="#10B981" />
          </View>
          <Text className="text-foreground font-bold text-xs">
            {route.commuter?.fullName || 'Warga Komuter'}
          </Text>
        </View>
        <Badge variant="success" size="xs">
          AKTIF SEARAH
        </Badge>
      </View>

      {/* Geospasial Route Card Visualizer */}
      <View className="bg-muted/30 border border-border/80 rounded-xl p-3 my-2.5">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1 mr-2">
            <MapPin size={14} color="#10B981" />
            <Text className="text-foreground text-xs font-semibold ml-1.5 flex-1" numberOfLines={1}>
              {route.originName}
            </Text>
          </View>
          <ArrowRight size={14} color="#84958A" className="mx-1" />
          <View className="flex-row items-center flex-1 ml-2 justify-end">
            <MapPin size={14} color="#EF4444" />
            <Text className="text-foreground text-xs font-semibold ml-1.5 flex-1 text-right" numberOfLines={1}>
              {route.destinationName}
            </Text>
          </View>
        </View>

        {/* Mini Route Progress Indicator */}
        <View className="h-1.5 bg-muted rounded-full flex-row overflow-hidden my-1">
          <View className="w-1/2 bg-primary rounded-full" />
        </View>

        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-muted-foreground text-[10px]">
            {distanceKm ? `Posisi kurir ~${distanceKm} km dari Anda` : 'Dalam jangkauan pekon'}
          </Text>
          <Text className="text-primary text-[10px] font-bold">Patungan hemat 60%</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-2.5 border-t border-border mt-1">
        <View className="flex-row items-center">
          <PackageCheck size={14} color="#84958A" />
          <Text className="text-muted-foreground text-xs ml-1.5">
            {route.orders?.length || 0} titipan dalam perjalanan
          </Text>
        </View>
        <Button
          variant="primary"
          size="sm"
          onPress={() => onOrderPress(route)}
        >
          Titip Barang
        </Button>
      </View>
    </Card>
  );
};
