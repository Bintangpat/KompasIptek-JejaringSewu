import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Pekon } from '../../types/entities';

// Master Pekon Kabupaten Pringsewu (Real Database UUIDs)
export const DEFAULT_PEKONS: Pekon[] = [
  {
    id: 'f4616960-e499-44ba-9369-7439449bf5b3',
    kodeKemendagri: '18.10.02.2001',
    namaPekon: 'Pekon Pagelaran',
    kecamatan: 'Pagelaran',
    namaBumdes: 'BUMDes Mandiri Sejahtera Pagelaran',
    latitude: -5.3421,
    longitude: 104.9452,
  },
  {
    id: '9a7ab9cd-15f3-44c0-8186-e90e7b99bdad',
    kodeKemendagri: '18.10.01.1001',
    namaPekon: 'Pringsewu Barat',
    kecamatan: 'Pringsewu',
    namaBumdes: 'BUMDes Karya Bersama Barat',
    latitude: -5.3587,
    longitude: 104.9741,
  },
  {
    id: 'cb24f67f-8755-45a4-9c77-d2dbf0de700a',
    kodeKemendagri: '18.10.03.2001',
    namaPekon: 'Pekon Gading Rejo',
    kecamatan: 'Gading Rejo',
    namaBumdes: 'BUMDes Berkah Gading Rejo',
    latitude: -5.3612,
    longitude: 105.0234,
  },
  {
    id: 'c9c1c49d-bedf-4ac4-a7c9-15b079117d3f',
    kodeKemendagri: '18.10.04.2001',
    namaPekon: 'Pekon Sukoharjo',
    kecamatan: 'Sukoharjo',
    namaBumdes: 'BUMDes Sukoharjo Maju',
    latitude: -5.2981,
    longitude: 104.9912,
  },
  {
    id: '8f2ee080-890a-419a-aea7-6e149ab5229a',
    kodeKemendagri: '18.10.05.2001',
    namaPekon: 'Pekon Ambarawa',
    kecamatan: 'Ambarawa',
    namaBumdes: 'BUMDes Makmur Ambarawa',
    latitude: -5.4123,
    longitude: 104.9621,
  },
];

interface PekonPickerProps {
  label?: string;
  selectedPekonId?: string;
  onSelect: (pekon: Pekon) => void;
  error?: string;
  pekons?: Pekon[];
}

export const PekonPicker: React.FC<PekonPickerProps> = ({
  label = 'Pilih Pekon / Desa',
  selectedPekonId,
  onSelect,
  error,
  pekons,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const list = pekons && pekons.length > 0 ? pekons : DEFAULT_PEKONS;
  const selectedPekon = list.find((p) => p.id === selectedPekonId);

  const filteredPekons = list.filter(
    (p) =>
      p.namaPekon.toLowerCase().includes(search.toLowerCase()) ||
      p.kecamatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Pilih Pekon, saat ini terpilih: ${selectedPekon ? selectedPekon.namaPekon : 'Belum dipilih'}`}
        style={[styles.pickerButton, error ? styles.pickerButtonError : null]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={selectedPekon ? styles.selectedText : styles.placeholderText}>
          {selectedPekon
            ? `${selectedPekon.namaPekon} (Kec. ${selectedPekon.kecamatan})`
            : 'Pilih pekon domisili Anda...'}
        </Text>
      </TouchableOpacity>

      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Pekon Domisili</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                accessibilityLabel="Tutup pilihan pekon"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama pekon atau kecamatan..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              autoFocus
            />

            <FlatList
              data={filteredPekons}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedPekonId;
                return (
                  <TouchableOpacity
                    style={[styles.item, isSelected && styles.itemSelected]}
                    onPress={() => {
                      onSelect(item);
                      setModalVisible(false);
                      setSearch('');
                    }}
                  >
                    <View>
                      <Text style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}>
                        {item.namaPekon}
                      </Text>
                      <Text style={styles.itemSubtitle}>
                        Kecamatan {item.kecamatan}
                      </Text>
                    </View>
                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  pickerButton: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  pickerButtonError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  selectedText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 6,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemSelected: {
    backgroundColor: '#ecfdf5',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  itemTitleSelected: {
    color: '#059669',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 18,
    color: '#059669',
    fontWeight: 'bold',
  },
});
