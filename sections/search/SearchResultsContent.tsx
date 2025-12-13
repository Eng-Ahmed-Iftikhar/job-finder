import React, { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomSheet from "@/components/ui/BottomSheet";
import SearchJobResultCard from "@/sections/search/SearchJobResultCard";
import { Job } from "@/sections/dashboard/JobCard";
import { useSearch } from "@/hooks/useSearch";

type TabKey = "jobs" | "companies" | "people";

type CompanyItem = {
  id: string;
  name: string;
  location: string;
  openJobs: number;
  color: string;
};

type PeopleItem = {
  id: string;
  name: string;
  location: string;
  mutualConnections: number;
  color: string;
};

const jobsData: Job[] = [
  {
    id: "1",
    title: "Bartender for a restaurant – Green Street + medical insurance",
    company: "Johnny's Best",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    publishedAt: "Published Jan 23",
    shiftInfo: "Shift position • Shift starts 24 Jan 5 PM",
    rate: "$250",
    urgent: true,
    imageUrl:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=60",
    description: "Bartender needed for two shifts at the restaurant tomorrow!",
  },
  {
    id: "2",
    title: "Bartender for a restaurant – Green Street + medical insurance",
    company: "Johnny's Best",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    publishedAt: "Published Jan 23",
    shiftInfo: "Shift position • Shift starts 24 Jan 5 PM",
    rate: "$250",
    urgent: true,
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60",
    description: "Bartender needed for two shifts at the restaurant tomorrow!",
  },
];

const companiesData: CompanyItem[] = [
  {
    id: "c1",
    name: "Bartender Haven",
    location: "Austin, TX",
    openJobs: 3,
    color: "#38bdf8",
  },
  {
    id: "c2",
    name: "Bartender Haven",
    location: "Austin, TX",
    openJobs: 3,
    color: "#fbbf24",
  },
  {
    id: "c3",
    name: "Bartender Haven",
    location: "Austin, TX",
    openJobs: 3,
    color: "#22c55e",
  },
  {
    id: "c4",
    name: "Bartender Haven",
    location: "Austin, TX",
    openJobs: 3,
    color: "#a855f7",
  },
];

const peopleData: PeopleItem[] = [
  {
    id: "p1",
    name: "Bartender A",
    location: "Austin, TX",
    mutualConnections: 2,
    color: "#38bdf8",
  },
  {
    id: "p2",
    name: "Bartender B",
    location: "Austin, TX",
    mutualConnections: 2,
    color: "#16a34a",
  },
  {
    id: "p3",
    name: "Bartender C",
    location: "Austin, TX",
    mutualConnections: 2,
    color: "#ec4899",
  },
  {
    id: "p4",
    name: "Bartender D",
    location: "Austin, TX",
    mutualConnections: 2,
    color: "#f97316",
  },
];

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="mr-5 pb-2">
      <Text
        className={`text-sm font-semibold ${active ? "text-azure-radiance-500" : "text-gray-500"}`}
      >
        {label}
      </Text>
      <View
        className={`h-0.5 mt-1 rounded-full ${active ? "bg-azure-radiance-500" : "bg-transparent"}`}
      />
    </Pressable>
  );
}

function CompanyRow({ item }: { item: CompanyItem }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(dashboard)/(tabs)/company-detail",
          params: { id: item.id },
        })
      }
      className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-white"
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: item.color }}
        >
          <Ionicons name="storefront" size={20} color="white" />
        </View>
        <View>
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={1}>
            {item.location}
          </Text>
          <Text className="text-sm font-semibold text-azure-radiance-500 mt-1">
            {item.openJobs} open jobs
          </Text>
        </View>
      </View>
      <Pressable className="px-4 py-2 rounded-lg bg-azure-radiance-50 border border-azure-radiance-200">
        <Text className="text-sm font-semibold text-azure-radiance-500">
          Follow
        </Text>
      </Pressable>
    </Pressable>
  );
}

function PeopleRow({ item }: { item: PeopleItem }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(dashboard)/(tabs)/profile-detail",
          params: { id: item.id },
        })
      }
      className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-white"
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: item.color }}
        >
          <Ionicons name="person" size={20} color="white" />
        </View>
        <View>
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={1}>
            {item.location}
          </Text>
          <Text className="text-sm font-semibold text-azure-radiance-500 mt-1">
            {item.mutualConnections} mutual connections
          </Text>
        </View>
      </View>
      <Pressable className="px-4 py-2 rounded-lg bg-azure-radiance-50 border border-azure-radiance-200">
        <Text className="text-sm font-semibold text-azure-radiance-500">
          Connect
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default function SearchResultsContent() {
  const { searchQuery, location } = useSearch();

  const [tab, setTab] = useState<TabKey>("jobs");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sheetView, setSheetView] = useState<
    "root" | "employment" | "distance"
  >("root");
  const [employmentTypes, setEmploymentTypes] = useState<{
    [key: string]: boolean;
  }>({
    fullTime: true,
    partTime: true,
    shift: false,
  });
  const [distanceRange] = useState<[number, number]>([0, 5]);

  const jobCount = jobsData.length;
  const companyCount = companiesData.length;
  const peopleCount = peopleData.length;

  const headerSubtitle = useMemo(() => {
    if (tab === "jobs") return `${jobCount} jobs found`;
    if (tab === "companies") return `${companyCount} companies found`;
    return `${peopleCount} people found`;
  }, [tab, jobCount, companyCount, peopleCount]);

  const filteredJobs = jobsData.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openFilters = () => {
    setSheetView("root");
    setFiltersOpen(true);
  };

  const toggleEmploymentType = (key: string) => {
    setEmploymentTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderFilterRoot = () => (
    <View>
      <Pressable
        className="flex-row items-center justify-between py-3"
        onPress={() => setSheetView("employment")}
      >
        <Text className="text-base text-gray-900">Employment type</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-gray-500">
            {Object.keys(employmentTypes)
              .filter((k) => employmentTypes[k])
              .map((k) =>
                k === "fullTime"
                  ? "Full time"
                  : k === "partTime"
                    ? "Part time"
                    : "Shift position"
              )
              .join(", ") || "Any"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
      </Pressable>

      <Pressable
        className="flex-row items-center justify-between py-3"
        onPress={() => setSheetView("distance")}
      >
        <Text className="text-base text-gray-900">Distance</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-gray-500">{`${distanceRange[0]} - ${distanceRange[1]} mi`}</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
      </Pressable>
    </View>
  );

  const renderEmployment = () => (
    <View>
      {[
        { key: "fullTime", label: "Full time" },
        { key: "partTime", label: "Part time" },
        { key: "shift", label: "Shift position" },
      ].map((item) => (
        <Pressable
          key={item.key}
          className="flex-row items-center py-3"
          onPress={() => toggleEmploymentType(item.key)}
        >
          <Ionicons
            name={employmentTypes[item.key] ? "checkbox" : "square-outline"}
            size={22}
            color={employmentTypes[item.key] ? "#1eadff" : "#9CA3AF"}
            style={{ marginRight: 12 }}
          />
          <Text className="text-base text-gray-900">{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderDistance = () => (
    <View className="gap-4">
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-2 px-3 py-2 rounded-lg border border-gray-300">
          <Text className="text-base text-gray-900">0</Text>
        </View>
        <Text className="text-sm text-gray-500">-</Text>
        <View className="flex-row items-center gap-2 px-3 py-2 rounded-lg border border-gray-300">
          <Text className="text-base text-gray-900">5</Text>
        </View>
        <Text className="text-sm text-gray-500">mi</Text>
      </View>
      <View className="h-2 rounded-full bg-azure-radiance-100">
        <View className="h-2 rounded-full bg-azure-radiance-500 w-full" />
      </View>
    </View>
  );

  const renderSheetContent = () => {
    if (sheetView === "employment") {
      return renderEmployment();
    }
    if (sheetView === "distance") {
      return renderDistance();
    }
    return renderFilterRoot();
  };

  const sheetTitle =
    sheetView === "employment"
      ? "Employment type"
      : sheetView === "distance"
        ? "Distance"
        : "Filters";

  const clearFilters = () => {
    setEmploymentTypes({ fullTime: true, partTime: true, shift: false });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-200 px-4 pt-3 pb-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-5">
            <TabButton
              label="Jobs"
              active={tab === "jobs"}
              onPress={() => setTab("jobs")}
            />
            <TabButton
              label="Companies"
              active={tab === "companies"}
              onPress={() => setTab("companies")}
            />
            <TabButton
              label="People"
              active={tab === "people"}
              onPress={() => setTab("people")}
            />
          </View>

          <Pressable onPress={openFilters} className="p-2">
            <Ionicons name="options-outline" size={22} color="#6B7280" />
          </Pressable>
        </View>

        <Text className="text-sm text-gray-500 mt-2 mb-1">
          {headerSubtitle}
        </Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600">{location}</Text>
        </View>
      </View>

      {tab === "jobs" && (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SearchJobResultCard job={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {tab === "companies" && (
        <FlatList
          data={companiesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompanyRow item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {tab === "people" && (
        <FlatList
          data={peopleData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PeopleRow item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      <BottomSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={sheetTitle}
        onClear={sheetView === "root" ? clearFilters : undefined}
        footer={
          <Pressable
            className="bg-azure-radiance-500 h-12 rounded-xl items-center justify-center"
            onPress={() => setFiltersOpen(false)}
          >
            <Text className="text-white font-semibold text-base">
              Show results
            </Text>
          </Pressable>
        }
      >
        {sheetView !== "root" && (
          <Pressable
            className="flex-row items-center gap-2 mb-3"
            onPress={() => setSheetView("root")}
          >
            <Ionicons name="chevron-back" size={20} color="#6B7280" />
            <Text className="text-base text-gray-700">Back</Text>
          </Pressable>
        )}
        {renderSheetContent()}
      </BottomSheet>
    </View>
  );
}
