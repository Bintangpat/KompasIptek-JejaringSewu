import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TrendingUp, Users } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

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
    if (isNaN(price) || price <= 0) return;
    await onSubmit({
      offeredPricePerKg: price,
      referralUsedCode: bidReferralCode.trim() || undefined,
    });
  };

  return (
    <BottomSheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Content>
        <BottomSheet.Header title="Ajukan Penawaran Harga" />

        <BottomSheet.Body>
          <View className="gap-3.5 py-1">
            {listing && (
              <Card className="bg-card border-border p-3">
                <Text className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  Komoditas Terpilih
                </Text>
                <Text className="text-foreground font-bold text-sm mt-0.5">
                  {listing.commodityName} ({Number(listing.estimatedKg).toLocaleString('id-ID')} kg)
                </Text>
                <View className="mt-2 pt-2 border-t border-border flex-row justify-between items-center">
                  <Text className="text-muted-foreground text-xs">Batas Bawah Petani:</Text>
                  <Text className="text-primary font-bold text-sm">
                    Rp {Number(listing.minPricePerKg || 0).toLocaleString('id-ID')} / kg
                  </Text>
                </View>
              </Card>
            )}

            <Input
              label="Harga Beli yang Anda Tawarkan (Rp/Kg) *"
              placeholder="Misal: 2700"
              keyboardType="numeric"
              value={bidPrice}
              onChangeText={setBidPrice}
            />

            <View>
              <Input
                label="Kode Referral Mitra (Opsional)"
                placeholder="Misal: JUJUR-SURATNO"
                autoCapitalize="characters"
                value={bidReferralCode}
                onChangeText={setBidReferralCode}
              />
              <View className="flex-row items-center mt-1.5 px-0.5">
                <Users size={12} color="#84958A" />
                <Text className="text-muted-foreground text-[10px] ml-1.5 flex-1">
                  Pemberi referral menerima komisi mikro Rp 5.000 + poin reputasi setelah transaksi terverifikasi.
                </Text>
              </View>
            </View>
          </View>
        </BottomSheet.Body>

        <BottomSheet.Footer>
          <Button
            variant="primary"
            size="lg"
            loading={submitting}
            onPress={handleSubmit}
            className="w-full"
          >
            Kirimkan Penawaran Resmi
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
