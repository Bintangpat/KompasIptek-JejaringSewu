import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Sprout, Briefcase, HeartHandshake, Plus } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { AuthWallSheet } from '@/components/ui/auth-wall-sheet';
import { useAuthProtection } from '@/hooks/use-auth-protection';

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
  const {
    isAuthWallOpen,
    setIsAuthWallOpen,
    authWallProps,
    protectedAction,
  } = useAuthProtection();

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
    protectedAction(() => {
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
    }, {
      title: 'Ambil & Kunci Pekerjaan',
      description: 'Masuk dengan akun warga untuk mengunci tugas, melindungi hak kerja, dan menerima upah tunai secara adil.',
    });
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
    protectedAction(() => {
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
    }, {
      title: 'Setujui Penawaran Panen',
      description: 'Masuk dengan akun petani pemilik lelang untuk menyetujui transaksi hasil panen pekon.',
    });
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
    <View className="flex-1 bg-background">
      {/* Tab Switcher Utama */}
      <View className="flex-row bg-card p-2 border-b border-border">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
            activeTab === 'MINI_JOB' ? 'bg-primary/10 border border-primary' : ''
          }`}
          onPress={() => setActiveTab('MINI_JOB')}
        >
          <Briefcase size={16} color={activeTab === 'MINI_JOB' ? '#10B981' : '#84958A'} />
          <Text
            className={`text-xs font-bold ml-1.5 ${
              activeTab === 'MINI_JOB' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Bursa Mini-Job
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
            activeTab === 'PANEN' ? 'bg-primary/10 border border-primary' : ''
          }`}
          onPress={() => setActiveTab('PANEN')}
        >
          <Sprout size={16} color={activeTab === 'PANEN' ? '#10B981' : '#84958A'} />
          <Text
            className={`text-xs font-bold ml-1.5 ${
              activeTab === 'PANEN' ? 'text-primary' : 'text-muted-foreground'
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
          onPostJobPress={() => {
            protectedAction(() => setShowCreateJobModal(true), {
              title: 'Pasang Lowongan Tugas Mikro',
              description: 'Masuk dengan akun warga / pelaku usaha untuk mempublikasikan tugas mikro dengan upah adil.',
            });
          }}
        />
      ) : (
        <View className="bg-card px-4 py-2.5 border-b border-border flex-row items-center justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-foreground text-xs font-bold">Katalog Panen Terbuka</Text>
            <Text className="text-muted-foreground text-[11px]">Harga wajar langsung dari petani desa</Text>
          </View>
          <Button
            variant="primary"
            size="sm"
            onPress={() => {
              protectedAction(() => setShowCreateHarvestModal(true), {
                title: 'Posting Hasil Panen Baru',
                description: 'Masuk dengan akun petani pekon untuk membuka lelang hasil panen ke jaringan pengepul jujur.',
              });
            }}
            className="flex-row items-center"
          >
            <Plus size={14} color="#FFFFFF" />
            <Text className="text-primary-foreground text-xs font-bold ml-1">Pasang Panen</Text>
          </Button>
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
            tintColor="#10B981"
          />
        }
      >
        {loading ? (
          <View className="my-8 items-center">
            <Spinner size="lg" />
          </View>
        ) : activeTab === 'MINI_JOB' ? (
          <View>
            <Card className="bg-primary/10 border-primary/20 p-3 mb-4 flex-row items-center">
              <HeartHandshake size={20} color="#10B981" />
              <View className="ml-2.5 flex-1">
                <Text className="text-primary font-bold text-xs">Prinsip Zero-Discrimination</Text>
                <Text className="text-foreground text-[11px] leading-relaxed">
                  Tugas bertanda ramah disabilitas terkunci otomatis tanpa seleksi fisik sepihak dari pemberi kerja.
                </Text>
              </View>
            </Card>

            {jobs.length === 0 ? (
              <Card className="bg-card border-border p-6 items-center">
                <Text className="text-foreground text-sm">Belum ada lowongan mini-job pada kategori ini.</Text>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onPress={() => {
                    protectedAction(() => setShowCreateJobModal(true), {
                      title: 'Pasang Lowongan Tugas Mikro',
                      description: 'Masuk dengan akun warga / UMKM desa untuk membuka lowongan tugas baru.',
                    });
                  }}
                >
                  + Buka Lowongan Sekarang
                </Button>
              </Card>
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
              <Card className="bg-card border-border p-6 items-center">
                <Text className="text-foreground text-sm">Belum ada komoditas hasil bumi yang diposting.</Text>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onPress={() => {
                    protectedAction(() => setShowCreateHarvestModal(true), {
                      title: 'Posting Hasil Panen Baru',
                      description: 'Masuk dengan akun petani pekon untuk membuka lelang komoditas bumi.',
                    });
                  }}
                >
                  + Posting Panen Baru
                </Button>
              </Card>
            ) : (
              harvests.map((h) => (
                <HarvestListingCard
                  key={h.id}
                  listing={h}
                  onPlaceBidPress={(item) => {
                    protectedAction(() => {
                      setSelectedHarvestForBid(item);
                      setShowBidModal(true);
                    }, {
                      title: 'Ajukan Penawaran Harga',
                      description: 'Masuk dengan akun pengepul pekon untuk mengajukan tawaran harga beli panen.',
                    });
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

      <AuthWallSheet
        open={isAuthWallOpen}
        onOpenChange={setIsAuthWallOpen}
        {...authWallProps}
      />
    </View>
  );
}
