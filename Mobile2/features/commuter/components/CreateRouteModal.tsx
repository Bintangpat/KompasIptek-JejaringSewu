import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

const PRESET_LOCATIONS = [
  { name: 'Pekon Pagelaran', lat: -5.3421, lng: 104.9452 },
  { name: 'Pekon Sukoharjo', lat: -5.3051, lng: 104.9921 },
  { name: 'Pekon Gadingrejo', lat: -5.3789, lng: 105.0312 },
  { name: 'Pekon Banyumas', lat: -5.2891, lng: 104.9123 },
  { name: 'Pekon Pardasuka', lat: -5.4215, lng: 104.9782 },
  { name: 'Pekon Ambarawa', lat: -5.3621, lng: 104.9812 },
  { name: 'Pasar Induk Pringsewu', lat: -5.3582, lng: 104.9744 },
  { name: 'RSUD Pringsewu', lat: -5.3712, lng: 104.9651 },
  { name: 'Terminal Pringsewu', lat: -5.3521, lng: 104.9811 },
  { name: 'Komplek Pemkab Pringsewu', lat: -5.3601, lng: 104.9902 },
];

interface CreateRouteModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    originName: string;
    destinationName: string;
    originLat: number;
    originLng: number;
    destLat: number;
    destLng: number;
    vehicleType: string;
  }) => Promise<void>;
  submitting: boolean;
}

export const CreateRouteModal: React.FC<CreateRouteModalProps> = ({
  visible,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [originLat, setOriginLat] = useState<number>(-5.3421);
  const [originLng, setOriginLng] = useState<number>(104.9452);
  const [destLat, setDestLat] = useState<number>(-5.3582);
  const [destLng, setDestLng] = useState<number>(104.9744);
  const [vehicleType, setVehicleType] = useState('Motor (Bagasi Sedang)');

  const handleSubmit = async () => {
    await onSubmit({
      originName,
      destinationName,
      originLat,
      originLng,
      destLat,
      destLng,
      vehicleType,
    });
  };

  return (
    <BottomSheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Content>
        <BottomSheet.Header title="Buka Rute Perjalanan Komuter" />

        <BottomSheet.Body>
          <View className="gap-3 py-1">
            {/* Asal Perjalanan */}
            <View>
              <Input
                label="Pekon Asal Perjalanan *"
                value={originName}
                onChangeText={setOriginName}
                placeholder="Contoh: Pekon Pagelaran Utara"
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1.5">
                {PRESET_LOCATIONS.slice(0, 5).map((loc) => (
                  <TouchableOpacity
                    key={loc.name}
                    onPress={() => {
                      setOriginName(loc.name);
                      setOriginLat(loc.lat);
                      setOriginLng(loc.lng);
                    }}
                    className="mr-1.5 bg-card border border-border px-2.5 py-1 rounded-full"
                  >
                    <Text className="text-muted-foreground text-[10px]">{loc.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Tujuan Perjalanan */}
            <View className="mt-1">
              <Input
                label="Tujuan Perjalanan (Pasar/Kota) *"
                value={destinationName}
                onChangeText={setDestinationName}
                placeholder="Contoh: Pasar Induk Pringsewu"
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1.5">
                {PRESET_LOCATIONS.slice(5).map((loc) => (
                  <TouchableOpacity
                    key={loc.name}
                    onPress={() => {
                      setDestinationName(loc.name);
                      setDestLat(loc.lat);
                      setDestLng(loc.lng);
                    }}
                    className="mr-1.5 bg-card border border-border px-2.5 py-1 rounded-full"
                  >
                    <Text className="text-muted-foreground text-[10px]">{loc.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Jenis Kendaraan / Bagasi */}
            <View className="mt-1">
              <Text className="text-muted-foreground text-xs font-semibold mb-1.5">
                Kapasitas Bagasi Kendaraan
              </Text>
              <View className="flex-row gap-2">
                {['Motor (Kardus Sedang)', 'Mobil (Bagasi Luas)'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setVehicleType(type)}
                    className={`flex-1 p-2.5 rounded-xl border items-center ${
                      vehicleType === type
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card border-border'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        vehicleType === type ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex-row items-center mt-1">
              <ShieldCheck size={18} color="#34D399" />
              <Text className="text-emerald-300 text-[11px] ml-2 flex-1">
                Rute Anda akan diverifikasi geospasial via GPS dan terdaftar di Bursa Komuter Pekon.
              </Text>
            </View>
          </View>
        </BottomSheet.Body>

        <BottomSheet.Footer>
          <Button
            variant="primary"
            size="lg"
            loading={submitting}
            onPress={handleSubmit}
            className="w-full"
          >
            Mulai & Buka Rute Perjalanan
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
