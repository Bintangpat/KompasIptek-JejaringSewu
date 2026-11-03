import React from 'react';
import { View } from 'react-native';
import { Wallet } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

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
    <Card
      className="bg-card border-border p-5 mb-4"
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`Dompet Kompas Pekon. Saldo tunai ${cash} Rupiah. Poin reputasi ${points} poin.`}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Wallet size={18} color="#10B981" />
          <Text className={`text-foreground font-bold ml-2 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            Dompet Kompas Pekon
          </Text>
        </View>
        <Badge variant="success" size="xs">
          DOUBLE-ENTRY HMAC
        </Badge>
      </View>

      <View className="flex-row divide-x divide-border">
        <View className="flex-1 pr-3">
          <Text className={`text-muted-foreground ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>
            Saldo Tunai (Upah & Komisi)
          </Text>
          <Text className={`text-foreground font-extrabold mt-1 ${isLargeFont ? 'text-2xl' : 'text-lg'}`}>
            Rp {cash}
          </Text>
        </View>
        <View className="flex-1 pl-3">
          <Text className={`text-muted-foreground ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>
            Poin Reputasi & Gizi
          </Text>
          <Text className={`text-primary font-extrabold mt-1 ${isLargeFont ? 'text-2xl' : 'text-lg'}`}>
            {points} PTS
          </Text>
        </View>
      </View>
    </Card>
  );
};
