import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

interface MiniJobFilterBarProps {
  currentFilter: 'ALL' | 'DISABILITY' | 'OPEN';
  onFilterChange: (filter: 'ALL' | 'DISABILITY' | 'OPEN') => void;
  onPostJobPress: () => void;
}

export const MiniJobFilterBar: React.FC<MiniJobFilterBarProps> = ({
  currentFilter,
  onFilterChange,
  onPostJobPress,
}) => {
  return (
    <View className="bg-pekon-surface/70 px-4 py-2.5 border-b border-pekon-border/60 flex-row items-center justify-between">
      <View className="flex-row gap-1.5 items-center flex-1 mr-2">
        <TouchableOpacity
          onPress={() => onFilterChange('OPEN')}
          className={`px-2.5 py-1 rounded-md border ${
            currentFilter === 'OPEN'
              ? 'bg-pekon-primary/20 border-pekon-primary'
              : 'bg-pekon-card border-pekon-border'
          }`}
        >
          <Text
            className={`text-[11px] font-semibold ${
              currentFilter === 'OPEN' ? 'text-pekon-primary' : 'text-pekon-muted'
            }`}
          >
            Tersedia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange('DISABILITY')}
          className={`px-2.5 py-1 rounded-md border ${
            currentFilter === 'DISABILITY'
              ? 'bg-cyan-500/20 border-cyan-400'
              : 'bg-pekon-card border-pekon-border'
          }`}
        >
          <Text
            className={`text-[11px] font-semibold ${
              currentFilter === 'DISABILITY' ? 'text-cyan-400' : 'text-pekon-muted'
            }`}
          >
            Disabilitas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange('ALL')}
          className={`px-2.5 py-1 rounded-md border ${
            currentFilter === 'ALL'
              ? 'bg-pekon-primary/20 border-pekon-primary'
              : 'bg-pekon-card border-pekon-border'
          }`}
        >
          <Text
            className={`text-[11px] font-semibold ${
              currentFilter === 'ALL' ? 'text-pekon-primary' : 'text-pekon-muted'
            }`}
          >
            Semua
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-pekon-primary px-3 py-1.5 rounded-lg flex-row items-center"
        onPress={onPostJobPress}
        accessible={true}
        accessibilityLabel="Buka formulir posting lowongan kerja mikro"
      >
        <Plus size={14} color="#0F1416" />
        <Text className="text-pekon-bg text-xs font-bold ml-1">Pasang Tugas</Text>
      </TouchableOpacity>
    </View>
  );
};
