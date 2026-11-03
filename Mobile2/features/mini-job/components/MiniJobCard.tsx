import React from 'react';
import { View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface MiniJobCardProps {
  job: any;
  onClaimJob: (jobId: string, title: string) => void;
}

export const MiniJobCard: React.FC<MiniJobCardProps> = ({ job, onClaimJob }) => {
  return (
    <Card className="bg-card border-border p-4 mb-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text className="text-foreground font-bold text-sm">{job.title}</Text>
          <Text className="text-muted-foreground text-xs mt-1" numberOfLines={3}>
            {job.description}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-primary font-bold text-sm">
            Rp {Number(job.wageAmount).toLocaleString('id-ID')}
          </Text>
          <Text className="text-muted-foreground text-[10px]">Upah Tunai</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-border">
        {job.isDisabilityFriendly ? (
          <Badge variant="info" size="xs">
            RAMAH DISABILITAS
          </Badge>
        ) : (
          <Badge variant="outline" size="xs">
            UMUM
          </Badge>
        )}

        <View className="flex-1" />

        {job.status === 'OPEN' ? (
          <Button
            variant="primary"
            size="sm"
            onPress={() => onClaimJob(job.id, job.title)}
            className="flex-row items-center"
          >
            <CheckCircle2 size={13} color="#FFFFFF" />
            <Text className="text-primary-foreground text-xs font-bold ml-1">Ambil Tugas</Text>
          </Button>
        ) : (
          <Badge variant="warning" size="sm">
            Terkunci / Berjalan
          </Badge>
        )}
      </View>
    </Card>
  );
};
