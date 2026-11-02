import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

interface MiniJobCardProps {
  job: any;
  onClaimJob: (jobId: string, title: string) => void;
}

export const MiniJobCard: React.FC<MiniJobCardProps> = ({ job, onClaimJob }) => {
  return (
    <View className="bg-pekon-card border border-pekon-border rounded-xl p-4 mb-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-2">
          <Text className="text-white font-bold text-sm">{job.title}</Text>
          <Text className="text-pekon-muted text-xs mt-1" numberOfLines={3}>
            {job.description}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-pekon-primary font-bold text-sm">
            Rp {Number(job.wageAmount).toLocaleString('id-ID')}
          </Text>
          <Text className="text-pekon-subtle text-[10px]">Upah Tunai</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2 mt-3 pt-3 border-t border-pekon-border/60">
        {job.isDisabilityFriendly ? (
          <View className="bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
            <Text className="text-cyan-400 text-[10px] font-bold">RAMAH DISABILITAS</Text>
          </View>
        ) : (
          <View className="bg-slate-700/30 px-2 py-0.5 rounded">
            <Text className="text-slate-400 text-[10px] font-semibold">UMUM</Text>
          </View>
        )}

        <View className="flex-1" />

        {job.status === 'OPEN' ? (
          <TouchableOpacity
            className="bg-pekon-primary px-3 py-1.5 rounded-lg flex-row items-center"
            onPress={() => onClaimJob(job.id, job.title)}
            accessible={true}
            accessibilityLabel={`Ambil tugas ${job.title}`}
          >
            <CheckCircle2 size={13} color="#0F1416" />
            <Text className="text-pekon-bg text-xs font-bold ml-1">Ambil Tugas</Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
            <Text className="text-amber-400 text-xs font-semibold">Terkunci / Berjalan</Text>
          </View>
        )}
      </View>
    </View>
  );
};
