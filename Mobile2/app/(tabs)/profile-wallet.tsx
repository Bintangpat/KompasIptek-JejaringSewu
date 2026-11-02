import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { WifiOff, Type } from 'lucide-react-native';
import NetInfo from '@react-native-community/netinfo';

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
  const { user, loginAsDemoWarga, logout } = useAuth();
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
  };

  // 4. Handle Tukar Poin Pangan Stunting
  const handleRedeemPackage = async (pkg: any) => {
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
  };

  return (
    <View className="flex-1 bg-pekon-bg">
      {/* Offline Status Banner */}
      {!isOnline && (
        <View
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel={`Peringatan: Jaringan internet terputus. Mode blank spot aktif dengan ${pendingTasks.length} antrean tersimpan.`}
          className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <WifiOff size={15} color="#FBBF24" />
            <Text className="text-amber-300 font-bold text-xs ml-2">
              Mode Blank-Spot (Offline) • {pendingTasks.length} Antrean
            </Text>
          </View>
          <TouchableOpacity
            onPress={syncPendingTasks}
            disabled={syncingOffline}
            className="bg-amber-500/30 px-2 py-0.5 rounded"
          >
            <Text className="text-amber-200 text-[10px] font-bold">
              {syncingOffline ? 'Sinkron...' : 'Cek Sinyal'}
            </Text>
          </TouchableOpacity>
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
            tintColor="#00F2A9"
          />
        }
      >
        {/* User Status Bar & Accessibility Controls */}
        <View className="bg-pekon-surface border border-pekon-border p-3.5 rounded-xl flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className={`text-white font-bold ${isLargeFont ? 'text-base' : 'text-sm'}`}>
              {user ? user.fullName : 'Pengguna Tamu'}
            </Text>
            <Text className={`text-pekon-muted ${isLargeFont ? 'text-xs' : 'text-[11px]'}`}>
              {user?.phoneNumber || 'Belum masuk akun warga'} • Pekon Pagelaran
            </Text>
          </View>

          <View className="flex-row items-center space-x-2">
            {/* Toggle Ukuran Huruf Lansia */}
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Ubah ukuran huruf ${isLargeFont ? 'ke ukuran normal' : 'ke ukuran besar ramah lansia'}`}
              className={`p-1.5 rounded-lg border ${isLargeFont ? 'bg-pekon-primary border-pekon-primary' : 'bg-pekon-card border-pekon-border'}`}
              onPress={() => setIsLargeFont(!isLargeFont)}
            >
              <Type size={16} color={isLargeFont ? '#0F1416' : '#00F2A9'} />
            </TouchableOpacity>

            {!user ? (
              <TouchableOpacity
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Masuk sebagai akun demo warga"
                className="bg-pekon-primary px-3 py-1.5 rounded-lg"
                onPress={async () => {
                  try {
                    await loginAsDemoWarga();
                    Alert.alert('Berhasil Masuk', 'Masuk sebagai Pak Slamet (Petani Singkong).');
                  } catch (e: any) {
                    Alert.alert('Gagal Masuk', e.message);
                  }
                }}
              >
                <Text className="text-pekon-bg font-bold text-xs">Demo Login</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Keluar dari akun warga"
                className="bg-pekon-card border border-pekon-border px-2.5 py-1.5 rounded-lg"
                onPress={logout}
              >
                <Text className="text-pekon-subtle text-xs">Keluar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

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
            fetchNutritionPackages();
            setIsNutritionModalOpen(true);
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
    </View>
  );
}
