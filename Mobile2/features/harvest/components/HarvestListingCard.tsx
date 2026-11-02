import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Scale, Coins, Check } from 'lucide-react-native';

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
    <View className="bg-pekon-card border border-pekon-border rounded-xl p-4 mb-4">
      {/* Info Utama Komoditas */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text className="text-white font-bold text-base">{listing.commodityName}</Text>
          <Text className="text-pekon-muted text-xs mt-0.5">
            Petani: {listing.farmer?.fullName || 'Warga Pekon'} • Pekon: {listing.pekon?.namaPekon || 'Pringsewu'}
          </Text>
        </View>
        <View className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded items-end">
          <Text className="text-emerald-400 font-bold text-xs">
            Batas Rp {Number(listing.minPricePerKg).toLocaleString('id-ID')} / kg
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3 mt-2 text-xs">
        <View className="bg-pekon-surface px-2.5 py-1 rounded border border-pekon-border flex-row items-center">
          <Scale size={12} color="#00F2A9" />
          <Text className="text-slate-200 text-xs font-semibold ml-1.5">
            {Number(listing.estimatedKg).toLocaleString('id-ID')} kg
          </Text>
        </View>
        <Text className="text-pekon-subtle text-xs">
          Estimasi Total: Rp {(Number(listing.estimatedKg) * Number(listing.minPricePerKg)).toLocaleString('id-ID')}
        </Text>
      </View>

      {/* Tombol Ajukan Tawaran (Untuk Pengepul) */}
      <View className="flex-row items-center mt-3 pt-2.5 border-t border-pekon-border/60 justify-between">
        <Text className="text-pekon-muted text-xs font-semibold">
          {listing.bids?.length || 0} Penawaran Masuk
        </Text>
        <TouchableOpacity
          className="bg-pekon-surface border border-pekon-primary px-3 py-1.5 rounded-lg flex-row items-center"
          onPress={() => onPlaceBidPress(listing)}
          accessible={true}
          accessibilityLabel={`Ajukan penawaran harga untuk ${listing.commodityName}`}
        >
          <Coins size={13} color="#00F2A9" />
          <Text className="text-pekon-primary text-xs font-bold ml-1">Tawar Harga</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar Penawaran Masuk (Bids) */}
      {listing.bids && listing.bids.length > 0 && (
        <View className="mt-3 pt-2 border-t border-pekon-border/40 space-y-2">
          <Text className="text-[11px] font-bold text-pekon-subtle uppercase tracking-wider mb-1">
            Daftar Penawaran Pengepul:
          </Text>
          {listing.bids.map((bid: any) => (
            <View
              key={bid.id}
              className="bg-pekon-surface/80 p-2.5 rounded-lg border border-pekon-border/60 flex-row items-center justify-between"
            >
              <View className="flex-1 mr-2">
                <View className="flex-row items-center">
                  <Text className="text-white font-semibold text-xs">
                    {bid.collector?.fullName || 'Pengepul Mitra'}
                  </Text>
                  {bid.collector?.isTrustedCollector && (
                    <View className="ml-1.5 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                      <Text className="text-emerald-400 text-[9px] font-bold">TERPERCAYA</Text>
                    </View>
                  )}
                </View>
                <Text className="text-pekon-primary font-bold text-xs mt-0.5">
                  Rp {Number(bid.offeredPricePerKg).toLocaleString('id-ID')} / kg
                </Text>
              </View>

              <TouchableOpacity
                className="bg-emerald-600 px-2.5 py-1 rounded-md flex-row items-center"
                onPress={() => onAcceptBid(bid.id, listing.commodityName, bid.offeredPricePerKg)}
                accessible={true}
                accessibilityLabel={`Terima tawaran dari ${bid.collector?.fullName}`}
              >
                <Check size={12} color="#FFFFFF" />
                <Text className="text-white text-[11px] font-bold ml-1">Terima & Kunci</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
