import React from 'react';
import { View, Text } from 'react-native';
import { Wallet } from 'lucide-react-native';

interface WalletBalanceCardProps {
  wallet: any;
  isLargeFont?: boolean;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  wallet,
  isLargeFont = false,
}) => {
  const cash = wallet?.cashBalance ? Number(wallet.cashBalance).toLocaleString('id-ID') : '25.000';
  const points = wallet?.pointsBalance ? Number(wallet.pointsBalance) : 50;

  return (
    <View
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`Dompet Kompas Pekon. Saldo tunai ${cash} Rupiah. Poin reputasi ${points} poin.`}
      className="bg-pekon-card border border-pekon-border rounded-2xl p-5 mb-4"
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Wallet size={18} color="#00F2A9" />
          <Text className={`text-white font-bold ml-2 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            Dompet Kompas Pekon
          </Text>
        </View>
        <View className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          <Text className="text-emerald-400 text-[10px] font-bold">DOUBLE-ENTRY HMAC</Text>
        </View>
      </View>

      <View className="flex-row divide-x divide-pekon-border/60">
        <View className="flex-1 pr-3">
          <Text className={`text-pekon-muted ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>
            Saldo Tunai (Upah & Komisi)
          </Text>
          <Text className={`text-white font-extrabold mt-1 ${isLargeFont ? 'text-2xl' : 'text-lg'}`}>
            Rp {cash}
          </Text>
        </View>
        <View className="flex-1 pl-3">
          <Text className={`text-pekon-muted ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>
            Poin Reputasi & Gizi
          </Text>
          <Text className={`text-pekon-primary font-extrabold mt-1 ${isLargeFont ? 'text-2xl' : 'text-lg'}`}>
            {points} PTS
          </Text>
        </View>
      </View>
    </View>
  );
};
