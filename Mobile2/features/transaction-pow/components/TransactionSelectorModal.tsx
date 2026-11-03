import React from 'react';
import { View, Pressable } from 'react-native';
import { CheckCircle2, ChevronRight, Layers } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

interface TransactionSelectorModalProps {
  visible: boolean;
  transactions: any[];
  selectedTx: any | null;
  onSelect: (tx: any) => void;
  onClose: () => void;
  getTxTypeLabel: (type: string) => string;
}

export const TransactionSelectorModal: React.FC<TransactionSelectorModalProps> = ({
  visible,
  transactions,
  selectedTx,
  onSelect,
  onClose,
  getTxTypeLabel,
}) => {
  return (
    <BottomSheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Content>
        <BottomSheet.Header title="Pilih Transaksi Aktif" />

        <BottomSheet.Body>
          <View className="gap-2.5 py-1">
            {transactions.length === 0 ? (
              <View className="p-6 items-center">
                <Layers size={36} color="#84958A" />
                <Text className="text-foreground text-center font-semibold text-sm mt-3">
                  Tidak Ada Transaksi Aktif
                </Text>
                <Text className="text-muted-foreground text-xs text-center mt-1">
                  Ambil tugas di Bursa Mini-Job atau sepakati transaksi hasil panen terlebih dahulu untuk mengunggah bukti kerja.
                </Text>
              </View>
            ) : (
              transactions.map((tx) => {
                const isSelected = selectedTx?.id === tx.id;
                return (
                  <Pressable
                    key={tx.id}
                    onPress={() => onSelect(tx)}
                  >
                    <Card
                      className={`p-3.5 border transition-all flex-row items-center justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card'
                      }`}
                    >
                      <View className="flex-1 mr-2">
                        <View className="flex-row items-center gap-1.5">
                          <Text className="text-foreground font-bold text-xs">
                            {getTxTypeLabel(tx.type)}
                          </Text>
                          <Badge variant="warning" size="xs">
                            {tx.status}
                          </Badge>
                        </View>
                        <Text className="text-muted-foreground text-[11px] mt-1">
                          Mitra: {tx.counterparty?.fullName || tx.initiator?.fullName || 'Warga Pekon'}
                        </Text>
                        <Text className="text-primary font-bold text-xs mt-1">
                          Rp {Number(tx.grossAmount).toLocaleString('id-ID')}
                        </Text>
                      </View>

                      {isSelected ? (
                        <CheckCircle2 size={20} color="#10B981" />
                      ) : (
                        <ChevronRight size={18} color="#84958A" />
                      )}
                    </Card>
                  </Pressable>
                );
              })
            )}
          </View>
        </BottomSheet.Body>

        <BottomSheet.Footer>
          <Button
            variant="outline"
            size="md"
            onPress={onClose}
            className="w-full"
          >
            Tutup
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
