import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Compass } from 'lucide-react-native';

import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

interface CommuterModeSwitcherProps {
  activeTab: 'warga' | 'kurir';
  setActiveTab: (tab: 'warga' | 'kurir') => void;
  gpsAccuracy: number | null;
  hasActiveRoute: boolean;
}

export const CommuterModeSwitcher: React.FC<CommuterModeSwitcherProps> = ({
  activeTab,
  setActiveTab,
  gpsAccuracy,
  hasActiveRoute,
}) => {
  return (
    <View className="bg-card border-b border-border p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-foreground font-bold text-lg">Logistik Komuter Pekon</Text>
          <Text className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
            Nebeng barang searah rute harian warga. Hemat bensin hingga 60% dan minim emisi.
          </Text>
        </View>
        <View className="items-end">
          <Badge variant="outline" size="xs" className="flex-row items-center">
            <Compass size={11} color="#10B981" />
            <Text className="text-primary text-[10px] font-bold ml-1">
              {gpsAccuracy ? `GPS ±${gpsAccuracy}m` : 'GPS Siap'}
            </Text>
          </Badge>
        </View>
      </View>

      {/* Sub-Tab Switcher */}
      <View className="flex-row mt-3 bg-muted/40 p-1 rounded-xl border border-border">
        <TouchableOpacity
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel="Tab Titip Barang Warga"
          className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'warga' ? 'bg-primary' : 'bg-transparent'}`}
          onPress={() => setActiveTab('warga')}
        >
          <Text className={`text-xs font-bold ${activeTab === 'warga' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
            Titip Barang (Warga)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel="Tab Rute Saya Kurir"
          className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'kurir' ? 'bg-primary' : 'bg-transparent'}`}
          onPress={() => setActiveTab('kurir')}
        >
          <View className="flex-row items-center">
            <Text className={`text-xs font-bold ${activeTab === 'kurir' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              Rute Saya (Kurir)
            </Text>
            {hasActiveRoute && (
              <View className="w-2 h-2 rounded-full bg-emerald-400 ml-1.5" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
