import React from 'react';
import { View } from 'react-native';
import {
  ArrowRight,
  Radio,
  RefreshCw,
  PackageCheck,
  User,
  Fuel,
  Phone,
} from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';

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
      <Card className="bg-card border-primary/40 p-4 mb-3">
        <View className="flex-row justify-between items-center pb-2.5 border-b border-border">
          <View className="flex-row items-center">
            <View className="w-2.5 h-2.5 rounded-full bg-primary mr-2" />
            <Text className="text-foreground font-bold text-sm">Rute Perjalanan Anda Aktif</Text>
          </View>
          <Button
            variant="destructive"
            size="xs"
            onPress={() => onFinishRoute(route.id)}
          >
            Akhiri Rute
          </Button>
        </View>

        {/* Geospatial Visualizer Route Line */}
        <View className="my-3 bg-muted/40 p-3.5 rounded-xl border border-border">
          <View className="flex-row items-center justify-between mb-3">
            <View className="items-start flex-1">
              <Text className="text-muted-foreground text-[10px] font-semibold">ASAL (START)</Text>
              <Text className="text-foreground font-bold text-xs mt-0.5">{route.originName}</Text>
            </View>
            <View className="px-2">
              <ArrowRight size={16} color="#10B981" />
            </View>
            <View className="items-end flex-1">
              <Text className="text-muted-foreground text-[10px] font-semibold">TUJUAN (FINISH)</Text>
              <Text className="text-foreground font-bold text-xs mt-0.5 text-right">{route.destinationName}</Text>
            </View>
          </View>

          {/* Progress Track */}
          <View className="relative h-2 bg-muted rounded-full my-1 justify-center">
            <View className="h-full bg-primary rounded-full w-3/5" />
            <View className="absolute left-[60%] w-4 h-4 bg-primary border-2 border-background rounded-full -ml-2 items-center justify-center">
              <View className="w-1.5 h-1.5 bg-background rounded-full" />
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-border/60">
            <Text className="text-muted-foreground text-[10px]">
              Koordinat Terakhir: {route.currentLat ? `${Number(route.currentLat).toFixed(4)}, ${Number(route.currentLng).toFixed(4)}` : 'Sesuai Asal'}
            </Text>
            {lastPingTime && (
              <Text className="text-primary text-[10px] font-medium">
                Ping {lastPingTime}
              </Text>
            )}
          </View>
        </View>

        {/* Live GPS Broadcast Switcher */}
        <View className="bg-muted/20 border border-border rounded-xl p-3 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center">
              <Radio size={14} color={isBroadcastingGps ? '#10B981' : '#84958A'} />
              <Text className="text-foreground font-bold text-xs ml-1.5">Live Broadcast GPS (15s)</Text>
            </View>
            <Text className="text-muted-foreground text-[10px] mt-0.5">
              {isBroadcastingGps
                ? 'Posisi kendaraan Anda otomatis disiarkan ke warga penitip'
                : 'Aktifkan agar warga dapat memantau kedatangan Anda'}
            </Text>
          </View>
          <Switch
            value={isBroadcastingGps}
            onValueChange={onToggleBroadcast}
            size="md"
          />
        </View>

        {/* Tombol Ping Manual */}
        <Button
          variant="outline"
          size="sm"
          onPress={onManualPing}
          className="mt-2.5 w-full flex-row items-center justify-center"
        >
          <RefreshCw size={12} color="#10B981" />
          <Text className="text-foreground font-semibold text-xs ml-1.5">Perbarui Posisi GPS Sekarang</Text>
        </Button>
      </Card>

      {/* Daftar Titipan Masuk dari Warga */}
      <View className="mt-2">
        <View className="flex-row justify-between items-center mb-2 px-1">
          <Text className="text-foreground font-semibold text-sm">Pesanan Titipan Masuk</Text>
          <Badge variant="outline" size="xs">
            {route.orders?.length || 0} Permintaan
          </Badge>
        </View>

        {(!route.orders || route.orders.length === 0) ? (
          <Card className="bg-card border-border p-5 items-center my-1">
            <PackageCheck size={28} color="#84958A" />
            <Text className="text-foreground font-semibold text-xs mt-2">Belum ada pesanan titipan masuk</Text>
            <Text className="text-muted-foreground text-[11px] text-center mt-1">
              Warga sekitar pekon Anda akan segera melihat rute ini dan mengajukan titipan barang.
            </Text>
          </Card>
        ) : (
          route.orders.map((order: any) => {
            const isRequested = order.status === 'REQUESTED';
            const isAccepted = order.status === 'ACCEPTED';

            return (
              <Card key={order.id} className="bg-card border-border p-3.5 mb-2.5">
                <View className="flex-row justify-between items-center pb-2 border-b border-border">
                  <View className="flex-row items-center">
                    <User size={13} color="#10B981" />
                    <Text className="text-foreground font-bold text-xs ml-1.5">
                      {order.requester?.fullName || 'Warga Penitip'}
                    </Text>
                  </View>
                  <Badge variant={isAccepted ? 'success' : 'warning'} size="xs">
                    {isAccepted ? 'TERKUNCI / DITERIMA' : 'MENUNGGU KONFIRMASI'}
                  </Badge>
                </View>

                <View className="my-2">
                  <Text className="text-foreground text-xs font-medium">{order.itemDescription}</Text>
                  <View className="flex-row items-center justify-between mt-1.5">
                    <View className="flex-row items-center">
                      <Fuel size={12} color="#10B981" />
                      <Text className="text-primary text-xs font-bold ml-1">
                        Rp {Number(order.fuelShareCost).toLocaleString('id-ID')}
                      </Text>
                      <Text className="text-muted-foreground text-[10px] ml-1">(Patungan Bensin)</Text>
                    </View>
                    {order.requester?.phoneNumber && (
                      <View className="flex-row items-center">
                        <Phone size={11} color="#84958A" />
                        <Text className="text-muted-foreground text-[10px] ml-1">{order.requester.phoneNumber}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {isRequested && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-1"
                    onPress={() => onAcceptOrder(order.id, order.requester?.fullName)}
                  >
                    Terima Titipan & Kunci Transaksi
                  </Button>
                )}
              </Card>
            );
          })
        )}
      </View>
    </View>
  );
};
