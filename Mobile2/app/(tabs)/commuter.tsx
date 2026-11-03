import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Fuel, Navigation, PlusCircle } from 'lucide-react-native';
import * as Location from 'expo-location';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { AuthWallSheet } from '@/components/ui/auth-wall-sheet';
import { useAuthProtection } from '@/hooks/use-auth-protection';

import { useCommuterStore } from '@/features/commuter/store';
import { commuterApi } from '@/features/commuter/api';
import {
  CommuterModeSwitcher,
  CommuterRouteCard,
  DriverRouteCard,
  CreateRouteModal,
  CreateOrderModal,
} from '@/features/commuter/components';

export default function CommuterScreen() {
  const {
    isAuthWallOpen,
    setIsAuthWallOpen,
    authWallProps,
    protectedAction,
  } = useAuthProtection();

  const {
    activeMode,
    setActiveMode,
    activeRoute,
    setActiveRoute,
    nearbyRoutes,
    setNearbyRoutes,
    radiusKm,
    setRadiusKm,
    isBroadcastingGps,
    setIsBroadcastingGps,
    lastPingTime,
    setLastPingTime,
    finishActiveRoute,
  } = useCommuterStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  // Modals
  const [isCreateRouteModalOpen, setIsCreateRouteModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedRouteForOrder, setSelectedRouteForOrder] = useState<any | null>(null);
  const [submittingRoute, setSubmittingRoute] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Dapatkan Lokasi GPS
  const detectUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return { lat: -5.3582, lng: 104.9744 };
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setCurrentCoords(coords);
      setGpsAccuracy(loc.coords.accuracy ? Math.round(loc.coords.accuracy) : null);
      return coords;
    } catch {
      const fallback = { lat: -5.3582, lng: 104.9744 };
      setCurrentCoords(fallback);
      return fallback;
    }
  };

  // 2. Fetch Data
  const fetchData = async () => {
    try {
      const coords = currentCoords || (await detectUserLocation()) || { lat: -5.3582, lng: 104.9744 };

      try {
        const routes = await commuterApi.getNearbyRoutes({
          lat: coords.lat,
          lng: coords.lng,
          radiusKm,
        });
        setNearbyRoutes(routes);
      } catch (err: any) {
        console.warn('Gagal memuat rute komuter nearby:', err.message);
      }

      // Restore / fetch active route
      const storedRouteId = await commuterApi.getStoredActiveRouteId();
      if (storedRouteId && !activeRoute) {
        useCommuterStore.getState().restoreActiveRoute();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    detectUserLocation().then(() => fetchData());
  }, [radiusKm]);

  // 3. Ping GPS Function
  const sendGpsPing = async (routeId: string) => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      await commuterApi.pingGps(routeId, {
        currentLat: loc.coords.latitude,
        currentLng: loc.coords.longitude,
      });
      const now = new Date();
      setLastPingTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
    } catch (err: any) {
      console.warn('Gagal ping GPS:', err.message);
    }
  };

  // 4. Toggle GPS Broadcast
  const toggleGpsBroadcast = (enable: boolean) => {
    if (!activeRoute) return;
    setIsBroadcastingGps(enable);
    if (enable) {
      sendGpsPing(activeRoute.id);
      pingIntervalRef.current = setInterval(() => {
        sendGpsPing(activeRoute.id);
      }, 15000);
      Alert.alert('GPS Broadcast Aktif', 'Koordinat Anda disiarkan ke warga penitip setiap 15 detik.');
    } else {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      Alert.alert('GPS Broadcast Nonaktif', 'Penyiaran posisi otomatis dijeda.');
    }
  };

  useEffect(() => {
    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, []);

  // 5. Handlers
  const handleStartRoute = async (formData: {
    originName: string;
    destinationName: string;
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    vehicleType: string;
  }) => {
    if (!formData.originName.trim() || !formData.destinationName.trim()) {
      Alert.alert('Peringatan', 'Mohon isi nama asal dan tujuan pekon perjalanan Anda.');
      return;
    }

    setSubmittingRoute(true);
    try {
      const newRoute = await commuterApi.startRoute(formData);
      Alert.alert('Rute Berhasil Dibuka', `Rute ${formData.originName} -> ${formData.destinationName} telah aktif.`);
      setIsCreateRouteModalOpen(false);
      setActiveRoute(newRoute);
      setActiveMode('kurir');
      fetchData();
    } catch (err: any) {
      Alert.alert('Gagal Buka Rute', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmittingRoute(false);
    }
  };

  const handleFinishRoute = async (routeId: string) => {
    Alert.alert(
      'Selesaikan Perjalanan',
      'Apakah Anda sudah sampai di tujuan akhir dan menyelesaikan seluruh pengantaran?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Selesai',
          onPress: async () => {
            try {
              if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
                pingIntervalRef.current = null;
              }
              await commuterApi.finishRoute(routeId);
              await finishActiveRoute();
              Alert.alert('Perjalanan Selesai', 'Rute komuter telah ditutup. Terima kasih telah membantu logistik pekon!');
              fetchData();
            } catch (e: any) {
              Alert.alert('Gagal', e.message || 'Gagal menyelesaikan rute.');
            }
          },
        },
      ]
    );
  };

  const handleSendOrder = async (itemDescription: string, fuelShareCost: string) => {
    if (!selectedRouteForOrder) return;
    if (!itemDescription.trim()) {
      Alert.alert('Peringatan', 'Mohon tuliskan deskripsi barang titipan Anda.');
      return;
    }

    const cost = parseInt(fuelShareCost, 10);
    if (isNaN(cost) || cost < 1000) {
      Alert.alert('Peringatan', 'Patungan bensin minimal Rp 1.000.');
      return;
    }

    setSubmittingOrder(true);
    try {
      const coords = currentCoords || (await detectUserLocation()) || { lat: -5.3582, lng: 104.9744 };
      await commuterApi.createJastipOrder(selectedRouteForOrder.id, {
        itemDescription,
        fuelShareCost: cost,
        pickupLat: coords.lat,
        pickupLng: coords.lng,
      });

      Alert.alert('Pesanan Dikirim!', 'Permintaan titip barang berhasil diteruskan ke kurir komuter.', [
        { text: 'OK', onPress: () => setIsOrderModalOpen(false) },
      ]);
      fetchData();
    } catch (e: any) {
      Alert.alert('Gagal Mengirim Titipan', e.message || 'Gagal membuat pesanan.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleAcceptOrder = async (orderId: string, requesterName?: string) => {
    protectedAction(() => {
      Alert.alert(
        'Konfirmasi Titipan',
        `Apakah Anda bersedia membawa titipan dari ${requesterName || 'warga'} dan mengunci transaksi patungan bensin?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Terima Titipan',
            onPress: async () => {
              try {
                await commuterApi.acceptJastipOrder(orderId);
                Alert.alert('Sukses', 'Titipan jastip diterima! Transaksi telah terkunci.');
                fetchData();
              } catch (e: any) {
                Alert.alert('Gagal', e.message || 'Gagal menerima pesanan.');
              }
            },
          },
        ]
      );
    }, {
      title: 'Terima Pesanan Jastip',
      description: 'Masuk dengan akun warga untuk menerima pesanan dan mengunci saldo patungan bensin di buku besar pekon.',
    });
  };

  return (
    <View className="flex-1 bg-background">
      <CommuterModeSwitcher
        activeTab={activeMode}
        setActiveTab={setActiveMode}
        gpsAccuracy={gpsAccuracy}
        hasActiveRoute={!!activeRoute}
      />

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchData();
            }}
            tintColor="#10B981"
          />
        }
      >
        {activeMode === 'warga' ? (
          <View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-foreground font-semibold text-sm">Rute Aktif Sekitar Anda</Text>
              <View className="flex-row gap-1.5">
                {[10, 25, 50].map((km) => (
                  <TouchableOpacity
                    key={km}
                    onPress={() => setRadiusKm(km)}
                    className={`px-2.5 py-1 rounded-full border ${radiusKm === km ? 'bg-primary/20 border-primary' : 'bg-card border-border'}`}
                  >
                    <Text className={`text-[10px] font-bold ${radiusKm === km ? 'text-primary' : 'text-muted-foreground'}`}>
                      {km} km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {loading ? (
              <View className="my-8 items-center">
                <Spinner size="lg" />
              </View>
            ) : nearbyRoutes.length === 0 ? (
              <Card className="bg-card border-border p-6 items-center my-4">
                <Fuel size={36} color="#84958A" />
                <Text className="text-foreground font-semibold text-sm mt-3">Belum ada rute komuter aktif</Text>
                <Text className="text-muted-foreground text-xs text-center mt-1 leading-relaxed">
                  Belum ada pengemudi searah dalam radius {radiusKm} km. Anda bisa beralih ke tab Kurir untuk membuka rute perjalanan!
                </Text>
                <Button
                  variant="primary"
                  size="md"
                  className="mt-4"
                  onPress={() => {
                    protectedAction(() => {
                      setActiveMode('kurir');
                      setIsCreateRouteModalOpen(true);
                    }, {
                      title: 'Buka Rute Sebagai Kurir',
                      description: 'Masuk dengan akun warga untuk membuka rute perjalanan dan berbagi bensin dengan warga pekon.',
                    });
                  }}
                >
                  Buka Rute Sebagai Kurir
                </Button>
              </Card>
            ) : (
              nearbyRoutes.map((item) => (
                <CommuterRouteCard
                  key={item.id}
                  route={item}
                  onOrderPress={(route) => {
                    protectedAction(() => {
                      setSelectedRouteForOrder(route);
                      setIsOrderModalOpen(true);
                    }, {
                      title: 'Titip Barang Jastip Pekon',
                      description: 'Masuk dengan akun warga agar kurir dapat melihat titik jemput dan mengantarkan barang titipan Anda.',
                    });
                  }}
                />
              ))
            )}
          </View>
        ) : (
          <View>
            {!activeRoute ? (
              <Card className="bg-card border-border p-5 items-center my-2">
                <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mb-3">
                  <Navigation size={28} color="#10B981" />
                </View>
                <Text className="text-foreground font-bold text-base text-center">Anda Belum Membuka Rute Hari Ini</Text>
                <Text className="text-muted-foreground text-xs text-center mt-1 leading-relaxed">
                  Apakah Anda hendak bepergian dari pekon ke pasar atau kantor kota? Buka rute perjalanan Anda untuk membawa titipan barang tetangga dan dapatkan patungan bensin otomatis!
                </Text>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-5 w-full flex-row items-center justify-center"
                  onPress={() => {
                    protectedAction(() => {
                      setIsCreateRouteModalOpen(true);
                    }, {
                      title: 'Buka Rute Perjalanan Baru',
                      description: 'Masuk dengan akun warga untuk membuka rute perjalanan komuter dan menyiarkan GPS searah.',
                    });
                  }}
                >
                  <PlusCircle size={16} color="#FFFFFF" />
                  <Text className="text-primary-foreground font-bold text-xs ml-1.5">Buka Rute Perjalanan Baru</Text>
                </Button>
              </Card>
            ) : (
              <DriverRouteCard
                route={activeRoute}
                isBroadcastingGps={isBroadcastingGps}
                lastPingTime={lastPingTime}
                onToggleBroadcast={toggleGpsBroadcast}
                onManualPing={() => sendGpsPing(activeRoute.id)}
                onFinishRoute={handleFinishRoute}
                onAcceptOrder={handleAcceptOrder}
              />
            )}
          </View>
        )}
      </ScrollView>

      <CreateRouteModal
        visible={isCreateRouteModalOpen}
        onClose={() => setIsCreateRouteModalOpen(false)}
        onSubmit={handleStartRoute}
        submitting={submittingRoute}
      />

      <CreateOrderModal
        visible={isOrderModalOpen}
        selectedRoute={selectedRouteForOrder}
        currentCoords={currentCoords}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleSendOrder}
        submitting={submittingOrder}
      />

      <AuthWallSheet
        open={isAuthWallOpen}
        onOpenChange={setIsAuthWallOpen}
        {...authWallProps}
      />
    </View>
  );
}
