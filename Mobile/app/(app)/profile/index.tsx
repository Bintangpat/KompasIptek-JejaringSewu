import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/features/auth/store';
import { CreditGrade } from '../../../src/types/enums';

export default function ProfileTabScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isLoading = useAuthStore((s) => s.isLoading);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun JEJARING-SEWU?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getGradeInfo = (grade?: CreditGrade) => {
    switch (grade) {
      case CreditGrade.GRADE_A_LAYAK_MODAL:
        return {
          title: 'Grade A — Layak Modal BUMDes',
          desc: 'Berhak mengajukan pinjaman bergulir tanpa agunan hingga Rp 1.500.000',
          color: '#059669',
          bg: '#ecfdf5',
        };
      case CreditGrade.GRADE_B_PEMBINAAN:
        return {
          title: 'Grade B — Pembinaan BUMDes',
          desc: 'Terus tingkatkan transaksi jastip & panen untuk mencapai Grade A',
          color: '#d97706',
          bg: '#fef3c7',
        };
      default:
        return {
          title: 'Grade C — Tahap Awal',
          desc: 'Selesaikan transaksi pertama Anda dengan Selfie PoW untuk menaikkan skor',
          color: '#6b7280',
          bg: '#f3f4f6',
        };
    }
  };

  const gradeInfo = getGradeInfo(CreditGrade.GRADE_A_LAYAK_MODAL); // Default preview

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'WG'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.fullName || 'Warga Pekon'}</Text>
            <Text style={styles.userPhone}>{user?.phoneNumber || '-'}</Text>
            <View style={styles.nikBadgeRow}>
              <View
                style={[
                  styles.nikBadge,
                  user?.isNikVerified ? styles.nikVerified : styles.nikUnverified,
                ]}
              >
                <Ionicons
                  name={user?.isNikVerified ? 'checkmark-circle' : 'time'}
                  size={14}
                  color={user?.isNikVerified ? '#059669' : '#d97706'}
                />
                <Text
                  style={[
                    styles.nikBadgeText,
                    user?.isNikVerified
                      ? styles.nikVerifiedText
                      : styles.nikUnverifiedText,
                  ]}
                >
                  {user?.isNikVerified ? 'NIK Terverifikasi BUMDes' : 'NIK Menunggu Verifikasi'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.pekonRow}>
          <Ionicons name="location-sharp" size={16} color="#059669" />
          <Text style={styles.pekonText}>
            Domisili: {user?.pekon?.namaPekon || 'Pekon Pagelaran'}, Kec.{' '}
            {user?.pekon?.kecamatan || 'Pagelaran'}
          </Text>
        </View>
      </Card>

      {/* Double-Entry Wallet Card */}
      <Card style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>Dompet Digital Sinergi Pekon</Text>
          <Text style={styles.walletSubtitle}>Sistem Pembukuan Berpasangan (Double-Entry)</Text>
        </View>

        <View style={styles.balanceGrid}>
          {/* Cash Balance */}
          <View style={styles.balanceBox}>
            <Text style={styles.balanceLabel}>Saldo Tunai (IDR)</Text>
            <Text style={styles.cashAmount}>
              Rp {(user?.wallet?.cashBalance ?? 185000).toLocaleString('id-ID')}
            </Text>
            <Text style={styles.balanceSub}>Dapat dicairkan via BUMDes</Text>
          </View>

          {/* Points Balance */}
          <View style={[styles.balanceBox, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
            <Text style={[styles.balanceLabel, { color: '#991b1b' }]}>Poin Gizi Balita</Text>
            <Text style={[styles.pointsAmount, { color: '#dc2626' }]}>
              {(user?.wallet?.pointsBalance ?? 340).toLocaleString('id-ID')} Poin
            </Text>
            <Text style={[styles.balanceSub, { color: '#b91c1c' }]}>Tukar paket pangan stunting</Text>
          </View>
        </View>

        <View style={styles.walletActions}>
          <TouchableOpacity style={styles.walletActionBtn}>
            <Ionicons name="swap-horizontal" size={18} color="#059669" />
            <Text style={styles.walletActionText}>Riwayat Mutasi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletActionBtn}>
            <Ionicons name="nutrition" size={18} color="#dc2626" />
            <Text style={[styles.walletActionText, { color: '#dc2626' }]}>Tukar Paket Gizi</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Credit Scoring Card (AHP-TOPSIS) */}
      <Card style={styles.scoringCard}>
        <View style={styles.scoreHeader}>
          <View>
            <Text style={styles.scoreTitle}>Skor Kredit Alternatif ($S_{'{kredit}'}$)</Text>
            <Text style={styles.scoreSubtitle}>Metode SPK AHP-TOPSIS 5 Kriteria</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreCircleValue}>88.4</Text>
            <Text style={styles.scoreCircleMax}>/ 100</Text>
          </View>
        </View>

        <View style={[styles.gradeBanner, { backgroundColor: gradeInfo.bg }]}>
          <Text style={[styles.gradeTitle, { color: gradeInfo.color }]}>
            {gradeInfo.title}
          </Text>
          <Text style={[styles.gradeDesc, { color: gradeInfo.color }]}>
            {gradeInfo.desc}
          </Text>
        </View>

        <View style={styles.criteriaList}>
          <View style={styles.criteriaItem}>
            <Text style={styles.critLabel}>Integritas Selfie PoW (20%)</Text>
            <Text style={styles.critVal}>96%</Text>
          </View>
          <View style={styles.criteriaItem}>
            <Text style={styles.critLabel}>Reputasi Mini-Job (25%)</Text>
            <Text style={styles.critVal}>90%</Text>
          </View>
          <View style={styles.criteriaItem}>
            <Text style={styles.critLabel}>Keaktifan Nebeng-Jastip (20%)</Text>
            <Text style={styles.critVal}>85%</Text>
          </View>
          <View style={styles.criteriaItem}>
            <Text style={styles.critLabel}>Penyelesaian Bursa Panen (20%)</Text>
            <Text style={styles.critVal}>82%</Text>
          </View>
          <View style={styles.criteriaItem}>
            <Text style={styles.critLabel}>Indeks Inklusi Sosial (15%)</Text>
            <Text style={styles.critVal}>92%</Text>
          </View>
        </View>
      </Card>

      {/* Logout Button */}
      <Button
        title="Keluar dari Akun"
        variant="outline"
        onPress={handleLogout}
        loading={isLoading}
        style={styles.logoutButton}
        textStyle={styles.logoutText}
      />
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
    paddingBottom: 40,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  userPhone: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 2,
  },
  nikBadgeRow: {
    marginTop: 6,
  },
  nikBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  nikVerified: {
    backgroundColor: '#ecfdf5',
  },
  nikUnverified: {
    backgroundColor: '#fef3c7',
  },
  nikBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  nikVerifiedText: {
    color: '#059669',
  },
  nikUnverifiedText: {
    color: '#d97706',
  },
  pekonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  pekonText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  walletCard: {
    marginBottom: 16,
  },
  walletHeader: {
    marginBottom: 12,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  walletSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  balanceBox: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 12,
    borderRadius: 10,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  cashAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15803d',
    marginBottom: 4,
  },
  pointsAmount: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  balanceSub: {
    fontSize: 10,
    color: '#166534',
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  walletActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  walletActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  scoringCard: {
    marginBottom: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  scoreSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  scoreCircle: {
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#059669',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCircleValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  scoreCircleMax: {
    fontSize: 9,
    fontWeight: '600',
    color: '#047857',
  },
  gradeBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  gradeTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  gradeDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  criteriaList: {
    gap: 6,
  },
  criteriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  critLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  critVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  logoutButton: {
    borderColor: '#dc2626',
    marginTop: 8,
  },
  logoutText: {
    color: '#dc2626',
  },
});
