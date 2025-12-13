import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Job } from "@/sections/dashboard/JobCard";

interface SearchResultCardProps {
  job: Job;
  onPress?: () => void;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=60";

export default function SearchResultCard({
  job,
  onPress,
}: SearchResultCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/(dashboard)/(tabs)/job-detail",
        params: { id: job.id },
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-start gap-3 py-3 border-b border-gray-100"
    >
      <View className="relative">
        <Image
          source={{ uri: job.imageUrl || fallbackImage }}
          className="w-12 h-12 rounded-full"
        />
        {job.urgent && (
          <View className="absolute -left-2 top-2 px-2 py-0.5 rounded-full bg-orange-500 shadow">
            <Text className="text-[10px] font-semibold text-white">SHIFT</Text>
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text
          className="text-base font-semibold text-gray-900"
          numberOfLines={2}
        >
          {job.title}
        </Text>
        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
          {job.company}
          {job.location ? ` • ${job.location}` : ""}
          {job.distance ? ` (${job.distance})` : ""}
        </Text>

        {(job.shiftInfo || job.rate) && (
          <View className="flex-row items-center gap-3 mt-2">
            {job.shiftInfo && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600" numberOfLines={1}>
                  {job.shiftInfo}
                </Text>
              </View>
            )}
            {job.rate && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="cash-outline" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-600" numberOfLines={1}>
                  {job.rate}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
