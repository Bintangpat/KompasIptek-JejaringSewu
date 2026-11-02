import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

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
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-pekon-surface rounded-t-3xl border-t border-pekon-border p-5 max-h-[70%]">
          <View className="flex-row justify-between items-center pb-3 border-b border-pekon-border/60">
            <View>
              <Text className="text-white font-bold text-base">Pilih Transaksi Aktif</Text>
              <Text className="text-pekon-muted text-xs">Pilih tugas yang ingin Anda sertakan bukti kerjanya</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#84958A" />
            </TouchableOpacity>
          </View>

          <ScrollView className="py-3">
            {transactions.length === 0 ? (
              <View className="p-6 items-center">
                <Text className="text-pekon-muted text-xs text-center">
                  Tidak ada transaksi berstatus aktif yang membutuhkan bukti foto saat ini.
                </Text>
                <Text className="text-pekon-subtle text-[11px] text-center mt-2">
                  Ambil tugas di Bursa Mini-Job atau sepakati transaksi hasil panen terlebih dahulu.
                </Text>
              </View>
            ) : (
              transactions.map((tx) => (
                <TouchableOpacity
                  key={tx.id}
                  className={`p-3.5 rounded-xl border mb-2.5 flex-row items-center justify-between ${
                    selectedTx?.id === tx.id
                      ? 'bg-pekon-card border-pekon-primary'
                      : 'bg-pekon-card/60 border-pekon-border'
                  }`}
                  onPress={() => onSelect(tx)}
                >
                  <View className="flex-1 mr-2">
                    <View className="flex-row items-center">
                      <Text className="text-white font-bold text-xs">{getTxTypeLabel(tx.type)}</Text>
                      <View className="ml-2 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
                        <Text className="text-amber-400 text-[9px] font-bold">{tx.status}</Text>
                      </View>
                    </View>
                    <Text className="text-pekon-muted text-[11px] mt-0.5">
                      Mitra: {tx.counterparty?.fullName || tx.initiator?.fullName || 'Warga Pekon'}
                    </Text>
                  </View>
                  <Text className="text-pekon-primary font-bold text-xs">
                    Rp {Number(tx.grossAmount).toLocaleString('id-ID')}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            className="bg-pekon-card border border-pekon-border py-3 rounded-xl items-center mt-2"
            onPress={onClose}
          >
            <Text className="text-pekon-muted font-bold text-xs">Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
