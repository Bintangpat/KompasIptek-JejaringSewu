import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Sprout, Briefcase, HeartHandshake, Plus } from 'lucide-react-native';

import { harvestApi } from '@/features/harvest/api';
import {
  HarvestListingCard,
  CreateHarvestModal,
  PlaceBidModal,
} from '@/features/harvest/components';

import { miniJobApi } from '@/features/mini-job/api';
import {
  MiniJobCard,
  MiniJobFilterBar,
  CreateMiniJobModal,
} from '@/features/mini-job/components';

export default function MarketplaceScreen() {
  const [activeTab, setActiveTab] = useState<'PANEN' | 'MINI_JOB'>('MINI_JOB');
  const [miniJobFilter, setMiniJobFilter] = useState<'ALL' | 'DISABILITY' | 'OPEN'>('OPEN');

  const [harvests, setHarvests] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [showCreateHarvestModal, setShowCreateHarvestModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [selectedHarvestForBid, setSelectedHarvestForBid] = useState<any>(null);

  const fetchData = async () => {
    try {
      if (activeTab === 'MINI_JOB') {
        const query: any = {};
        if (miniJobFilter === 'OPEN') query.status = 'OPEN';
        if (miniJobFilter === 'DISABILITY') {
          query.status = 'OPEN';
          query.isDisabilityFriendly = true;
        }
        const data = await miniJobApi.getJobs(query);
        setJobs(data);
      } else {
        const data = await harvestApi.getListings({ status: 'OPEN_BIDDING' });
        setHarvests(data);
      }
    } catch (e: any) {
      console.warn('Gagal memuat data marketplace:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [activeTab, miniJobFilter]);

  // 1. Klaim Mini-Job
  const handleClaimJob = async (jobId: string, title: string) => {
    Alert.alert(
      'Kunci Tugas (Auto-Accept)',
      `Anda akan mengunci pekerjaan "${title}". Sistem melindungi hak kerja Anda tanpa seleksi fisik sepihak (Zero-Discrimination). Lanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ambil & Kunci Tugas',
          onPress: async () => {
            try {
              await miniJobApi.claimJob(jobId);
              Alert.alert('Sukses Terkunci!', 'Pekerjaan berhasil Anda kunci. Selesaikan tugas dan unggah bukti di tab Selfie PoW.');
              fetchData();
            } catch (err: any) {
              Alert.alert('Gagal Mengunci', err.message || 'Terjadi kesalahan sistem.');
            }
          },
        },
      ]
    );
  };

  // 2. Buat Lelang Panen Baru (Petani)
  const handleCreateHarvest = async (data: {
    commodityName: string;
    estimatedKg: number;
    minPricePerKg: number;
  }) => {
    if (!data.commodityName.trim() || !data.estimatedKg || !data.minPricePerKg) {
      Alert.alert('Peringatan', 'Harap isi seluruh field formulir lelang panen.');
      return;
    }
    if (data.estimatedKg <= 0) {
      Alert.alert('Peringatan', 'Estimasi berat panen harus lebih dari 0 kg.');
      return;
    }
    if (data.minPricePerKg < 100) {
      Alert.alert('Peringatan', 'Batas minimal harga penawaran harus minimal Rp 100/kg.');
      return;
    }

    try {
      setSubmitting(true);
      await harvestApi.createListing(data);
      Alert.alert('Sukses!', `Lelang panen ${data.commodityName} berhasil diposting ke bursa pekon.`);
      setShowCreateHarvestModal(false);
      fetchData();
    } catch (err: any) {
      Alert.alert('Gagal Posting Panen', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Ajukan Penawaran Pengepul (Bidding)
  const handlePlaceBid = async (data: {
    offeredPricePerKg: number;
    referralUsedCode?: string;
  }) => {
    if (!selectedHarvestForBid) return;
    const minAllowed = parseFloat(selectedHarvestForBid.minPricePerKg);
    if (isNaN(data.offeredPricePerKg) || data.offeredPricePerKg < minAllowed) {
      Alert.alert('Peringatan', `Harga penawaran harus minimal sama dengan batas Rp ${minAllowed.toLocaleString('id-ID')}/kg.`);
      return;
    }

    try {
      setSubmitting(true);
      await harvestApi.placeBid(selectedHarvestForBid.id, data);
      Alert.alert('Tawaran Terkirim!', `Tawaran Rp ${data.offeredPricePerKg.toLocaleString('id-ID')}/kg telah diteruskan ke petani.`);
      setShowBidModal(false);
      setSelectedHarvestForBid(null);
      fetchData();
    } catch (err: any) {
      Alert.alert('Gagal Mengajukan Tawaran', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Petani Menyetujui Tawaran Pengepul
  const handleAcceptBid = (bidId: string, commodityName: string, offeredPrice: number) => {
    Alert.alert(
      'Kunci Transaksi Panen',
      `Setujui penawaran harga Rp ${Number(offeredPrice).toLocaleString('id-ID')}/kg untuk komoditas ${commodityName}? Lelang akan otomatis dikunci dan transaksi diterbitkan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Setujui & Kunci',
          onPress: async () => {
            try {
              await harvestApi.acceptBid(bidId);
              Alert.alert('Lelang Berhasil Dikunci!', 'Transaksi panen telah diterbitkan. Lakukan serah terima dan selesaikan bukti di tab Selfie PoW.');
              fetchData();
            } catch (err: any) {
              Alert.alert('Gagal Menyetujui Tawaran', err.message || 'Terjadi kesalahan sistem.');
            }
          },
        },
      ]
    );
  };

  // 5. Buat Lowongan Mini-Job Baru (UMKM)
  const handleCreateJob = async (data: {
    title: string;
    description: string;
    wageAmount: number;
    isDisabilityFriendly: boolean;
  }) => {
    if (!data.title.trim() || !data.description.trim() || !data.wageAmount) {
      Alert.alert('Peringatan', 'Harap lengkapi judul, deskripsi, dan upah pekerjaan.');
      return;
    }
    if (data.wageAmount < 5000) {
      Alert.alert('Peringatan', 'Upah pekerjaan mikro minimal Rp 5.000.');
      return;
    }

    try {
      setSubmitting(true);
      await miniJobApi.createJob(data);
      Alert.alert('Lowongan Berhasil Diposting!', 'Pekerjaan mikro telah aktif di bursa desa.');
      setShowCreateJobModal(false);
      fetchData();
    } catch (err: any) {
      Alert.alert('Gagal Membuat Lowongan', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-pekon-bg">
      {/* Tab Switcher Utama */}
      <View className="flex-row bg-pekon-surface p-2 border-b border-pekon-border">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
            activeTab === 'MINI_JOB' ? 'bg-pekon-card border border-pekon-primary' : ''
          }`}
          onPress={() => setActiveTab('MINI_JOB')}
          accessible={true}
          accessibilityLabel="Buka Tab Bursa Mini Job"
        >
          <Briefcase size={16} color={activeTab === 'MINI_JOB' ? '#00F2A9' : '#84958A'} />
          <Text
            className={`text-xs font-bold ml-1.5 ${
              activeTab === 'MINI_JOB' ? 'text-pekon-primary' : 'text-pekon-muted'
            }`}
          >
            Bursa Mini-Job
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
            activeTab === 'PANEN' ? 'bg-pekon-card border border-pekon-primary' : ''
          }`}
          onPress={() => setActiveTab('PANEN')}
          accessible={true}
          accessibilityLabel="Buka Tab Hasil Bumi Petani"
        >
          <Sprout size={16} color={activeTab === 'PANEN' ? '#00F2A9' : '#84958A'} />
          <Text
            className={`text-xs font-bold ml-1.5 ${
              activeTab === 'PANEN' ? 'text-pekon-primary' : 'text-pekon-muted'
            }`}
          >
            Hasil Bumi Petani
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sub-Header & Tombol Aksi */}
      {activeTab === 'MINI_JOB' ? (
        <MiniJobFilterBar
          currentFilter={miniJobFilter}
          onFilterChange={setMiniJobFilter}
          onPostJobPress={() => setShowCreateJobModal(true)}
        />
      ) : (
        <View className="bg-pekon-surface/70 px-4 py-2.5 border-b border-pekon-border/60 flex-row items-center justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-white text-xs font-bold">Katalog Panen Terbuka</Text>
            <Text className="text-pekon-subtle text-[11px]">Harga wajar langsung dari petani desa</Text>
          </View>
          <TouchableOpacity
            className="bg-pekon-primary px-3 py-1.5 rounded-lg flex-row items-center"
            onPress={() => setShowCreateHarvestModal(true)}
            accessible={true}
            accessibilityLabel="Buka formulir posting hasil bumi petani"
          >
            <Plus size={14} color="#0F1416" />
            <Text className="text-pekon-bg text-xs font-bold ml-1">Pasang Panen</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Konten ScrollView */}
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchData();
            }}
            tintColor="#00F2A9"
          />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#00F2A9" className="my-8" />
        ) : activeTab === 'MINI_JOB' ? (
          <View>
            <View className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4 flex-row items-center">
              <HeartHandshake size={20} color="#10B981" />
              <View className="ml-2 flex-1">
                <Text className="text-emerald-400 font-bold text-xs">Prinsip Zero-Discrimination</Text>
                <Text className="text-emerald-200/80 text-[11px]">
                  Tugas bertanda ramah disabilitas terkunci otomatis tanpa tombol tolak dari pemberi kerja.
                </Text>
              </View>
            </View>

            {jobs.length === 0 ? (
              <View className="bg-pekon-card border border-pekon-border rounded-xl p-6 items-center">
                <Text className="text-pekon-text text-sm">Belum ada lowongan mini-job pada kategori ini.</Text>
                <TouchableOpacity
                  className="mt-3 bg-pekon-surface border border-pekon-border px-3 py-1.5 rounded-lg"
                  onPress={() => setShowCreateJobModal(true)}
                >
                  <Text className="text-pekon-primary text-xs font-semibold">+ Buka Lowongan Sekarang</Text>
                </TouchableOpacity>
              </View>
            ) : (
              jobs.map((job) => (
                <MiniJobCard
                  key={job.id}
                  job={job}
                  onClaimJob={handleClaimJob}
                />
              ))
            )}
          </View>
        ) : (
          <View>
            {harvests.length === 0 ? (
              <View className="bg-pekon-card border border-pekon-border rounded-xl p-6 items-center">
                <Text className="text-pekon-text text-sm">Belum ada komoditas hasil bumi yang diposting.</Text>
                <TouchableOpacity
                  className="mt-3 bg-pekon-primary px-4 py-2 rounded-lg"
                  onPress={() => setShowCreateHarvestModal(true)}
                >
                  <Text className="text-pekon-bg text-xs font-bold">+ Posting Panen Baru</Text>
                </TouchableOpacity>
              </View>
            ) : (
              harvests.map((h) => (
                <HarvestListingCard
                  key={h.id}
                  listing={h}
                  onPlaceBidPress={(item) => {
                    setSelectedHarvestForBid(item);
                    setShowBidModal(true);
                  }}
                  onAcceptBid={handleAcceptBid}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <CreateHarvestModal
        visible={showCreateHarvestModal}
        onClose={() => setShowCreateHarvestModal(false)}
        onSubmit={handleCreateHarvest}
        submitting={submitting}
      />

      <PlaceBidModal
        visible={showBidModal}
        listing={selectedHarvestForBid}
        onClose={() => {
          setShowBidModal(false);
          setSelectedHarvestForBid(null);
        }}
        onSubmit={handlePlaceBid}
        submitting={submitting}
      />

      <CreateMiniJobModal
        visible={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
        onSubmit={handleCreateJob}
        submitting={submitting}
      />
    </View>
  );
}
