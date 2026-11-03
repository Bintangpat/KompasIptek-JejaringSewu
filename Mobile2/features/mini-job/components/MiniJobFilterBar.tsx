import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

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
    <View className="bg-card px-4 py-2.5 border-b border-border flex-row items-center justify-between">
      <View className="flex-row gap-1.5 items-center flex-1 mr-2">
        <TouchableOpacity
          onPress={() => onFilterChange('OPEN')}
          className={`px-3 py-1.5 rounded-lg border ${
            currentFilter === 'OPEN'
              ? 'bg-primary/10 border-primary'
              : 'bg-muted/40 border-border'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              currentFilter === 'OPEN' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Tersedia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange('DISABILITY')}
          className={`px-3 py-1.5 rounded-lg border ${
            currentFilter === 'DISABILITY'
              ? 'bg-cyan-500/10 border-cyan-500'
              : 'bg-muted/40 border-border'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              currentFilter === 'DISABILITY' ? 'text-cyan-400' : 'text-muted-foreground'
            }`}
          >
            Disabilitas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFilterChange('ALL')}
          className={`px-3 py-1.5 rounded-lg border ${
            currentFilter === 'ALL'
              ? 'bg-primary/10 border-primary'
              : 'bg-muted/40 border-border'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              currentFilter === 'ALL' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Semua
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        variant="primary"
        size="sm"
        onPress={onPostJobPress}
        className="flex-row items-center"
      >
        <Plus size={14} color="#FFFFFF" />
        <Text className="text-primary-foreground text-xs font-bold ml-1">Pasang Tugas</Text>
      </Button>
    </View>
  );
};
