import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Award, ArrowUpRight } from 'lucide-react-native';

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
    <View className="bg-pekon-surface border border-pekon-border rounded-2xl p-5 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Award size={18} color="#5FD9BF" />
          <Text className={`text-white font-bold ml-2 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            Skor Kredit Alternatif ($S_{'{kredit}'}$)
          </Text>
        </View>
        <View className="bg-pekon-primary/10 px-2 py-0.5 rounded border border-pekon-primary/30">
          <Text className="text-pekon-primary text-[10px] font-bold">
            {creditScore?.grade || 'GRADE_A_LAYAK_MODAL'}
          </Text>
        </View>
      </View>

      <View className="items-center my-3">
        <Text className={`font-black text-pekon-primary ${isLargeFont ? 'text-5xl' : 'text-4xl'}`}>
          {creditScore?.currentScore || '88.5'}
        </Text>
        <Text className="text-pekon-subtle text-xs mt-1">dari 100 poin aktivitas kerja nyata (PoW)</Text>
      </View>

      {/* Bobot Metrik SPK */}
      <View className="gap-1.5 pt-3 border-t border-pekon-border/60">
        <View className="flex-row justify-between">
          <Text className="text-pekon-muted text-xs">Bobot Mini-Job (25%)</Text>
          <Text className="text-pekon-text text-xs font-semibold">90/100</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-pekon-muted text-xs">Bobot Nebeng-Jastip (20%)</Text>
          <Text className="text-pekon-text text-xs font-semibold">85/100</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-pekon-muted text-xs">Validasi Selfie PoW (20%)</Text>
          <Text className="text-pekon-text text-xs font-semibold">100/100</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-pekon-muted text-xs">Indeks Inklusi & Disabilitas (15%)</Text>
          <Text className="text-pekon-text text-xs font-semibold">100/100</Text>
        </View>
      </View>

      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Klaim modal BUMDes satu juta lima ratus ribu rupiah"
        className="bg-pekon-primary mt-4 py-3 rounded-xl flex-row items-center justify-center"
        onPress={onClaimLoan}
      >
        <ArrowUpRight size={16} color="#0F1416" />
        <Text className="text-pekon-bg font-bold text-xs ml-1">
          Klaim Rekomendasi Modal BUMDes Rp 1.500.000
        </Text>
      </TouchableOpacity>
    </View>
  );
};
