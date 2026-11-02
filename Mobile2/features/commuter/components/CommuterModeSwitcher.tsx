import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Compass } from 'lucide-react-native';

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
    <View className="bg-pekon-surface border-b border-pekon-border p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-white font-bold text-lg">Logistik Komuter Pekon</Text>
          <Text className="text-pekon-muted text-xs mt-0.5">
            Nebeng barang searah rute harian warga. Hemat bensin hingga 60% dan minim emisi.
          </Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-center bg-pekon-card border border-pekon-border px-2.5 py-1 rounded-full">
            <Compass size={12} color="#00F2A9" />
            <Text className="text-pekon-primary text-[10px] font-bold ml-1">
              {gpsAccuracy ? `GPS ±${gpsAccuracy}m` : 'GPS Siap'}
            </Text>
          </View>
        </View>
      </View>

      {/* Sub-Tab Switcher */}
      <View className="flex-row mt-3 bg-pekon-bg p-1 rounded-xl border border-pekon-border">
        <TouchableOpacity
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel="Tab Titip Barang Warga"
          className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'warga' ? 'bg-pekon-primary' : 'bg-transparent'}`}
          onPress={() => setActiveTab('warga')}
        >
          <Text className={`text-xs font-bold ${activeTab === 'warga' ? 'text-pekon-bg' : 'text-pekon-muted'}`}>
            Titip Barang (Warga)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessible={true}
          accessibilityRole="tab"
          accessibilityLabel="Tab Rute Saya Kurir"
          className={`flex-1 py-2 rounded-lg items-center ${activeTab === 'kurir' ? 'bg-pekon-primary' : 'bg-transparent'}`}
          onPress={() => setActiveTab('kurir')}
        >
          <View className="flex-row items-center">
            <Text className={`text-xs font-bold ${activeTab === 'kurir' ? 'text-pekon-bg' : 'text-pekon-muted'}`}>
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
