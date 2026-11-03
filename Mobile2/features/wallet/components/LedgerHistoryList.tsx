import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Layers, Clock, ArrowDownLeft, ArrowUpRight as ArrowDebit, ShieldCheck } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

interface LedgerHistoryListProps {
  entries: any[];
  ledgerFilter: 'ALL' | 'IDR' | 'POINTS';
  onFilterChange: (filter: 'ALL' | 'IDR' | 'POINTS') => void;
  isLargeFont?: boolean;
}

export const LedgerHistoryList: React.FC<LedgerHistoryListProps> = ({
  entries,
  ledgerFilter,
  onFilterChange,
  isLargeFont = false,
}) => {
  const filteredEntries = entries.filter((entry) => {
    if (ledgerFilter === 'IDR') return entry.currency === 'IDR';
    if (ledgerFilter === 'POINTS') return entry.currency === 'POINTS';
    return true;
  });

  return (
    <Card className="bg-card border-border p-5 mb-8">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Layers size={16} color="#10B981" />
          <Text className={`text-foreground font-bold ml-2 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
            Riwayat Mutasi Buku Besar
          </Text>
        </View>
        <View className="flex-row gap-1">
          {(['ALL', 'IDR', 'POINTS'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => onFilterChange(filter)}
              className={`px-2 py-0.5 rounded-md border ${
                ledgerFilter === filter
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted/40 border-border'
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  ledgerFilter === filter ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {filter === 'ALL' ? 'Semua' : filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredEntries.length === 0 ? (
        <View className="py-6 items-center">
          <Clock size={28} color="#84958A" />
          <Text className="text-foreground font-semibold text-xs mt-2">Belum ada catatan mutasi</Text>
          <Text className="text-muted-foreground text-[11px] text-center mt-1">
            Seluruh upah kerja mini-job dan komisi nebeng jastip akan tercatat otomatis di buku besar ini.
          </Text>
        </View>
      ) : (
        filteredEntries.map((entry) => {
          const isCredit = entry.entryType === 'CREDIT';
          const isPoints = entry.currency === 'POINTS';
          const formattedDate = entry.createdAt
            ? new Date(entry.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-';

          return (
            <View
              key={entry.id}
              className="py-2.5 border-b border-border/60 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 mr-2">
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center mr-2.5 ${
                    isCredit ? 'bg-primary/10' : 'bg-destructive/10'
                  }`}
                >
                  {isCredit ? (
                    <ArrowDownLeft size={14} color="#10B981" />
                  ) : (
                    <ArrowDebit size={14} color="#EF4444" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-xs font-semibold" numberOfLines={1}>
                    {isCredit ? 'Penerimaan Upah / Poin' : 'Penukaran / Debit Saldo'}
                  </Text>
                  <View className="flex-row items-center mt-0.5">
                    <Text className="text-muted-foreground text-[10px]">{formattedDate}</Text>
                    <View className="w-1 h-1 rounded-full bg-border mx-1.5" />
                    <View className="flex-row items-center">
                      <ShieldCheck size={10} color="#10B981" />
                      <Text className="text-primary text-[9px] font-bold ml-0.5">HMAC SIGNED</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="items-end">
                <Text
                  className={`font-bold text-xs ${isCredit ? 'text-primary' : 'text-destructive'}`}
                >
                  {isCredit ? '+' : '-'}{' '}
                  {isPoints
                    ? `${Number(entry.amount)} PTS`
                    : `Rp ${Number(entry.amount).toLocaleString('id-ID')}`}
                </Text>
                <Text className="text-muted-foreground text-[9px] mt-0.5">
                  Sisa:{' '}
                  {isPoints
                    ? `${Number(entry.balanceAfter)} PTS`
                    : `Rp ${Number(entry.balanceAfter).toLocaleString('id-ID')}`}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </Card>
  );
};
