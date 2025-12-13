import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomSheet from "@/components/ui/BottomSheet";

type TabKey = "overview" | "jobs" | "posts";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  distance: string;
  publishedDate: string;
  employmentType: string;
  salary: string;
  description: string;
  isUrgent?: boolean;
}

interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  location: string;
  content: string;
  imageUrl?: string;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Bartender for a restaurant – Green Street + medical insurance",
    company: "Johnny's Best",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    publishedDate: "Jan 23",
    employmentType: "Shift position • Shift starts 24 Jan 5 PM",
    salary: "$250",
    description:
      "URGENT!! Bartender needed for two shifts at the restaurant tomorrow!",
    isUrgent: true,
  },
  {
    id: "2",
    title: "Restaurant Manager",
    company: "Slices & Dices",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    publishedDate: "Jan 23",
    employmentType: "Full time",
    salary: "$ 35 / hr",
    description: "Looking for an experienced Restaurant Manager",
  },
  {
    id: "3",
    title: "Employee Training Specialist",
    company: "Slices & Dices",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    publishedDate: "Jan 23",
    employmentType: "Full time",
    salary: "$ 40 / hr",
    description: "Training specialist needed for employee development",
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    authorName: "Johnny's Best",
    authorAvatar: "#38bdf8",
    timestamp: "7:14 PM",
    location: "Austin, TX",
    content:
      "Surf and turf quality Australian produce I'll have the pork belly a la carte closed themed cafe kombucha tatooed waiters marron two ways.",
    imageUrl: "pizza",
  },
  {
    id: "2",
    authorName: "Johnny's Best",
    authorAvatar: "#38bdf8",
    timestamp: "7:14 PM",
    location: "Austin, TX",
    content:
      "Surf and turf quality Australian produce I'll have the pork belly a la carte closed themed cafe kombucha tatooed waiters marron two ways.",
    imageUrl: "pizza",
  },
];

interface CompanyDetailContentProps {
  companyId?: string;
}

export default function CompanyDetailContent({
  companyId,
}: CompanyDetailContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isTabsSticky, setIsTabsSticky] = useState(false);

  // Filter states
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
    string[]
  >([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string[]>([]);

  const employmentTypes = [
    "Full time",
    "Part time",
    "Contract",
    "Internship",
    "Shift position",
  ];

  const salaryRanges = ["Under $20/hr", "$20-$35/hr", "$35-$50/hr", "$50+/hr"];

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleViewJob = (jobId: string) => {
    router.push({
      pathname: "/(dashboard)/(tabs)/job-detail",
      params: { id: jobId },
    });
  };

  const toggleFilter = (
    filter: string,
    selectedFilters: string[],
    setSelectedFilters: (filters: string[]) => void
  ) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <Pressable
      onPress={() => handleViewJob(item.id)}
      className="bg-white p-4 border-b border-gray-100"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-start gap-3 flex-1">
          <View className="w-10 h-10 rounded-lg bg-orange-500 items-center justify-center">
            <Ionicons name="restaurant" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-1">
              {item.title}
            </Text>
            <Text className="text-xs text-gray-500 mb-1">
              Published {item.publishedDate}
            </Text>
          </View>
        </View>
        <Pressable className="p-1">
          <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
        </Pressable>
      </View>

      <View className="flex-row items-center gap-1 mb-2">
        <Text className="text-sm font-medium text-gray-900">
          {item.company}
        </Text>
        <Text className="text-sm text-gray-500">
          • {item.location} ({item.distance})
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mb-2">
        <View className="flex-row items-center gap-1">
          <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600">{item.employmentType}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600">{item.salary}</Text>
        </View>
      </View>

      {item.isUrgent && (
        <View className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-2">
          <Text className="text-xs font-semibold text-orange-600">
            {item.description}
          </Text>
        </View>
      )}

      {!item.isUrgent && (
        <Text className="text-sm text-gray-600 mb-2">{item.description}</Text>
      )}

      <Pressable>
        <Text className="text-sm font-semibold text-azure-radiance-500">
          Learn more
        </Text>
      </Pressable>
    </Pressable>
  );

  const renderPostItem = ({ item }: { item: Post }) => (
    <View className="bg-white p-4 border-b border-gray-100">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-start gap-3 flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: item.authorAvatar }}
          >
            <Ionicons name="restaurant" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">
              {item.authorName}
            </Text>
            <Text className="text-xs text-gray-500">
              {item.timestamp} • {item.location}
            </Text>
          </View>
        </View>
        <Pressable className="p-1">
          <Ionicons name="share-outline" size={20} color="#6B7280" />
        </Pressable>
      </View>

      <Text className="text-sm text-gray-700 mb-3">{item.content}</Text>

      {item.imageUrl && (
        <View className="w-full h-64 bg-orange-500 rounded-lg overflow-hidden">
          <View className="w-full h-full items-center justify-center">
            <Ionicons name="pizza" size={80} color="white" />
          </View>
        </View>
      )}
    </View>
  );

  const renderOverviewContent = () => (
    <View className="flex-1">
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">About</Text>
        <Text className="text-sm text-gray-700 leading-6">
          Looking for an experienced Restaurant Manager. Professional
          mixologists dry ice icecream today's specials Aesop Wahlqvist Alec
          ethically sourcing. No signs Heston Bloomihill enjoy your meal forged
          biodynamic so to fork slowcooked the second sitting share plates
          biodynamic we're into it. Charred Robuchon authentic street food.
          Craft beer drizzle we don't take reservations smoked everything
          tequila and lime forest fish foam quail brie roll off the roof on
          chard yaazu curd. Smoked anything organic kale hand roasted coffee
          beans comfort food just a twist organic a la carte finger licking good
          locally sourced. Two hours sittings surfing the menu tiramisu braised
          lamb shoulder quality Australian produce flame grilled sheep's milk
          eat. Gordon Ramsey on a good day a sneeky kebab the mystery box twice
          cooked or reheated free wifi kimchi tacos lemon and whiskey sauce. Do
          you do take away reservation time who is Marco Pierre White anyway
          tamarind-glazed beef brisket another absolute dish hot spiced honey
          it's to die for at Metro Pizza Grill.
        </Text>
      </View>

      {/* Jobs Section */}
      <View className="border-t border-gray-100 p-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Jobs</Text>
        {mockJobs.slice(0, 3).map((job) => (
          <Pressable
            key={job.id}
            onPress={() => handleViewJob(job.id)}
            className="flex-row items-center gap-3 py-3 border-b border-gray-100"
          >
            <View className="w-12 h-12 rounded-lg bg-orange-500 items-center justify-center">
              <Ionicons name="restaurant" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 mb-1">
                {job.title}
              </Text>
              <Text className="text-xs text-gray-600">
                {job.company} • {job.location}
              </Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Ionicons name="briefcase-outline" size={12} color="#6B7280" />
                <Text className="text-xs text-gray-500">
                  {job.employmentType}
                </Text>
              </View>
            </View>
            <Pressable className="p-1">
              <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
            </Pressable>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setActiveTab("jobs")}
          className="flex-row items-center justify-between py-3"
        >
          <Text className="text-sm font-semibold text-azure-radiance-500">
            See all 12 jobs
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#1eadff" />
        </Pressable>
      </View>

      {/* Posts Section */}
      <View className="border-t border-gray-100 p-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">Posts</Text>
        {mockPosts.slice(0, 2).map((post) => (
          <View key={post.id} className="mb-4">
            <View className="flex-row items-start gap-3 mb-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: post.authorAvatar }}
              >
                <Ionicons name="restaurant" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-900">
                  {post.authorName}
                </Text>
                <Text className="text-xs text-gray-500">
                  {post.timestamp} • {post.location}
                </Text>
              </View>
              <Pressable className="p-1">
                <Ionicons name="share-outline" size={18} color="#6B7280" />
              </Pressable>
            </View>
            <Text className="text-sm text-gray-700 mb-3">{post.content}</Text>
            {post.imageUrl && (
              <View className="w-full h-48 bg-orange-500 rounded-lg overflow-hidden">
                <View className="w-full h-full items-center justify-center">
                  <Ionicons name="pizza" size={60} color="white" />
                </View>
              </View>
            )}
          </View>
        ))}
        <Pressable
          onPress={() => setActiveTab("posts")}
          className="flex-row items-center justify-between py-3"
        >
          <Text className="text-sm font-semibold text-azure-radiance-500">
            See all 12 posts
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#1eadff" />
        </Pressable>
      </View>
    </View>
  );

  const renderJobsContent = () => (
    <View className="flex-1">
      {/* Search and Filter Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center gap-3">
        <View className="flex-1 flex-row items-center bg-gray-50 rounded-lg px-3 h-10">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm text-gray-900"
          />
        </View>
        <Pressable
          onPress={() => setShowFilters(true)}
          className="w-10 h-10 items-center justify-center bg-gray-50 rounded-lg"
        >
          <Ionicons name="options-outline" size={20} color="#374151" />
        </Pressable>
      </View>

      {/* Jobs Count */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Text className="text-sm text-gray-600">
          {mockJobs.length} jobs found
        </Text>
      </View>

      {/* Jobs List */}
      <FlatList
        data={mockJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-gray-50"
      />
    </View>
  );

  const renderPostsContent = () => (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 h-10">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm text-gray-900"
          />
        </View>
      </View>

      {/* Posts Count */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Text className="text-sm text-gray-600">
          {mockPosts.length} posts found
        </Text>
      </View>

      {/* Posts List */}
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-gray-50"
      />
    </View>
  );

  const renderEmptyJobs = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="briefcase-outline" size={40} color="#9CA3AF" />
      </View>
      <Text className="text-base font-medium text-gray-900">
        This company doesn't have any jobs yet
      </Text>
    </View>
  );

  const renderEmptyPosts = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="image-outline" size={40} color="#9CA3AF" />
      </View>
      <Text className="text-base font-medium text-gray-900">
        This company hasn't posted yet
      </Text>
    </View>
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsTabsSticky(offsetY > 280);
      },
    }
  );

  const tabOpacity = scrollY.interpolate({
    inputRange: [250, 280],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const tabTranslateY = scrollY.interpolate({
    inputRange: [250, 280],
    outputRange: [-10, 0],
    extrapolate: "clamp",
  });

  const renderTabBar = (isSticky: boolean = false) => (
    <View
      className={`flex-row bg-white ${
        isSticky
          ? "border-b border-gray-200 shadow-sm"
          : "border-t border-gray-200"
      }`}
    >
      <Pressable
        onPress={() => setActiveTab("overview")}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-sm font-semibold ${
            activeTab === "overview"
              ? "text-azure-radiance-500"
              : "text-gray-500"
          }`}
        >
          Overview
        </Text>
        {activeTab === "overview" && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
        )}
      </Pressable>

      <Pressable
        onPress={() => setActiveTab("jobs")}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-sm font-semibold ${
            activeTab === "jobs" ? "text-azure-radiance-500" : "text-gray-500"
          }`}
        >
          Jobs
        </Text>
        {activeTab === "jobs" && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
        )}
      </Pressable>

      <Pressable
        onPress={() => setActiveTab("posts")}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-sm font-semibold ${
            activeTab === "posts" ? "text-azure-radiance-500" : "text-gray-500"
          }`}
        >
          Posts
        </Text>
        {activeTab === "posts" && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
        )}
      </Pressable>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Sticky Tab Bar - Appears when scrolling */}
      {isTabsSticky && (
        <Animated.View
          style={{
            opacity: tabOpacity,
            transform: [{ translateY: tabTranslateY }],
          }}
          className="absolute top-0 left-0 right-0 z-10 bg-white"
        >
          {renderTabBar(true)}
        </Animated.View>
      )}

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <View className="bg-white border-b border-gray-100">
          <View className="p-4">
            {/* Company Logo */}
            <View className="w-16 h-16 rounded-full bg-azure-radiance-500 items-center justify-center mb-3">
              <Ionicons name="storefront" size={32} color="white" />
            </View>

            {/* Company Name and Location */}
            <Text className="text-xl font-bold text-gray-900 mb-1">
              Hungry Joe's
            </Text>
            <Text className="text-sm text-gray-600 mb-2">Austin, TX</Text>

            {/* Followers Info */}
            <View className="flex-row items-center mb-3">
              <Text className="text-sm">
                <Text className="text-azure-radiance-500 font-semibold">
                  26 followers
                </Text>
                <Text className="text-gray-600"> • </Text>
                <Text className="text-azure-radiance-500 font-semibold">
                  4 of your connections
                </Text>
                <Text className="text-gray-600"> follow</Text>
              </Text>
            </View>

            {/* Website Link */}
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="link-outline" size={16} color="#1eadff" />
              <Text className="text-sm text-azure-radiance-500 font-medium">
                hungryjoes.com
              </Text>
            </View>

            {/* Follow Button */}
            <Pressable
              onPress={handleFollowToggle}
              className={`flex-row items-center justify-center gap-2 py-2.5 rounded-lg ${
                isFollowing
                  ? "bg-gray-100 border border-gray-300"
                  : "bg-azure-radiance-500"
              }`}
            >
              <Ionicons
                name={isFollowing ? "checkmark" : "add"}
                size={18}
                color={isFollowing ? "#374151" : "white"}
              />
              <Text
                className={`text-sm font-semibold ${
                  isFollowing ? "text-gray-900" : "text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </Pressable>
          </View>

          {/* Tab Navigation - Static */}
          {renderTabBar(false)}
        </View>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverviewContent()}
        {activeTab === "jobs" && renderJobsContent()}
        {activeTab === "posts" && renderPostsContent()}
      </Animated.ScrollView>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
      >
        <View className="py-4">
          {/* Employment Type */}
          <View className="px-4 mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-3">
              Employment type
            </Text>
            {employmentTypes.map((type) => (
              <Pressable
                key={type}
                onPress={() =>
                  toggleFilter(
                    type,
                    selectedEmploymentTypes,
                    setSelectedEmploymentTypes
                  )
                }
                className="flex-row items-center justify-between py-3 border-b border-gray-100"
              >
                <Text className="text-sm text-gray-700">{type}</Text>
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    selectedEmploymentTypes.includes(type)
                      ? "bg-azure-radiance-500 border-azure-radiance-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedEmploymentTypes.includes(type) && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Salary Range */}
          <View className="px-4 mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-3">
              Salary range
            </Text>
            {salaryRanges.map((range) => (
              <Pressable
                key={range}
                onPress={() =>
                  toggleFilter(
                    range,
                    selectedSalaryRange,
                    setSelectedSalaryRange
                  )
                }
                className="flex-row items-center justify-between py-3 border-b border-gray-100"
              >
                <Text className="text-sm text-gray-700">{range}</Text>
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    selectedSalaryRange.includes(range)
                      ? "bg-azure-radiance-500 border-azure-radiance-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedSalaryRange.includes(range) && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Apply Filters Button */}
          <View className="px-4">
            <Pressable
              onPress={() => setShowFilters(false)}
              className="bg-azure-radiance-500 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
