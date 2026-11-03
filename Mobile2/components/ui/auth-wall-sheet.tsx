import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldAlert, LogIn, ArrowRight } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface AuthWallSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionTitle?: string;
  actionDescription?: string;
}

export const AuthWallSheet: React.FC<AuthWallSheetProps> = ({
  open,
  onOpenChange,
  actionTitle = 'Fitur Ini Memerlukan Akun Warga',
  actionDescription = 'Anda perlu masuk atau mendaftar terlebih dahulu agar transaksi, rute komuter, dan reputasi Proof-of-Work Anda tercatat secara aman di buku besar pekon.',
}) => {
  const router = useRouter();

  const handleGoToLogin = () => {
    onOpenChange(false);
    router.push('/(auth)/login' as any);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheet.Content>
        <BottomSheet.Header title="Akses Terbatas" />
        <BottomSheet.Body>
          <View className="py-2 items-center">
            <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mb-3">
              <ShieldAlert size={28} color="#00F2A9" />
            </View>
            <Text className="text-center font-bold text-base text-foreground mb-1">
              {actionTitle}
            </Text>
            <Text className="text-center text-xs text-muted-foreground leading-relaxed px-2">
              {actionDescription}
            </Text>
          </View>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <View className="gap-2 w-full">
            <Button
              variant="primary"
              size="lg"
              onPress={handleGoToLogin}
              className="w-full flex-row items-center justify-center"
            >
              <LogIn size={16} color="#0F1416" />
              <Text className="text-background font-bold ml-2">Masuk / Daftar Akun</Text>
            </Button>
            <Button
              variant="ghost"
              size="md"
              onPress={() => onOpenChange(false)}
              className="w-full"
            >
              <Text className="text-muted-foreground font-semibold">Nanti Dulu</Text>
            </Button>
          </View>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
};
