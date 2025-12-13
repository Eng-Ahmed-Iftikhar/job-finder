import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Job } from "@/sections/dashboard/JobCard";

interface Props {
  job: Job;
  onPress?: () => void;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=60";

export default function SearchJobResultCard({ job, onPress }: Props) {
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
      className="bg-white py-4 px-4 border-b border-gray-200"
    >
      <View className="flex-row items-start gap-3">
        <View className="relative">
          <Image
            source={{ uri: job.imageUrl || fallbackImage }}
            className="w-12 h-12 rounded-full"
          />
          {job.urgent && (
            <View className="absolute -left-2 top-2 px-2 py-0.5 rounded-full bg-orange-500 shadow">
              <Text className="text-[10px] font-semibold text-white">
                SHIFT
              </Text>
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
          {job.publishedAt && (
            <Text className="text-xs text-gray-500 mt-1">
              {job.publishedAt}
            </Text>
          )}

          <Text className="text-sm text-gray-700 mt-1" numberOfLines={1}>
            {job.company}
            {job.location ? ` • ${job.location}` : ""}
            {job.distance ? ` (${job.distance})` : ""}
          </Text>

          <View className="flex-row items-center gap-3 mt-2">
            {job.shiftInfo && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-700" numberOfLines={1}>
                  {job.shiftInfo}
                </Text>
              </View>
            )}
            {job.rate && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="cash-outline" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-700" numberOfLines={1}>
                  {job.rate}
                </Text>
              </View>
            )}
          </View>

          {job.description && (
            <Text className="text-sm text-gray-800 mt-2" numberOfLines={2}>
              {job.description}
            </Text>
          )}

          <Pressable className="mt-3" onPress={handlePress}>
            <Text className="text-sm font-semibold text-azure-radiance-500">
              Learn more
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
