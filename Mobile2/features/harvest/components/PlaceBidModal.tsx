import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';

interface PlaceBidModalProps {
  visible: boolean;
  listing: any | null;
  onClose: () => void;
  onSubmit: (data: { offeredPricePerKg: number; referralUsedCode?: string }) => Promise<void>;
  submitting: boolean;
}

export const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  visible,
  listing,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [bidPrice, setBidPrice] = useState('');
  const [bidReferralCode, setBidReferralCode] = useState('');

  useEffect(() => {
    if (listing) {
      setBidPrice(String(listing.minPricePerKg || ''));
      setBidReferralCode('');
    }
  }, [listing]);

  const handleSubmit = async () => {
    const price = parseFloat(bidPrice);
    await onSubmit({
      offeredPricePerKg: price,
      referralUsedCode: bidReferralCode.trim() || undefined,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black/80 justify-end"
      >
        <View className="bg-pekon-surface rounded-t-3xl border-t border-pekon-border p-5 space-y-4">
          <View className="flex-row justify-between items-center pb-2 border-b border-pekon-border/60">
            <View>
              <Text className="text-white font-bold text-base">Ajukan Penawaran Harga</Text>
              <Text className="text-pekon-muted text-xs">
                {listing?.commodityName} ({listing?.estimatedKg} kg)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#84958A" />
            </TouchableOpacity>
          </View>

          <View className="bg-pekon-card p-3 rounded-xl border border-pekon-border/70">
            <Text className="text-pekon-subtle text-[11px]">Batas Bawah Harga Petani:</Text>
            <Text className="text-emerald-400 font-bold text-sm">
              Rp {Number(listing?.minPricePerKg || 0).toLocaleString('id-ID')} / kg
            </Text>
          </View>

          <View className="space-y-3">
            <View>
              <Text className="text-slate-300 text-xs font-semibold mb-1">Harga Beli yang Anda Tawarkan (Rp/Kg)</Text>
              <TextInput
                className="bg-pekon-card border border-pekon-primary rounded-xl p-3 text-white text-xs font-bold"
                placeholder="Misal: 2700"
                placeholderTextColor="#84958A"
                keyboardType="numeric"
                value={bidPrice}
                onChangeText={setBidPrice}
              />
            </View>

            <View>
              <Text className="text-slate-300 text-xs font-semibold mb-1">Kode Referral Mitra (Opsional)</Text>
              <TextInput
                className="bg-pekon-card border border-pekon-border rounded-xl p-3 text-white text-xs font-mono"
                placeholder="Misal: JUJUR-SURATNO"
                placeholderTextColor="#84958A"
                autoCapitalize="characters"
                value={bidReferralCode}
                onChangeText={setBidReferralCode}
              />
              <Text className="text-pekon-subtle text-[10px] mt-1">
                Pemberi referral akan menerima komisi mikro Rp 5.000 + poin reputasi setelah transaksi terverifikasi.
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3 pt-2">
            <TouchableOpacity
              className="flex-1 bg-pekon-card border border-pekon-border py-3 rounded-xl items-center"
              onPress={onClose}
            >
              <Text className="text-pekon-muted font-bold text-xs">Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-pekon-primary py-3 rounded-xl items-center flex-row justify-center"
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#0F1416" />
              ) : (
                <Text className="text-pekon-bg font-bold text-xs">Kirim Tawaran</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
