import React from 'react';
import { View } from 'react-native';
import { Award, ArrowUpRight } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface CreditScoreCardProps {
  creditScore: any;
  onClaimLoan: () => void;
  isLargeFont?: boolean;
}

export const CreditScoreCard: React.FC<CreditScoreCardProps> = ({
  creditScore,
  onClaimLoan,
  isLargeFont = false,
}) => {
  return (
    <Card className="bg-card border-border p-5 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Award size={18} color="#10B981" />
          <Text className={`text-foreground font-bold ml-2 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            Skor Kredit Alternatif ($S_{'{kredit}'}$)
          </Text>
        </View>
        <Badge variant="success" size="xs">
          {creditScore?.grade || 'GRADE_A_LAYAK_MODAL'}
        </Badge>
      </View>

      <View className="items-center my-3">
        <Text className={`font-black text-primary ${isLargeFont ? 'text-5xl' : 'text-4xl'}`}>
          {creditScore?.currentScore || '88.5'}
        </Text>
        <Text className="text-muted-foreground text-xs mt-1">dari 100 poin aktivitas kerja nyata (PoW)</Text>
      </View>

      {/* Bobot Metrik SPK */}
      <View className="gap-1.5 pt-3 border-t border-border">
        <View className="flex-row justify-between">
          <Text className="text-muted-foreground text-xs">Bobot Mini-Job (25%)</Text>
          <Text className="text-foreground text-xs font-semibold">90/100</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted-foreground text-xs">Bobot Nebeng-Jastip (20%)</Text>
          <Text className="text-foreground text-xs font-semibold">85/100</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted-foreground text-xs">Validasi Selfie PoW (20%)</Text>
          <Text className="text-foreground text-xs font-semibold">100/100</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted-foreground text-xs">Indeks Inklusi & Disabilitas (15%)</Text>
          <Text className="text-foreground text-xs font-semibold">100/100</Text>
        </View>
      </View>

      <Button
        variant="primary"
        size="lg"
        className="mt-4 w-full flex-row items-center justify-center"
        onPress={onClaimLoan}
      >
        <ArrowUpRight size={16} color="#FFFFFF" />
        <Text className="text-primary-foreground font-bold text-xs ml-1.5">
          Klaim Rekomendasi Modal BUMDes Rp 1.500.000
        </Text>
      </Button>
    </Card>
  );
};
