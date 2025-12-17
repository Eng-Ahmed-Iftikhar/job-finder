import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Job } from "@/sections/dashboard/JobCard";
import ApplyJobSheet from "@/components/ApplyJobSheet";
import SuccessToast from "@/components/SuccessToast";

interface JobDetailContentProps {
  jobId?: string;
}

// Mock data - replace with actual API call
const mockJobDetail: Job & {
  description: string;
  companyName: string;
  companyLocation: string;
  companyOpenJobs: number;
  companyColor: string;
  relatedJobs: Job[];
} = {
  id: "1",
  title: "Restaurant Manager",
  company: "Slices & Dices",
  location: "45 Green str, Austin, TX",
  distance: "0.9 mi from you",
  publishedAt: "Published Jan 23",
  shiftInfo: "Full time",
  rate: "$ 35 / hr",
  imageUrl:
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=60",
  description: `Looking for an experienced Restaurant Manager. Professional mixologists dry ice icecream today's specials Aesop handwash food truck artisnal anything. No signs Heston Bloominthal enjoy your meal foraged greens nuts and berries pastry chef The Basrossa. Field to fork slowcooked the second sitting share plates biodynamic not another parfait this is cold let's have authentic street food. Craft beer drizzle we don't take reservations smoked everything tequilla and lime chicken fish tacos eat out cut brew coffee yuzu curd. Smoked anything organic kale hand roasted coffee beans throwback comfort food with a twist organic a la carte finger licking good locally sourced. Two hours sittings surfing the menu tiramisu braised lamb shoulder quality Australian produce flame grilled wagyu let's eat. Gordon Ramsey on a good day a sneeky kebab the mystery box twice cooked or reheated free wifi kimchi tacos lemon and whiskey sauce. Do you have a reservation who is Marco Pierre White anyway tamarind-glazed beef brisket another burger joint linen napkins The New York Grill.`,
  companyName: "Slices & Dices",
  companyLocation: "Austin, TX",
  companyOpenJobs: 12,
  companyColor: "#f97316",
  relatedJobs: [
    {
      id: "2",
      title: "Bartender for a restaurant – Green Street + medical insurance",
      company: "Slices & Dices",
      location: "Austin, TX",
      shiftInfo: "Full time",
      urgent: true,
      imageUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "3",
      title: "Restaurant Manager",
      company: "Slices & Dices",
      location: "Austin, TX",
      shiftInfo: "Full time",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "4",
      title: "Employee Training Specialist",
      company: "Slices & Dices",
      location: "Austin, TX",
      shiftInfo: "Full time",
      imageUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=60",
    },
  ],
};

function RelatedJobCard({ job }: { job: Job }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(dashboard)/(tabs)/job-detail",
      params: { id: job.id },
    });
  };

  return (
    <Pressable
      className="flex-row items-center gap-3 py-3 px-4 border border-gray-200 rounded-xl mb-3"
      onPress={handlePress}
    >
      <Image
        source={{ uri: job.imageUrl }}
        className="w-12 h-12 rounded-full"
      />
      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <Text
            className="text-base font-semibold text-gray-900 flex-1 mr-2"
            numberOfLines={2}
          >
            {job.title}
          </Text>
          <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
        </View>
        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
          {job.company} • {job.location}
        </Text>
        {job.shiftInfo && (
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-600">{job.shiftInfo}</Text>
          </View>
        )}
      </View>
      {job.urgent && (
        <View className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-orange-500">
          <Text className="text-[10px] font-semibold text-white">SHIFT</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function JobDetailContent({ jobId }: JobDetailContentProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [applySheetVisible, setApplySheetVisible] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const job = mockJobDetail;

  const handleApply = () => {
    setApplySheetVisible(true);
  };

  const handleConfirmApply = (coverLetter: string) => {
    setApplySheetVisible(false);
    setApplied(true);
    setShowSuccessToast(true);
    // Simulate interview scheduling (in real app, this would come from API)
    setTimeout(() => {
      setInterviewScheduled(true);
    }, 500);
  };

  const handleRetractApplication = () => {
    setApplied(false);
    setInterviewScheduled(false);
  };

  const handleAddToCalendar = () => {
    console.log("Add interview to calendar");
    // Implement calendar integration
  };

  const handleShare = () => {
    console.log("Share job:", job.id);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <View className="flex-1 bg-white">
      <SuccessToast
        visible={showSuccessToast}
        message="Applied successfully!"
        onClose={() => setShowSuccessToast(false)}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-4 pt-4">
          {/* Job Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {job.title}
          </Text>

          {/* Published Date */}
          {job.publishedAt && (
            <Text className="text-sm text-gray-500 mb-3">
              {job.publishedAt}
            </Text>
          )}

          {/* Location */}
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-700 flex-1">
              {job.location}
              {job.distance ? ` (${job.distance})` : ""}
            </Text>
          </View>

          {/* Job Type */}
          {job.shiftInfo && (
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
              <Text className="text-sm font-semibold text-gray-900">
                {job.shiftInfo}
              </Text>
            </View>
          )}

          {/* Rate */}
          {job.rate && (
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="cash-outline" size={16} color="#6B7280" />
              <Text className="text-sm font-semibold text-gray-900">
                {job.rate}
              </Text>
            </View>
          )}

          {/* Job Description */}
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Job description
          </Text>
          <Text className="text-sm text-gray-700 leading-6 mb-6">
            {job.description}
          </Text>

          {/* Company Section */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(dashboard)/(tabs)/company-detail",
                params: { id: job.company },
              })
            }
            className="flex-row items-center justify-between py-4 px-4 bg-gray-50 rounded-xl mb-4"
          >
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: job.companyColor }}
              >
                <Ionicons name="storefront" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-base font-semibold text-gray-900"
                  numberOfLines={1}
                >
                  {job.companyName}
                </Text>
                <Text className="text-sm text-gray-600" numberOfLines={1}>
                  {job.companyLocation}
                </Text>
                <Text className="text-sm font-semibold text-azure-radiance-500 mt-1">
                  {job.companyOpenJobs} open jobs
                </Text>
              </View>
            </View>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                console.log("Follow company");
              }}
              className="px-4 py-2 rounded-lg bg-white border border-azure-radiance-200"
            >
              <View className="flex-row items-center gap-1">
                <Ionicons name="add" size={16} color="#1eadff" />
                <Text className="text-sm font-semibold text-azure-radiance-500">
                  Follow
                </Text>
              </View>
            </Pressable>
          </Pressable>

          {/* Related Jobs */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">Jobs</Text>
            <Pressable className="flex-row items-center gap-1">
              <Text className="text-sm font-semibold text-azure-radiance-500">
                See all {job.companyOpenJobs} jobs
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#1eadff" />
            </Pressable>
          </View>

          {job.relatedJobs.map((relatedJob) => (
            <RelatedJobCard key={relatedJob.id} job={relatedJob} />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200">
        {interviewScheduled && (
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-gray-700">
              Job interview scheduled for{"\n"}
              <Text className="font-semibold">Feb 14, 4:30 PM</Text>
            </Text>
            <Pressable onPress={handleAddToCalendar}>
              <Text className="text-sm font-semibold text-azure-radiance-500">
                Add to Google Calendar
              </Text>
            </Pressable>
          </View>
        )}

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="bg-azure-radiance-500 h-14 rounded-xl flex-1 items-center justify-center"
            onPress={applied ? handleRetractApplication : handleApply}
            activeOpacity={0.8}
          >
            {applied ? (
              <View className="flex-row items-center gap-2">
                <Ionicons name="arrow-undo" size={20} color="white" />
                <Text className="text-white font-semibold text-base">
                  Retract application
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-base">
                Apply now
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="w-14 h-14 rounded-xl border border-gray-200 bg-white items-center justify-center"
            onPress={handleBookmark}
            activeOpacity={0.8}
          >
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={22}
              color={bookmarked ? "#1eadff" : "#6B7280"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-14 h-14 rounded-xl border border-gray-200 bg-white items-center justify-center"
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-outline" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ApplyJobSheet
        visible={applySheetVisible}
        onClose={() => setApplySheetVisible(false)}
        onApply={handleConfirmApply}
        jobTitle={job.title}
      />
    </View>
  );
}
