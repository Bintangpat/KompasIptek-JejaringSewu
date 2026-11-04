import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowLeft, ArrowRight, Share2 } from 'lucide-react-native'
import { AmbientRadialGlow } from '@/components/ui/radial-gradient'

import { SecureStorage, STORAGE_KEYS } from '@/services/secure-storage'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface SlideInfo {
  id: string
  type: 'info' | 'cta'
  title?: string
  description?: string
}

const SLIDES: SlideInfo[] = [
  {
    id: 'slide-1',
    type: 'info',
    title: 'Logistik Komuter & Nebeng-Jastip\nSearah',
    description:
      'Menghubungkan mobilitas komuter antar-pekon di Pringsewu dengan pengiriman hasil tani dan titipan belanja harian rute searah secara efisien dan transparan.',
  },
  {
    id: 'slide-2',
    type: 'info',
    title: 'Bursa Panen & Mini-Job Inklusif',
    description:
      'Membuka akses pasar hasil tani langsung ke BUMDes dan kesempatan kerja mikro fisik harian yang ramah disabilitas dan lansia tanpa diskriminasi.',
  },
  {
    id: 'slide-3',
    type: 'info',
    title: 'Selfie Proof-of-Work (PoW) &\nSkor Kredit BUMDes',
    description:
      'Validasi kerja fisik harian warga dengan geotag GPS presisi tinggi dan pencatatan presensi tanpa birokrasi rumit untuk membuka skor kelayakan kredit mikro BUMDes secara instan.',
  },
  {
    id: 'slide-4',
    type: 'cta',
  },
]

export default function InformationScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  // Tandai onboarding selesai dan arahkan ke tujuan
  const completeOnboarding = async (
    targetRoute: '/(tabs)/commuter' | '/(auth)/register',
  ) => {
    try {
      await SecureStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true')
    } catch (e) {
      console.warn('[InformationScreen] Gagal menyimpan status onboarding:', e)
    }

    if (targetRoute === '/(tabs)/commuter') {
      router.replace(targetRoute)
    } else {
      router.push(targetRoute as any)
    }
  }

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIdx = currentIndex + 1
      flatListRef.current?.scrollToIndex({ index: nextIdx, animated: true })
      setCurrentIndex(nextIdx)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1
      flatListRef.current?.scrollToIndex({ index: prevIdx, animated: true })
      setCurrentIndex(prevIdx)
    }
  }

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize)
    if (index >= 0 && index < SLIDES.length && index !== currentIndex) {
      setCurrentIndex(index)
    }
  }

  const isLastSlide = currentIndex === SLIDES.length - 1

  return (
    <View style={styles.rootContainer}>
      <StatusBar style='light' />

      {/* Layer Ambient Glow */}
      <AmbientRadialGlow
        size={280}
        color='#00F2A9'
        maxOpacity={0.22}
        style={styles.ambientGlowTop}
      />
      <AmbientRadialGlow
        size={240}
        color='#00A572'
        maxOpacity={0.18}
        style={styles.ambientGlowBottom}
      />

      {/* VIEW PENUTUP DI ATAS SAFE AREA (Menutup gradient yang tembus ke status bar) */}
      <View
        style={[
          styles.topCoverMask,
          { height: insets.top, backgroundColor: '#101417' },
        ]}
        pointerEvents='none'
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* 1. Header: TopAppBar (Figma: Nav - Shared Component: TopAppBar) */}
        <View style={styles.topAppBar}>
          <View style={styles.leadingBrand}>
            <View style={styles.iconBox}>
              <Share2 size={18} color='#00F2A9' />
            </View>
            <View style={styles.brandTextContainer}>
              <View style={styles.brandRow}>
                <Text style={styles.brandTitle}>JEJARING-SEWU</Text>
                <View style={styles.regionBadge}>
                  <Text style={styles.regionBadgeText}>KAB. PRINGSEWU</Text>
                </View>
              </View>
              <Text style={styles.brandSubtitle}>SINERGI-PEKON DIGITAL</Text>
            </View>
          </View>
        </View>

        {/* 2. Carousel Stepper & Action Header (Figma Accurate) */}
        <View style={styles.stepperHeader}>
          <View style={styles.pillContainer}>
            {SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.capsule,
                  idx === currentIndex
                    ? styles.capsuleActive
                    : styles.capsuleInactive,
                ]}
              />
            ))}
          </View>

          {/* Tombol Lewati di Header (Hanya di slide 1, 2, 3) */}
          {!isLastSlide ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => completeOnboarding('/(tabs)/commuter')}
              style={styles.skipButton}
            >
              <Text style={styles.skipButtonText}>Lewati</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipButtonPlaceholder} />
          )}
        </View>

        {/* 3. Main Slide Viewport (Horizontal FlatList) */}
        <View style={styles.viewportContainer}>
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={[styles.slideContainer, { width: SCREEN_WIDTH }]}>
                {item.type === 'info' ? (
                  /* Slide Informasi (Slide 1, 2, 3) - Tipografi Murni Ringan Figma */
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>{item.title}</Text>
                    <Text style={styles.infoDescription}>
                      {item.description}
                    </Text>
                  </View>
                ) : (
                  /* Slide 4: Call-To-Action (Figma: Information Slide 4) */
                  <View style={styles.ctaContent}>
                    {/* Blok 1: Daftar */}
                    <View style={styles.blockDaftar}>
                      {/* Baris 1 & 2 */}
                      <Text style={styles.headingText}>
                        Daftar Menjadi{'\n'}Bagian Dari
                      </Text>

                      {/* Baris 3: Teks "Kami" berdampingan langsung dengan Tombol */}
                      <View style={styles.inlineRow}>
                        <Text style={styles.headingText}>Kami</Text>

                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => completeOnboarding('/(auth)/register')}
                          style={styles.inlineDaftarBtn}
                        >
                          <Text style={styles.inlineDaftarBtnText}>Daftar</Text>
                          <ArrowRight size={16} color='#002113' />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Blok 2: Eksplor */}
                    <View style={[styles.ctaBlock, { marginTop: 28 }]}>
                      <Text style={styles.ctaTitle}>
                        Atau Ekplor{'\n'}Terlebih Dahulu
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => completeOnboarding('/(tabs)/commuter')}
                        style={styles.ctaEksplorButton}
                      >
                        <LinearGradient
                          colors={['#00F2A9', '#163E34', '#00F2A9']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.ctaEksplorGradient}
                        >
                          <Text style={styles.ctaEksplorButtonText}>
                            Eksplor
                          </Text>
                          <ArrowRight size={16} color='#FFFFFF' />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          />
        </View>

        {/* 4. Bottom Dynamic Navigation Footer (Figma Accurate) */}
        <View style={styles.bottomFooter}>
          {/* Kontrol Navigasi Berdasarkan State Slide */}
          {currentIndex === 0 ? (
            /* Slide 1: Tombol Penuh 'Selanjutnya →' */
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNext}
              style={styles.fullNextButton}
            >
              <Text style={styles.fullNextButtonText}>Selanjutnya</Text>
              <ArrowRight size={16} color='#002113' />
            </TouchableOpacity>
          ) : currentIndex === 1 || currentIndex === 2 ? (
            /* Slide 2 & 3: Tombol Berdampingan [← Sebelumnya] & [Selanjutnya →] */
            <View style={styles.dualNavRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePrev}
                style={styles.prevButton}
              >
                <ArrowLeft size={16} color='#DFE2EB' />
                <Text style={styles.prevButtonText}>Sebelumnya</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleNext}
                style={styles.dualNextButton}
              >
                <Text style={styles.dualNextButtonText}>Selanjutnya</Text>
                <ArrowRight size={16} color='#002113' />
              </TouchableOpacity>
            </View>
          ) : (
            /* Slide 4 (Terakhir): Tombol Penuh [← Sebelumnya] */
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePrev}
              style={styles.fullPrevButton}
            >
              <ArrowLeft size={16} color='#DFE2EB' />
              <Text style={styles.prevButtonText}>Sebelumnya</Text>
            </TouchableOpacity>
          )}

          {/* Tautan Masuk di Paling Bawah (Tampil di Semua Slide) */}
          <Pressable
            onPress={() => router.push('/(auth)/login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Sudah memiliki akun warga?{' '}
              <Text style={styles.loginLinkHighlight}>Masuk di sini</Text>
              <Text style={styles.loginLinkHighlight}> ›</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#101417',
  },
  topCoverMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Menjamin berada di atas gradient
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // Dibuat transparan agar warna background diambil dari rootContainer
    justifyContent: 'space-between',
    zIndex: 20,
  },

  /* Atmospheric Ambient Glows */
  ambientGlowTop: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: 80,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  headingText: {
    fontFamily: 'Geist-ExtraBold', // atau fontWeight: '800'
    fontSize: 48,
    color: '#FFFFFF',
    lineHeight: 53,
    letterSpacing: -0.5,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Jarak antara kata "Kami" dan tombol
  },
  inlineDaftarBtn: {
    flex: 1, // Mengisi sisa ruang kosong ke kanan
    height: 48,
    backgroundColor: '#00F2A9',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  inlineDaftarBtnText: {
    fontFamily: 'Geist-Bold',
    fontSize: 14,
    color: '#002113',
  },
  /* TopAppBar */
  topAppBar: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 20, 23, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 74, 65, 0.3)',
  },
  leadingBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1C2023',
    borderWidth: 1,
    borderColor: 'rgba(59, 74, 65, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontFamily: 'Geist-Bold',
    fontSize: 15,
    color: '#C1FFDD',
    letterSpacing: -0.3,
  },
  regionBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  regionBadgeText: {
    fontFamily: 'GeistMono-SemiBold',
    fontSize: 9,
    color: '#22D3EE',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontFamily: 'GeistMono-Regular',
    fontSize: 10,
    color: '#B9CBBF',
    marginTop: 1,
  },

  /* Stepper & Counter Header */
  stepperHeader: {
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capsule: {
    height: 6,
    borderRadius: 9999,
  },
  capsuleActive: {
    width: 32,
    backgroundColor: '#00F2A9',
    shadowColor: '#00F2A9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 3,
  },
  capsuleInactive: {
    width: 10,
    backgroundColor: '#3B4A41',
  },
  skipButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  skipButtonText: {
    fontFamily: 'GeistMono-Medium',
    fontSize: 12,
    color: '#B9CBBF',
  },
  skipButtonPlaceholder: {
    width: 48,
  },

  /* Viewport Container */
  viewportContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  /* Slide 1, 2, 3 Info Content */
  infoContent: {
    paddingVertical: 20,
    gap: 12,
  },
  infoTitle: {
    fontFamily: 'Geist-Bold',
    fontSize: 22,
    color: '#E0E3E7',
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  infoDescription: {
    fontFamily: 'Geist-Regular',
    fontSize: 13,
    color: '#B9CBBF',
    lineHeight: 21,
  },

  /* Slide 4 CTA Content */
  ctaContent: {
    paddingVertical: 16,
    justifyContent: 'center',
  },
  blockDaftar: {
    gap: 12,
  },
  ctaBlock: {
    gap: 12,
  },
  ctaTitle: {
    fontFamily: 'Geist-ExtraBold',
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  ctaDaftarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00F2A9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
    minWidth: 160,
    shadowColor: '#00F2A9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaDaftarButtonText: {
    fontFamily: 'Geist-Bold',
    fontSize: 13,
    color: '#002113',
  },
  ctaEksplorButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  ctaEksplorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  ctaEksplorButtonText: {
    fontFamily: 'Geist-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },

  /* Bottom Footer */
  bottomFooter: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  fullNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00F2A9',
    height: 44,
    borderRadius: 8,
    shadowColor: '#00F2A9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  fullNextButtonText: {
    fontFamily: 'Geist-Bold',
    fontSize: 13,
    color: '#002113',
  },
  dualNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prevButton: {
    width: 116,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1C2023',
    borderWidth: 1,
    borderColor: '#3B4A41',
    borderRadius: 8,
  },
  prevButtonText: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 13,
    color: '#DFE2EB',
  },
  dualNextButton: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00F2A9',
    borderRadius: 8,
    shadowColor: '#00F2A9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  dualNextButtonText: {
    fontFamily: 'Geist-Bold',
    fontSize: 13,
    color: '#002113',
  },
  fullPrevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1C2023',
    borderWidth: 1,
    borderColor: '#3B4A41',
    height: 44,
    borderRadius: 8,
  },
  loginLink: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  loginLinkText: {
    fontFamily: 'Geist-Regular',
    fontSize: 12,
    color: '#B9CBBF',
  },
  loginLinkHighlight: {
    fontFamily: 'Geist-SemiBold',
    color: '#00F2A9',
  },
})
