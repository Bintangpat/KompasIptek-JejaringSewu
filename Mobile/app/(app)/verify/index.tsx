import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';

export default function VerifyTabScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Information Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="shield-checkmark" size={28} color="#059669" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Selfie Proof-of-Work (PoW)</Text>
          <Text style={styles.infoDesc}>
            Setiap transaksi fisik (serah terima panen, jastip, atau pekerjaan selesai) wajib diverifikasi melalui foto kamera langsung dengan geotag Pekon & timestamp server.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Menunggu Verifikasi Selfie</Text>

      {/* Transaction Item 1 */}
      <Card style={styles.txCard}>
        <View style={styles.txHeader}>
          <View style={styles.badgeRow}>
            <View style={[styles.typeBadge, { backgroundColor: '#fef3c7' }]}>
              <Text style={[styles.typeBadgeText, { color: '#b45309' }]}>MINI_JOB</Text>
            </View>
            <Text style={styles.txId}>ID: #TX-9021</Text>
          </View>
          <Text style={styles.txAmount}>Rp 75.000</Text>
        </View>

        <Text style={styles.txTitle}>Sortir Biji Kopi Kering</Text>
        <Text style={styles.txCounterparty}>
          Pemberi Kerja: UD Berkah Kopi • Pekon Pagelaran
        </Text>

        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Status Verifikasi:</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepDotActive} />
            <Text style={styles.stepTextActive}>Pekerjaan Selesai Diklaim</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepDotPending} />
            <Text style={styles.stepTextPending}>
              Menunggu Foto Selfie Pekerja & Pemberi Kerja
            </Text>
          </View>
        </View>

        <Button
          title="📷 Ambil Foto Selfie PoW Sekarang"
          onPress={() => {}}
          style={styles.verifyButton}
          accessibilityLabel="Buka kamera langsung untuk mengambil foto selfie verifikasi pekerjaan sortir kopi"
        />
      </Card>

      {/* Meetup Token Card */}
      <Card style={styles.tokenCard}>
        <View style={styles.tokenHeader}>
          <Ionicons name="key" size={20} color="#0284c7" />
          <Text style={styles.tokenTitle}>Token Pertemuan Fisik (5 Menit)</Text>
        </View>
        <Text style={styles.tokenDesc}>
          Tunjukkan kode token ini atau scan token rekan transaksi Anda untuk mengonfirmasi serah terima barang di lokasi Pekon.
        </Text>
        <View style={styles.tokenBox}>
          <Text style={styles.tokenCode}>PRW-783-KPT</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  txCard: {
    marginBottom: 16,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  txId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  txCounterparty: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 12,
  },
  stepContainer: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stepDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  stepTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  stepDotPending: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
  stepTextPending: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b45309',
  },
  verifyButton: {
    backgroundColor: '#059669',
  },
  tokenCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1.5,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  tokenTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369a1',
  },
  tokenDesc: {
    fontSize: 12,
    color: '#0284c7',
    lineHeight: 16,
    marginBottom: 10,
  },
  tokenBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tokenCode: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#0369a1',
  },
});
