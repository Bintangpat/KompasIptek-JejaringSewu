import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, Radio, MapPin, ArrowRight, PackageCheck, PlusCircle } from 'lucide-react-native';

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
    <View className="bg-pekon-card border border-pekon-border rounded-xl p-4 mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-6 h-6 rounded-full bg-pekon-primary/20 items-center justify-center mr-2">
            <User size={13} color="#00F2A9" />
          </View>
          <Text className="text-white font-bold text-xs">
            {route.commuter?.fullName || 'Warga Komuter'}
          </Text>
        </View>
        <View className="flex-row items-center bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          <Radio size={10} color="#34D399" />
          <Text className="text-emerald-400 text-[10px] font-bold ml-1">AKTIF SEARAH</Text>
        </View>
      </View>

      {/* Geospasial Route Card Visualizer */}
      <View className="bg-pekon-bg border border-pekon-border/60 rounded-lg p-3 my-2.5">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1 mr-2">
            <MapPin size={14} color="#00F2A9" />
            <Text className="text-white text-xs font-semibold ml-1.5 flex-1" numberOfLines={1}>
              {route.originName}
            </Text>
          </View>
          <ArrowRight size={14} color="#84958A" className="mx-1" />
          <View className="flex-row items-center flex-1 ml-2 justify-end">
            <MapPin size={14} color="#EF4444" />
            <Text className="text-white text-xs font-semibold ml-1.5 flex-1 text-right" numberOfLines={1}>
              {route.destinationName}
            </Text>
          </View>
        </View>

        {/* Mini Route Progress Indicator */}
        <View className="h-1.5 bg-pekon-surface rounded-full flex-row overflow-hidden my-1">
          <View className="w-1/2 bg-pekon-primary rounded-full" />
        </View>

        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-pekon-muted text-[10px]">
            {distanceKm ? `Posisi kurir ~${distanceKm} km dari Anda` : 'Dalam jangkauan pekon'}
          </Text>
          <Text className="text-pekon-primary text-[10px] font-bold">Patungan hemat 60%</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-2 border-t border-pekon-border/60 mt-1">
        <View className="flex-row items-center">
          <PackageCheck size={14} color="#84958A" />
          <Text className="text-pekon-muted text-xs ml-1">
            {route.orders?.length || 0} titipan dalam perjalanan
          </Text>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Titip barang ke rute ${route.destinationName}`}
          className="bg-pekon-primary px-3.5 py-1.5 rounded-lg flex-row items-center"
          onPress={() => onOrderPress(route)}
        >
          <PlusCircle size={13} color="#0F1416" />
          <Text className="text-pekon-bg text-xs font-bold ml-1">Titip Barang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
