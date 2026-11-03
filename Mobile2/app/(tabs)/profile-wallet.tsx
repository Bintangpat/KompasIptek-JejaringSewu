import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { WifiOff, Type, LogIn, UserCheck } from 'lucide-react-native';
import NetInfo from '@react-native-community/netinfo';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { AuthWallSheet } from '@/components/ui/auth-wall-sheet';
import { useAuthProtection } from '@/hooks/use-auth-protection';

import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/api';
import {
  queueOfflineTask,
  getPendingOfflineTasks,
  markTaskCompleted,
  OfflineTask,
} from '@/services/sqlite.service';

import { walletApi } from '@/features/wallet/api';
import { WalletBalanceCard, LedgerHistoryList } from '@/features/wallet/components';

import { creditScoringApi } from '@/features/credit-scoring/api';
import { CreditScoreCard } from '@/features/credit-scoring/components';

import { nutritionApi } from '@/features/nutrition/api';
import {
  NutritionInterventionBanner,
  NutritionCatalogModal,
} from '@/features/nutrition/components';

const FALLBACK_NUTRITION_PACKAGES = [
  {
    id: 'pkg-stunting-01',
    packageName: 'Paket Gizi Ibu & Balita A',
    description: '1 kg Telur Bebek Pekon + 2 kg Ikan Nila Segar Pagelaran + 1 ikat Bayam Organik.',
    pointCost: 25,
    stock: 18,
    pickupLocation: 'Kantor BUMDes Pagelaran',
  },
  {
    id: 'pkg-stunting-02',
    packageName: 'Paket Protein Hewani Super B',
    description: '1 kg Daging Ayam Kampung + 1 Liter Susu Kambing Etawa Sukoharjo.',
    pointCost: 35,
    stock: 12,
    pickupLocation: 'Puskesmas Pembantu Sukoharjo',
  },
  {
    id: 'pkg-stunting-03',
    packageName: 'Paket Pangan Nabati & Kelor C',
    description: '2 kg Beras Merah Organik + Ekstrak Bubuk Daun Kelor Anti-Stunting.',
    pointCost: 20,
    stock: 25,
    pickupLocation: 'Posyandu Pekon Banyumas',
  },
];

export default function ProfileWalletScreen() {
  const router = useRouter();
  const { user, loginAsDemoWarga, logout } = useAuth();
  const {
    isAuthWallOpen,
    setIsAuthWallOpen,
    authWallProps,
    protectedAction,
  } = useAuthProtection();

  const [wallet, setWallet] = useState<any>(null);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [creditScore, setCreditScore] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Aksesibilitas Lansia
  const [isLargeFont, setIsLargeFont] = useState(false);

  // Jaringan & Offline Queue
  const [isOnline, setIsOnline] = useState(true);
  const [pendingTasks, setPendingTasks] = useState<OfflineTask[]>([]);
  const [syncingOffline, setSyncingOffline] = useState(false);

  // Modal Katalog Gizi
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [nutritionPackages, setNutritionPackages] = useState<any[]>(FALLBACK_NUTRITION_PACKAGES);
  const [loadingNutrition, setLoadingNutrition] = useState(false);
  const [redeemingPackageId, setRedeemingPackageId] = useState<string | null>(null);

  // Filter Ledger Mutasi
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'IDR' | 'POINTS'>('ALL');

  // 1. Data Fetchers
  const loadOfflineTasks = async () => {
    try {
      const tasks = await getPendingOfflineTasks();
      setPendingTasks(tasks || []);
    } catch {
      // Ignore initial DB read
    }
  };

  const fetchWalletAndScore = async () => {
    try {
      const [walletRes, scoreRes] = await Promise.all([
        walletApi.getMyWallet().catch(() => null),
        creditScoringApi.getMyScore().catch(() => null),
      ]);

      if (walletRes) {
        setWallet(walletRes);
        if (walletRes.recentLedgerEntries) {
          setLedgerEntries(walletRes.recentLedgerEntries);
        }
      }
      if (scoreRes) {
        setCreditScore(scoreRes);
      }
    } catch (e: any) {
      console.warn('Gagal memuat wallet/score:', e.message);
    } finally {
      setRefreshing(false);
    }
  };

  const syncPendingTasks = async () => {
    try {
      const tasks = await getPendingOfflineTasks();
      if (!tasks || tasks.length === 0) return;

      setSyncingOffline(true);
      for (const task of tasks) {
        try {
          const payload = JSON.parse(task.payload);
          if (task.method === 'POST') {
            await apiClient.post(task.endpoint, payload, {
              headers: { 'x-idempotency-key': task.idempotency_key },
            });
          } else if (task.method === 'PATCH') {
            await apiClient.patch(task.endpoint, payload, {
              headers: { 'x-idempotency-key': task.idempotency_key },
            });
          }
          await markTaskCompleted(task.id);
        } catch (err: any) {
          console.warn('Gagal sync task offline:', task.id, err.message);
        }
      }
      await loadOfflineTasks();
      fetchWalletAndScore();
    } finally {
      setSyncingOffline(false);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      if (online) {
        syncPendingTasks();
      }
    });

    loadOfflineTasks();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchWalletAndScore();
  }, [user]);

  // 2. Fetch Paket Gizi Stunting
  const fetchNutritionPackages = async () => {
    setLoadingNutrition(true);
    try {
      const packages = await nutritionApi.getPackages();
      if (packages && packages.length > 0) {
        setNutritionPackages(packages);
      } else {
        setNutritionPackages(FALLBACK_NUTRITION_PACKAGES);
      }
    } catch {
      setNutritionPackages(FALLBACK_NUTRITION_PACKAGES);
    } finally {
      setLoadingNutrition(false);
    }
  };

  // 3. Handle Klaim Modal BUMDes
  const handleClaimBumdesLoan = async () => {
    protectedAction(() => {
      Alert.alert(
        'Plafon Modal Usaha BUMDes',
        'Selamat! Skor kredit alternatif Anda mencapai Grade A (≥85). Anda berhak mengajukan modal kerja BUMDes Rp 1.500.000 dengan margin mikro 0% dan tanpa agunan fisik.',
        [
          { text: 'Tutup', style: 'cancel' },
          {
            text: 'Ajukan ke BUMDes',
            onPress: () => {
              Alert.alert(
                'Pengajuan Terkirim',
                'Permohonan modal telah dikirimkan ke Admin BUMDes Pekon. Silakan verifikasi fisik singkat di balai pekon.'
              );
            },
          },
        ]
      );
    }, {
      title: 'Klaim Modal Usaha BUMDes',
      description: 'Masuk dengan akun warga agar riwayat skor kredit AHP-TOPSIS dan rekomendasi plafon Anda dapat diproses oleh pengurus BUMDes.',
    });
  };

  // 4. Handle Tukar Poin Pangan Stunting
  const handleRedeemPackage = async (pkg: any) => {
    protectedAction(() => {
      const currentPoints = wallet?.pointsBalance ? Number(wallet.pointsBalance) : 50;

      if (currentPoints < pkg.pointCost) {
        Alert.alert(
          'Poin Belum Cukup',
          `Poin Anda (${currentPoints} PTS) belum mencukupi untuk menebus paket ini (${pkg.pointCost} PTS). Tingkatkan aktivitas kerja fisik (PoW) atau selesaikan mini-job.`
        );
        return;
      }

      Alert.alert(
        'Konfirmasi Penebusan Gizi',
        `Tukarkan ${pkg.pointCost} Poin Reputasi untuk "${pkg.packageName}"?\n\nLokasi pengambilan: ${pkg.pickupLocation || 'BUMDes Pekon'}.`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Tukarkan Poin',
            onPress: async () => {
              setRedeemingPackageId(pkg.id);
              try {
                if (!isOnline) {
                  const taskId = `offline-redeem-${Date.now()}`;
                  await queueOfflineTask(
                    taskId,
                    `idemp-${taskId}`,
                    '/nutrition/redeem',
                    'POST',
                    { packageId: pkg.id }
                  );
                  await loadOfflineTasks();
                  Alert.alert(
                    'Disimpan Offline',
                    'Penebusan paket gizi disimpan ke antrean lokal karena sinyal blank-spot. Saldo akan otomatis disinkronkan saat terhubung kembali.'
                  );
                } else {
                  await nutritionApi.redeemPackage({ packageId: pkg.id });
                  Alert.alert(
                    'Penebusan Berhasil!',
                    `Kupon digital Anda telah aktif. Tunjukkan bukti kupon ke petugas di ${pkg.pickupLocation || 'BUMDes'}.`
                  );
                  fetchWalletAndScore();
                }
                setIsNutritionModalOpen(false);
              } catch (err: any) {
                Alert.alert('Gagal Menebus', err.message || 'Terjadi kesalahan sistem.');
              } finally {
                setRedeemingPackageId(null);
              }
            },
          },
        ]
      );
    }, {
      title: 'Tukarkan Poin Pangan Gizi',
      description: 'Masuk dengan akun warga untuk menukarkan poin reputasi Proof-of-Work Anda dengan paket pangan bergizi pekon.',
    });
  };

  return (
    <View className="flex-1 bg-background">
      {/* Offline Status Banner */}
      {!isOnline && (
        <View
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel={`Peringatan: Jaringan internet terputus. Mode blank spot aktif dengan ${pendingTasks.length} antrean tersimpan.`}
          className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <WifiOff size={15} color="#F59E0B" />
            <Text className="text-amber-500 font-bold text-xs ml-2">
              Mode Blank-Spot (Offline) • {pendingTasks.length} Antrean
            </Text>
          </View>
          <Button
            variant="outline"
            size="xs"
            onPress={syncPendingTasks}
            disabled={syncingOffline}
          >
            {syncingOffline ? 'Sinkron...' : 'Cek Sinyal'}
          </Button>
        </View>
      )}

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchWalletAndScore();
            }}
            tintColor="#10B981"
          />
        }
      >
        {/* User Status Bar & Accessibility Controls */}
        <Card className="bg-card border-border p-3.5 flex-row items-center justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className={`text-foreground font-bold ${isLargeFont ? 'text-base' : 'text-sm'}`}>
              {user ? user.fullName : 'Pengguna Tamu'}
            </Text>
            <Text className={`text-muted-foreground ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>
              {user?.phoneNumber || 'Belum masuk akun warga'} • Pekon Pagelaran
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Toggle Ukuran Huruf Lansia */}
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Ubah ukuran huruf ${isLargeFont ? 'ke ukuran normal' : 'ke ukuran besar ramah lansia'}`}
              className={`p-2 rounded-lg border ${isLargeFont ? 'bg-primary border-primary' : 'bg-muted/40 border-border'}`}
              onPress={() => setIsLargeFont(!isLargeFont)}
            >
              <Type size={16} color={isLargeFont ? '#FFFFFF' : '#10B981'} />
            </TouchableOpacity>

            {!user ? (
              <Button
                variant="primary"
                size="sm"
                onPress={() => router.push('/(auth)/login' as any)}
                className="flex-row items-center"
              >
                <LogIn size={13} color="#FFFFFF" />
                <Text className="text-primary-foreground font-bold text-xs ml-1">Masuk</Text>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onPress={logout}
              >
                Keluar
              </Button>
            )}
          </View>
        </Card>

        {/* Double-Entry Wallet Card */}
        <WalletBalanceCard wallet={wallet} isLargeFont={isLargeFont} />

        {/* Skor Kredit Alternatif AHP-TOPSIS */}
        <CreditScoreCard
          creditScore={creditScore}
          onClaimLoan={handleClaimBumdesLoan}
          isLargeFont={isLargeFont}
        />

        {/* Intervensi Pangan Stunting Banner */}
        <NutritionInterventionBanner
          onOpenCatalog={() => {
            protectedAction(() => {
              fetchNutritionPackages();
              setIsNutritionModalOpen(true);
            }, {
              title: 'Katalog Pangan Bergizi Pekon',
              description: 'Masuk dengan akun warga untuk melihat katalog dan menebus paket gizi stunting.',
            });
          }}
          isLargeFont={isLargeFont}
        />

        {/* Riwayat Mutasi Buku Besar (Double-Entry Ledger) */}
        <LedgerHistoryList
          entries={ledgerEntries}
          ledgerFilter={ledgerFilter}
          onFilterChange={setLedgerFilter}
          isLargeFont={isLargeFont}
        />
      </ScrollView>

      {/* Modal Katalog Gizi Stunting */}
      <NutritionCatalogModal
        visible={isNutritionModalOpen}
        packages={nutritionPackages}
        loading={loadingNutrition}
        redeemingPackageId={redeemingPackageId}
        onClose={() => setIsNutritionModalOpen(false)}
        onRedeem={handleRedeemPackage}
      />

      <AuthWallSheet
        open={isAuthWallOpen}
        onOpenChange={setIsAuthWallOpen}
        {...authWallProps}
      />
    </View>
  );
}
