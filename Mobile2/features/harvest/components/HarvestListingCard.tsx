import React from 'react';
import { View } from 'react-native';
import { Scale, Coins, Check } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface HarvestListingCardProps {
  listing: any;
  onPlaceBidPress: (listing: any) => void;
  onAcceptBid: (bidId: string, commodityName: string, offeredPrice: number) => void;
}

export const HarvestListingCard: React.FC<HarvestListingCardProps> = ({
  listing,
  onPlaceBidPress,
  onAcceptBid,
}) => {
  return (
    <Card className="bg-card border-border p-4 mb-4">
      {/* Info Utama Komoditas */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text className="text-foreground font-bold text-base">{listing.commodityName}</Text>
          <Text className="text-muted-foreground text-xs mt-0.5">
            Petani: {listing.farmer?.fullName || 'Warga Pekon'} • Pekon: {listing.pekon?.namaPekon || 'Pringsewu'}
          </Text>
        </View>
        <Badge variant="success" size="sm">
          Batas Rp {Number(listing.minPricePerKg).toLocaleString('id-ID')} / kg
        </Badge>
      </View>

      <View className="flex-row items-center gap-3 mt-2.5">
        <View className="bg-muted/40 px-2.5 py-1 rounded-md border border-border flex-row items-center">
          <Scale size={12} color="#10B981" />
          <Text className="text-foreground text-xs font-semibold ml-1.5">
            {Number(listing.estimatedKg).toLocaleString('id-ID')} kg
          </Text>
        </View>
        <Text className="text-muted-foreground text-xs">
          Estimasi Total: Rp {(Number(listing.estimatedKg) * Number(listing.minPricePerKg)).toLocaleString('id-ID')}
        </Text>
      </View>

      {/* Tombol Ajukan Tawaran (Untuk Pengepul) */}
      <View className="flex-row items-center mt-3 pt-2.5 border-t border-border justify-between">
        <Text className="text-muted-foreground text-xs font-medium">
          {listing.bids?.length || 0} Penawaran Masuk
        </Text>
        <Button
          variant="outline"
          size="sm"
          onPress={() => onPlaceBidPress(listing)}
          className="flex-row items-center"
        >
          <Coins size={13} color="#10B981" />
          <Text className="text-primary text-xs font-bold ml-1">Tawar Harga</Text>
        </Button>
      </View>

      {/* Daftar Penawaran Masuk (Bids) */}
      {listing.bids && listing.bids.length > 0 && (
        <View className="mt-3 pt-2.5 border-t border-border/80 gap-2">
          <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
            Daftar Penawaran Pengepul:
          </Text>
          {listing.bids.map((bid: any) => (
            <Card
              key={bid.id}
              className="bg-muted/20 p-2.5 border-border flex-row items-center justify-between"
            >
              <View className="flex-1 mr-2">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-foreground font-semibold text-xs">
                    {bid.collector?.fullName || 'Pengepul Mitra'}
                  </Text>
                  {bid.collector?.isTrustedCollector && (
                    <Badge variant="success" size="xs">
                      TERPERCAYA
                    </Badge>
                  )}
                </View>
                <Text className="text-primary font-bold text-xs mt-0.5">
                  Rp {Number(bid.offeredPricePerKg).toLocaleString('id-ID')} / kg
                </Text>
              </View>

              <Button
                variant="primary"
                size="xs"
                onPress={() => onAcceptBid(bid.id, listing.commodityName, bid.offeredPricePerKg)}
                className="flex-row items-center"
              >
                <Check size={12} color="#FFFFFF" />
                <Text className="text-primary-foreground text-[11px] font-bold ml-1">Terima & Kunci</Text>
              </Button>
            </Card>
          ))}
        </View>
      )}
    </Card>
  );
};
