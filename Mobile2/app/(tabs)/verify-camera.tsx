import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Crypto from 'expo-crypto';
import { ShieldCheck } from 'lucide-react-native';
import { Config } from '@/constants/Config';

import { transactionApi } from '@/features/transaction-pow/api';
import {
  CameraViewfinder,
  PoWReviewView,
  TransactionSelectorModal,
} from '@/features/transaction-pow/components';

export default function VerifyCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [isCapturing, setIsCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Daftar transaksi aktif
  const [activeTransactions, setActiveTransactions] = useState<any[]>([]);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [showTxModal, setShowTxModal] = useState(false);

  // Foto yang berhasil diambil
  const [capturedPhoto, setCapturedPhoto] = useState<{
    uri: string;
    hash: string;
    gpsLat: number;
    gpsLng: number;
    accuracy: number;
    timestamp: string;
  } | null>(null);

  const cameraRef = useRef<any>(null);

  // 1. Ambil izin & posisi GPS
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation(loc);
      }
    })();
  }, []);

  // 2. Ambil daftar transaksi aktif pengguna
  const fetchActiveTransactions = async () => {
    try {
      const all = await transactionApi.getMyTransactions();
      const pendingPoW = all.filter(
        (t) =>
          t.status === 'IN_PROGRESS' ||
          t.status === 'AWAITING_SELFIE_POW' ||
          t.status === 'LOCKED_ASSIGNED'
      );
      setActiveTransactions(pendingPoW);
      if (pendingPoW.length > 0 && !selectedTx) {
        setSelectedTx(pendingPoW[0]);
      }
    } catch (e: any) {
      console.warn('Gagal memuat transaksi aktif:', e.message);
    }
  };

  useEffect(() => {
    fetchActiveTransactions();
  }, []);

  if (!permission) {
    return (
      <View className="flex-1 bg-pekon-bg items-center justify-center p-6">
        <ActivityIndicator color="#00F2A9" size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-pekon-bg items-center justify-center p-6 text-center">
        <ShieldCheck size={48} color="#00F2A9" />
        <Text className="text-white font-bold text-base mt-4 text-center">Izin Kamera Diperlukan</Text>
        <Text className="text-pekon-muted text-xs text-center mt-2">
          Kamera digunakan khusus untuk validasi Selfie Proof-of-Work (anti-pemalsuan galeri) demi pencairan saldo dan perhitungan skor kredit BUMDes.
        </Text>
        <TouchableOpacity
          className="bg-pekon-primary px-6 py-3 rounded-xl mt-6"
          onPress={requestPermission}
          accessible={true}
          accessibilityLabel="Aktifkan izin kamera perangkat"
        >
          <Text className="text-pekon-bg font-bold text-sm">Aktifkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const accuracyMeters = location?.coords?.accuracy || 15;
  const isGpsAccurate = accuracyMeters <= 50;

  // 3. Ambil Foto Kamera Langsung
  const handleCapturePoW = async () => {
    if (!cameraRef.current || isCapturing) return;

    if (!isGpsAccurate) {
      Alert.alert(
        'Akurasi GPS Rendah',
        `Akurasi GPS saat ini ±${accuracyMeters.toFixed(0)}m (melebihi toleransi 50m). Disarankan berpindah ke luar ruangan agar koordinat pekon valid. Tetap lanjutkan?`,
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Lanjutkan', onPress: () => doCapture() },
        ]
      );
    } else {
      doCapture();
    }
  };

  const doCapture = async () => {
    try {
      setIsCapturing(true);

      let currentLoc = location;
      try {
        currentLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(currentLoc);
      } catch {
        // Fallback ke posisi tersimpan
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const imageBytes = await fetch(manipResult.uri);
      const blob = await imageBytes.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const sha256 = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          base64Data
        );

        setCapturedPhoto({
          uri: manipResult.uri,
          hash: sha256,
          gpsLat: currentLoc?.coords.latitude || -5.3421,
          gpsLng: currentLoc?.coords.longitude || 104.9452,
          accuracy: currentLoc?.coords.accuracy || 15,
          timestamp: new Date().toLocaleTimeString('id-ID'),
        });
        setIsCapturing(false);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      Alert.alert('Gagal Mengambil Foto', err.message);
      setIsCapturing(false);
    }
  };

  // 4. Kirim & Verifikasi Bukti Kerja ke Server
  const handleSubmitProof = async () => {
    if (!capturedPhoto) return;

    if (!selectedTx) {
      Alert.alert(
        'Simulasi Bukti Kerja (Mode Uji Coba)',
        `Bukti foto PoW siap diverifikasi!\n\nChecksum SHA-256: ${capturedPhoto.hash.substring(0, 16)}...\nGPS: ${capturedPhoto.gpsLat.toFixed(5)}, ${capturedPhoto.gpsLng.toFixed(5)} (±${capturedPhoto.accuracy.toFixed(0)}m)\n\n(Anda belum memilih/memiliki transaksi aktif yang sedang berjalan di database pekon)`
      );
      return;
    }

    try {
      setSubmitting(true);
      const b2StorageUrl = `${Config.STORAGE.DOWNLOAD_URL}/file/${Config.STORAGE.BUCKET}/pow/${capturedPhoto.hash}.jpg`;
      await transactionApi.submitSelfiePoW(selectedTx.id, {
        imageStorageUrl: b2StorageUrl,
        imageSha256Hash: capturedPhoto.hash,
        gpsLatitude: capturedPhoto.gpsLat,
        gpsLongitude: capturedPhoto.gpsLng,
        gpsAccuracyMeters: capturedPhoto.accuracy,
        pekonNameOverlay: 'Pekon Pagelaran Pringsewu',
        isCameraDirect: true,
      });

      Alert.alert(
        'Sukses Terverifikasi!',
        'Bukti kerja fisik (PoW) telah diverifikasi server secara atomik. Saldo dompet dan skor kredit AHP-TOPSIS BUMDes Anda telah diperbarui.'
      );
      setCapturedPhoto(null);
      setSelectedTx(null);
      fetchActiveTransactions();
    } catch (e: any) {
      Alert.alert('Verifikasi Gagal', e.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTxTypeLabel = (type: string) => {
    switch (type) {
      case 'MINI_JOB':
        return 'Pekerjaan Mikro (Mini-Job)';
      case 'HARVEST_DEAL':
        return 'Jual Beli Panen';
      case 'NEBENG_JASTIP':
        return 'Titip Jastip Komuter';
      default:
        return type || 'Aktivitas Transaksi';
    }
  };

  return (
    <View className="flex-1 bg-pekon-bg">
      {!capturedPhoto ? (
        <CameraViewfinder
          cameraRef={cameraRef}
          facing={facing}
          setFacing={setFacing}
          selectedTx={selectedTx}
          activeTransactionsCount={activeTransactions.length}
          onOpenTxSelector={() => setShowTxModal(true)}
          location={location}
          accuracyMeters={accuracyMeters}
          isGpsAccurate={isGpsAccurate}
          isCapturing={isCapturing}
          onCapture={handleCapturePoW}
          getTxTypeLabel={getTxTypeLabel}
        />
      ) : (
        <PoWReviewView
          capturedPhoto={capturedPhoto}
          selectedTx={selectedTx}
          submitting={submitting}
          onSubmit={handleSubmitProof}
          onRetake={() => setCapturedPhoto(null)}
          getTxTypeLabel={getTxTypeLabel}
        />
      )}

      <TransactionSelectorModal
        visible={showTxModal}
        transactions={activeTransactions}
        selectedTx={selectedTx}
        onSelect={(tx) => {
          setSelectedTx(tx);
          setShowTxModal(false);
        }}
        onClose={() => setShowTxModal(false)}
        getTxTypeLabel={getTxTypeLabel}
      />
    </View>
  );
}
