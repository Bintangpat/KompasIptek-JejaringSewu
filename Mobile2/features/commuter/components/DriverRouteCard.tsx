import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import {
  ArrowRight,
  Radio,
  RefreshCw,
  PackageCheck,
  User,
  Fuel,
  Phone,
} from 'lucide-react-native';

interface DriverRouteCardProps {
  route: any;
  isBroadcastingGps: boolean;
  lastPingTime: string | null;
  onToggleBroadcast: (enable: boolean) => void;
  onManualPing: () => void;
  onFinishRoute: (routeId: string) => void;
  onAcceptOrder: (orderId: string, requesterName?: string) => void;
}

export const DriverRouteCard: React.FC<DriverRouteCardProps> = ({
  route,
  isBroadcastingGps,
  lastPingTime,
  onToggleBroadcast,
  onManualPing,
  onFinishRoute,
  onAcceptOrder,
}) => {
  return (
    <View>
      {/* Status Card Rute Aktif */}
      <View className="bg-pekon-card border border-pekon-primary/60 rounded-xl p-4 mb-3">
        <View className="flex-row justify-between items-center pb-2 border-b border-pekon-border">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-emerald-400 mr-2" />
            <Text className="text-white font-bold text-sm">Rute Perjalanan Anda Aktif</Text>
          </View>
          <TouchableOpacity
            onPress={() => onFinishRoute(route.id)}
            className="bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-lg"
          >
            <Text className="text-red-400 text-[10px] font-bold">Akhiri Rute</Text>
          </TouchableOpacity>
        </View>

        {/* Geospatial Visualizer Route Line */}
        <View className="my-3 bg-pekon-bg p-3.5 rounded-xl border border-pekon-border">
          <View className="flex-row items-center justify-between mb-3">
            <View className="items-start flex-1">
              <Text className="text-pekon-muted text-[10px] font-semibold">ASAL (START)</Text>
              <Text className="text-white font-bold text-xs mt-0.5">{route.originName}</Text>
            </View>
            <View className="px-2">
              <ArrowRight size={16} color="#00F2A9" />
            </View>
            <View className="items-end flex-1">
              <Text className="text-pekon-muted text-[10px] font-semibold">TUJUAN (FINISH)</Text>
              <Text className="text-white font-bold text-xs mt-0.5 text-right">{route.destinationName}</Text>
            </View>
          </View>

          {/* Progress Track */}
          <View className="relative h-2 bg-pekon-surface rounded-full my-1 justify-center">
            <View className="h-full bg-gradient-to-r from-pekon-primary to-emerald-400 rounded-full w-3/5" />
            <View className="absolute left-[60%] w-4 h-4 bg-pekon-primary border-2 border-pekon-bg rounded-full -ml-2 items-center justify-center">
              <View className="w-1.5 h-1.5 bg-pekon-bg rounded-full" />
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-pekon-border/50">
            <Text className="text-pekon-subtle text-[10px]">
              Koordinat Terakhir: {route.currentLat ? `${Number(route.currentLat).toFixed(4)}, ${Number(route.currentLng).toFixed(4)}` : 'Sesuai Asal'}
            </Text>
            {lastPingTime && (
              <Text className="text-pekon-primary text-[10px] font-medium">
                Ping {lastPingTime}
              </Text>
            )}
          </View>
        </View>

        {/* Live GPS Broadcast Switcher */}
        <View className="bg-pekon-surface/70 border border-pekon-border rounded-xl p-3 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center">
              <Radio size={14} color={isBroadcastingGps ? '#00F2A9' : '#84958A'} />
              <Text className="text-white font-bold text-xs ml-1.5">Live Broadcast GPS (15s)</Text>
            </View>
            <Text className="text-pekon-muted text-[10px] mt-0.5">
              {isBroadcastingGps
                ? 'Posisi kendaraan Anda otomatis disiarkan ke warga penitip'
                : 'Aktifkan agar warga dapat memantau kedatangan Anda'}
            </Text>
          </View>
          <Switch
            value={isBroadcastingGps}
            onValueChange={onToggleBroadcast}
            trackColor={{ false: '#262D30', true: '#00F2A9' }}
            thumbColor={isBroadcastingGps ? '#0F1416' : '#84958A'}
          />
        </View>

        {/* Tombol Ping Manual */}
        <TouchableOpacity
          className="mt-2.5 bg-pekon-surface border border-pekon-border py-2 rounded-xl flex-row items-center justify-center"
          onPress={onManualPing}
        >
          <RefreshCw size={13} color="#00F2A9" />
          <Text className="text-pekon-primary font-bold text-xs ml-1.5">Perbarui Posisi GPS Sekarang</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar Titipan Masuk dari Warga */}
      <View className="mt-2">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white font-semibold text-sm">Pesanan Titipan Masuk</Text>
          <View className="bg-pekon-card px-2 py-0.5 rounded-full border border-pekon-border">
            <Text className="text-pekon-primary text-[10px] font-bold">
              {route.orders?.length || 0} Permintaan
            </Text>
          </View>
        </View>

        {(!route.orders || route.orders.length === 0) ? (
          <View className="bg-pekon-card border border-pekon-border rounded-xl p-5 items-center my-1">
            <PackageCheck size={28} color="#84958A" />
            <Text className="text-pekon-text font-semibold text-xs mt-2">Belum ada pesanan titipan masuk</Text>
            <Text className="text-pekon-subtle text-[11px] text-center mt-1">
              Warga sekitar pekon Anda akan segera melihat rute ini dan mengajukan titipan barang.
            </Text>
          </View>
        ) : (
          route.orders.map((order: any) => {
            const isRequested = order.status === 'REQUESTED';
            const isAccepted = order.status === 'ACCEPTED';

            return (
              <View key={order.id} className="bg-pekon-card border border-pekon-border rounded-xl p-3.5 mb-2.5">
                <View className="flex-row justify-between items-center pb-2 border-b border-pekon-border/60">
                  <View className="flex-row items-center">
                    <User size={13} color="#00F2A9" />
                    <Text className="text-white font-bold text-xs ml-1.5">
                      {order.requester?.fullName || 'Warga Penitip'}
                    </Text>
                  </View>
                  <View className={`px-2 py-0.5 rounded border ${isAccepted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                    <Text className={`text-[10px] font-bold ${isAccepted ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isAccepted ? 'TERKUNCI / DITERIMA' : 'MENUNGGU KONFIRMASI'}
                    </Text>
                  </View>
                </View>

                <View className="my-2">
                  <Text className="text-pekon-text text-xs font-semibold">{order.itemDescription}</Text>
                  <View className="flex-row items-center justify-between mt-1.5">
                    <View className="flex-row items-center">
                      <Fuel size={12} color="#00F2A9" />
                      <Text className="text-pekon-primary text-xs font-bold ml-1">
                        Rp {Number(order.fuelShareCost).toLocaleString('id-ID')}
                      </Text>
                      <Text className="text-pekon-muted text-[10px] ml-1">(Patungan Bensin)</Text>
                    </View>
                    {order.requester?.phoneNumber && (
                      <View className="flex-row items-center">
                        <Phone size={11} color="#84958A" />
                        <Text className="text-pekon-muted text-[10px] ml-1">{order.requester.phoneNumber}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {isRequested && (
                  <TouchableOpacity
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Terima titipan dari ${order.requester?.fullName || 'warga'}`}
                    className="mt-1 bg-pekon-primary py-2 rounded-lg items-center"
                    onPress={() => onAcceptOrder(order.id, order.requester?.fullName)}
                  >
                    <Text className="text-pekon-bg font-bold text-xs">Terima Titipan & Kunci Transaksi</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};
