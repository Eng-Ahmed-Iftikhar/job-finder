import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import JobCardMenuIcon from "./jobCardMenuIcon";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  distance?: string;
  publishedAt?: string;
  shiftInfo?: string;
  rate?: string;
  urgent?: boolean;
  imageUrl?: string;
  description?: string;
};

type JobCardProps = {
  job: Job;
  onPress?: () => void;
};

const placeholderImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60";

function JobCard({ job, onPress }: JobCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white border border-gray-200 rounded-xl mb-4 overflow-visible"
    >
      {job.imageUrl && (
        <Image
          source={{ uri: job.imageUrl || placeholderImage }}
          className="w-full h-40"
        />
      )}

      <View className="p-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className="text-lg font-semibold text-gray-900"
            numberOfLines={2}
          >
            {job.title}
          </Text>
          <JobCardMenuIcon
            jobId={job.id}
            jobTitle={job.title}
            jobCompany={job.company}
          />
        </View>

        <Text className="text-sm text-gray-700 mb-1" numberOfLines={1}>
          {job.company}
        </Text>

        <Text className="text-xs text-gray-500 mb-2" numberOfLines={1}>
          {job.location}
          {job.distance ? ` • ${job.distance}` : ""}
        </Text>

        {job.shiftInfo && (
          <View className="flex-row items-center gap-2 mb-1">
            <Icon name="time-outline" size={14} color="#4B5563" />
            <Text className="text-xs text-gray-700" numberOfLines={1}>
              {job.shiftInfo}
            </Text>
          </View>
        )}

        {job.rate && (
          <View className="flex-row items-center gap-2 mb-1">
            <Icon name="cash-outline" size={14} color="#4B5563" />
            <Text className="text-xs text-gray-700" numberOfLines={1}>
              {job.rate}
            </Text>
          </View>
        )}

        {job.description && (
          <Text className="text-sm text-gray-700 mt-2" numberOfLines={3}>
            {job.description}
          </Text>
        )}

        <View className="flex-row items-center justify-between mt-3">
          <TouchableOpacity className="px-3 py-2 rounded-lg bg-azure-radiance-50">
            <Text className="text-azure-radiance-500 text-sm font-semibold">
              Learn more
            </Text>
          </TouchableOpacity>

          {job.urgent && (
            <View className="px-2 py-1 rounded-full bg-orange-100">
              <Text className="text-orange-600 text-xs font-semibold">
                URGENT
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default JobCard;
