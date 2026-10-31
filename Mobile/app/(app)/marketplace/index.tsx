import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../src/components/ui/Card';

export default function MarketplaceTabScreen() {
  const [activeTab, setActiveTab] = useState<'harvest' | 'jobs'>('harvest');
  const [disabilityOnly, setDisabilityOnly] = useState(false);

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.switchTab, activeTab === 'harvest' && styles.switchTabActive]}
          onPress={() => setActiveTab('harvest')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'harvest' }}
          accessibilityLabel="Bursa Panen Komoditas Lokal"
        >
          <Text style={[styles.switchText, activeTab === 'harvest' && styles.switchTextActive]}>
            🌾 Bursa Panen
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchTab, activeTab === 'jobs' && styles.switchTabActive]}
          onPress={() => setActiveTab('jobs')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'jobs' }}
          accessibilityLabel="Lowongan Mini-Job Inklusif"
        >
          <Text style={[styles.switchText, activeTab === 'jobs' && styles.switchTextActive]}>
            🛠️ Mini-Job Inklusif
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'harvest' ? (
          <View>
            <View style={styles.filterRow}>
              <Text style={styles.listTitle}>Daftar Komoditas Siap Panen</Text>
              <TouchableOpacity
                style={styles.actionAddBtn}
                accessibilityLabel="Jual Hasil Panen Baru"
              >
                <Text style={styles.actionAddText}>+ Jual Panen</Text>
              </TouchableOpacity>
            </View>

            {/* Harvest Listing Cards */}
            <Card style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Kopi Robusta Petik Merah</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Lelang Terbuka</Text>
                </View>
              </View>
              <Text style={styles.itemSub}>Petani: Pak Joko • Pekon Pagelaran</Text>
              <View style={styles.metricRow}>
                <View>
                  <Text style={styles.metricLabel}>Estimasi Berat</Text>
                  <Text style={styles.metricVal}>450 Kg</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Harga Pembuka</Text>
                  <Text style={styles.metricVal}>Rp 42.000 / Kg</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.bidsCount}>3 Penawaran Masuk</Text>
                <TouchableOpacity style={styles.bidButton}>
                  <Text style={styles.bidButtonText}>Beri Penawaran</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Card style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Pisang Cavendish Organik</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Lelang Terbuka</Text>
                </View>
              </View>
              <Text style={styles.itemSub}>Petani: Ibu Sumarni • Pekon Sukoharjo</Text>
              <View style={styles.metricRow}>
                <View>
                  <Text style={styles.metricLabel}>Estimasi Berat</Text>
                  <Text style={styles.metricVal}>180 Kg</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Harga Pembuka</Text>
                  <Text style={styles.metricVal}>Rp 8.500 / Kg</Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.bidsCount}>1 Penawaran Masuk</Text>
                <TouchableOpacity style={styles.bidButton}>
                  <Text style={styles.bidButtonText}>Beri Penawaran</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        ) : (
          <View>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterChip, disabilityOnly && styles.filterChipActive]}
                onPress={() => setDisabilityOnly(!disabilityOnly)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: disabilityOnly }}
                accessibilityLabel="Filter Ramah Disabilitas / Lansia"
              >
                <Ionicons
                  name={disabilityOnly ? 'checkmark-circle' : 'filter'}
                  size={16}
                  color={disabilityOnly ? '#ffffff' : '#059669'}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    disabilityOnly && styles.filterChipTextActive,
                  ]}
                >
                  Prioritas Inklusif (Ramah Disabilitas)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionAddBtn}
                accessibilityLabel="Pasang Lowongan Mini-Job Baru"
              >
                <Text style={styles.actionAddText}>+ Buat Job</Text>
              </TouchableOpacity>
            </View>

            {/* Mini Job Cards */}
            <Card style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Sortir Biji Kopi Kering</Text>
                <View style={[styles.statusPill, { backgroundColor: '#dcfce7' }]}>
                  <Text style={[styles.statusPillText, { color: '#15803d' }]}>
                    Ramah Disabilitas
                  </Text>
                </View>
              </View>
              <Text style={styles.itemSub}>Pemberi Kerja: UD Berkah Kopi Pekon Pagelaran</Text>
              <Text style={styles.jobDesc}>
                Pekerjaan duduk memilih biji kopi cacat. Cocok untuk penyandang disabilitas fisik atau lansia. Upah langsung cair setelah verifikasi foto PoW.
              </Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.metricLabel}>Upah Harian</Text>
                  <Text style={styles.wageText}>Rp 75.000 / Hari</Text>
                </View>
                <TouchableOpacity
                  style={styles.claimButton}
                  accessibilityLabel="Klaim pekerjaan sortir biji kopi kering dengan Auto-Accept Lock"
                >
                  <Text style={styles.claimButtonText}>Ambil Pekerjaan</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Card style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Pengemasan Keripik Pisang</Text>
                <View style={[styles.statusPill, { backgroundColor: '#fef3c7' }]}>
                  <Text style={[styles.statusPillText, { color: '#b45309' }]}>
                    Auto-Accept Lock
                  </Text>
                </View>
              </View>
              <Text style={styles.itemSub}>Pemberi Kerja: UMKM Sari Rasa Pekon Gading Rejo</Text>
              <Text style={styles.jobDesc}>
                Menempel label stiker dan memasukkan kemasan ke dalam kardus. Tersedia tempat duduk nyaman.
              </Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.metricLabel}>Upah Harian</Text>
                  <Text style={styles.wageText}>Rp 65.000 / Hari</Text>
                </View>
                <TouchableOpacity
                  style={styles.claimButton}
                  accessibilityLabel="Klaim pekerjaan pengemasan keripik pisang"
                >
                  <Text style={styles.claimButtonText}>Ambil Pekerjaan</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 10,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  switchTabActive: {
    backgroundColor: '#059669',
  },
  switchText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b5563',
  },
  switchTextActive: {
    color: '#ffffff',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  actionAddBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionAddText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  itemCard: {
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  statusPill: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0369a1',
  },
  itemSub: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  jobDesc: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  bidsCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  bidButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  bidButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  wageText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  claimButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  claimButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
