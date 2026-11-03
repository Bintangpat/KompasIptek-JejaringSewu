import React, { useState } from 'react';
import { View } from 'react-native';
import { HeartHandshake } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

interface CreateMiniJobModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    wageAmount: number;
    isDisabilityFriendly: boolean;
  }) => Promise<void>;
  submitting: boolean;
}

export const CreateMiniJobModal: React.FC<CreateMiniJobModalProps> = ({
  visible,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobWage, setJobWage] = useState('');
  const [jobIsDisabilityFriendly, setJobIsDisabilityFriendly] = useState(true);

  const handleSubmit = async () => {
    const wage = parseFloat(jobWage);
    if (!jobTitle.trim() || !jobDescription.trim() || isNaN(wage) || wage <= 0) return;

    await onSubmit({
      title: jobTitle.trim(),
      description: jobDescription.trim(),
      wageAmount: wage,
      isDisabilityFriendly: jobIsDisabilityFriendly,
    });
    setJobTitle('');
    setJobDescription('');
    setJobWage('');
  };

  return (
    <BottomSheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Content>
        <BottomSheet.Header title="Buka Lowongan Kerja Mikro" />

        <BottomSheet.Body>
          <View className="gap-3.5 py-1">
            <View className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex-row items-center">
              <HeartHandshake size={18} color="#10B981" />
              <Text className="text-foreground text-xs ml-2 flex-1">
                Berdayakan tenaga kerja warga desa dengan upah harian adil dan perlindungan reputasi.
              </Text>
            </View>

            <Input
              label="Judul Tugas / Pekerjaan *"
              placeholder="Misal: Sortir Biji Kopi, Bersihkan Saluran Air"
              value={jobTitle}
              onChangeText={setJobTitle}
            />

            <Input
              label="Deskripsi & Instruksi Kerja *"
              placeholder="Tuliskan detail pekerjaan, lokasi dan estimasi durasi..."
              value={jobDescription}
              onChangeText={setJobDescription}
            />

            <Input
              label="Nominal Upah Tunai (Rp) *"
              placeholder="Contoh: 35000"
              keyboardType="numeric"
              value={jobWage}
              onChangeText={setJobWage}
            />

            {/* Inclusivity Switch */}
            <Card className="bg-card border-border p-3.5 flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-foreground font-semibold text-xs">
                  Inklusif Ramah Disabilitas
                </Text>
                <Text className="text-muted-foreground text-[10px] mt-0.5">
                  Tugas dapat dikerjakan rekan disabilitas fisik / sensorik.
                </Text>
              </View>
              <Switch
                value={jobIsDisabilityFriendly}
                onValueChange={setJobIsDisabilityFriendly}
                size="md"
              />
            </Card>
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
            Publikasikan Tugas ke Pekon
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
