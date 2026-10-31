import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/features/auth/store';

export default function CommuterTabScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Banner Pekon */}
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.greeting}>Halo, {user?.fullName || 'Warga'}!</Text>
          <Text style={styles.pekonBadge}>
            📍 {user?.pekon?.namaPekon || 'Kabupaten Pringsewu'}
          </Text>
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name="map" size={28} color="#059669" />
        </View>
      </View>

      {/* Main Actions */}
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Mulai Rute Komuter Baru, bagikan kursi atau bagasi motor/mobil Anda"
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#10b981' }]}>
            <Ionicons name="navigate" size={24} color="#ffffff" />
          </View>
          <Text style={styles.actionTitle}>Mulai Rute Komuter</Text>
          <Text style={styles.actionDesc}>
            Perjalanan searah ke pasar/kota? Buka titipan jastip & hemat bensin.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Cari Rute Terdekat untuk titip barang atau beli kebutuhan pokok"
        >
          <View style={[styles.actionIconContainer, { backgroundColor: '#0284c7' }]}>
            <Ionicons name="search" size={24} color="#ffffff" />
          </View>
          <Text style={styles.actionTitle}>Cari Titipan Jastip</Text>
          <Text style={styles.actionDesc}>
            Temukan warga yang sedang melintas searah tujuan Anda.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Route Status Card */}
      <Card style={styles.statusCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>Status Perjalanan Anda</Text>
          <View style={styles.inactivePill}>
            <Text style={styles.inactivePillText}>Tidak Aktif</Text>
          </View>
        </View>
        <Text style={styles.cardBodyText}>
          Anda belum mengaktifkan pelacakan rute perjalanan komuter saat ini. Tekan tombol di bawah untuk memulai rute dan menerima pesanan jastip warga pekon.
        </Text>
        <Button
          title="Buka Rute Searah Sekarang"
          onPress={() => {}}
          style={styles.cardButton}
        />
      </Card>

      {/* Nearby Routes Preview */}
      <Text style={styles.sectionHeader}>Rute Komuter Aktif di Sekitar Anda</Text>
      <Card style={styles.routeItem}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeDriver}>Pak Slamet (Sepeda Motor)</Text>
          <Text style={styles.routeDistance}>Radius 1.2 km</Text>
        </View>
        <Text style={styles.routePath}>
          Pekon Pagelaran ➔ Pasar Induk Pringsewu
        </Text>
        <View style={styles.routeFooter}>
          <Text style={styles.routeCapacity}>Bisa titip barang kecil / belanjaan</Text>
          <TouchableOpacity style={styles.orderSmallBtn}>
            <Text style={styles.orderSmallBtnText}>Titip Jastip</Text>
          </TouchableOpacity>
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
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  pekonBadge: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 16,
  },
  statusCard: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  inactivePill: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  inactivePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  cardBodyText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardButton: {
    minHeight: 44,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  routeItem: {
    marginBottom: 12,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  routeDriver: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  routeDistance: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  routePath: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 10,
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  routeCapacity: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  orderSmallBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  orderSmallBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
