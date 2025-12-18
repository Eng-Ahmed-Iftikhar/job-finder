import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import JobCardMenuIcon from "./jobCardMenuIcon";

export type Job = {
  id: string;
  title: string;
  company: string;
  companyAddress?: string;
  location: string;
  distance?: string;
  publishedAt?: string;
  shiftInfo?: string;
  rate?: string;
  urgent?: boolean;
  imageUrl?: string;
  description?: string;
  jobType?: string;
};

type JobCardProps = {
  job: Job;
  onPress?: () => void;
};

const jobTypeObj: { [key: string]: string } = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const jobTypeIconObj: { [key: string]: string } = {
  FULL_TIME: "briefcase",
  PART_TIME: "time",
  CONTRACT: "document-text",
  INTERNSHIP: "school",
};

function JobCard({ job, onPress }: JobCardProps) {
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
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className="bg-white border border-gray-200 rounded-xl mb-4 overflow-visible"
    >
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
        {job.publishedAt && (
          <Text className="text-xs text-gray-500 mb-2">
            Published{" "}
            {new Date(job.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        )}
        <View className="mb-2 flex-row items-center gap-1">
          <Text
            className="text-sm font-semibold text-gray-700 mb-1"
            numberOfLines={1}
          >
            {job.company}
          </Text>
          {job.companyAddress && (
            <Text
              className="text-xs text-end text-gray-600 mb-1"
              numberOfLines={1}
            >
              {job.companyAddress}
            </Text>
          )}
        </View>

        {job.jobType && (
          <View className="flex-row items-center gap-2 mb-1">
            <Icon
              name={`${jobTypeIconObj[job.jobType] || "briefcase"}-outline`}
              size={14}
              color="#4B5563"
            />
            <Text className="text-xs font-bold text-gray-700" numberOfLines={1}>
              {jobTypeObj[job.jobType]}
            </Text>
          </View>
        )}

        {job.rate && (
          <View className="flex-row items-center gap-2 mb-1">
            <Icon name="cash-outline" size={14} color="#4B5563" />
            <Text className="text-xs font-bold text-gray-700" numberOfLines={1}>
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
          <TouchableOpacity
            className="px-3 py-2 rounded-lg bg-azure-radiance-50"
            onPress={() =>
              router.push({
                pathname: "/(dashboard)/(tabs)/job-detail",
                params: { id: job.id },
              })
            }
          >
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
