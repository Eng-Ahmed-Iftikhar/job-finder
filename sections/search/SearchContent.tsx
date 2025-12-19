import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SearchInput from "@/components/ui/SearchInput";
import LocationInput from "@/components/ui/LocationInput";
import { Job } from "@/sections/dashboard/JobCard";
import SearchResultCard from "@/sections/search/SearchResultCard";
import { useSearch } from "@/hooks/useSearch";

const ACCENT = "#1eadff";

type PopularSearch = {
  id: string;
  query: string;
};

const popularSearches: PopularSearch[] = [
  { id: "1", query: "Bartender" },
  { id: "2", query: "Restaurant manager" },
  { id: "3", query: "Sushi chef" },
];

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Bartender for a restaurant – Green Street + medical insurance",
    company: "Johnny's Best",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    shiftInfo: "Full time",
    rate: "$250",
    imageUrl:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "2",
    title: "Bartender for a restaurant – Green Street + medical insurance",
    company: "BBQ Roadhouse",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    shiftInfo: "Shift position • Shift starts 24 Jan 5 PM",
    rate: "$250",
    urgent: true,
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60",
  },
];

export default function SearchContent() {
  const router = useRouter();
  const { searchQuery, location, setSearchQuery, setLocation } = useSearch();
  const [showResults, setShowResults] = useState(false);

  const navigateToResults = () => {
    router.push("/(dashboard)/(tabs)/search-suggestions");
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowResults(text.length > 0);
  };

  const handlePopularSearchClick = (query: string) => {
    setSearchQuery(query);
    navigateToResults();
  };

  const handleLocationSelect = (selectedLocation: any) => {
    setLocation(selectedLocation.mainText);
  };

  const handleUseCurrentLocation = () => {
    // Implement geolocation logic here
    setLocation("Austin, TX");
  };

  const handleClose = () => {
    router.back();
  };

  const filteredJobs = showResults
    ? mockJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const showPopularSearches = !showResults && searchQuery.length === 0;
  const showJobResults = showResults && searchQuery.length > 0;
  const showSearchSuggestion =
    showResults && searchQuery.length > 0 && filteredJobs.length === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <View className="bg-white border-b border-gray-200 px-4 pt-3 pb-3">
        <View className="mb-3">
          <SearchInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search"
          />
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <LocationInput
              value={location}
              onChangeText={setLocation}
              onLocationSelect={handleLocationSelect}
              onUseCurrentLocation={handleUseCurrentLocation}
              placeholder="Type address or ZIP"
            />
          </View>
          <Pressable onPress={handleClose} className="p-2">
            <Ionicons name="close" size={24} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {showPopularSearches && (
          <View className="px-4 pt-4">
            <Text className="text-sm font-medium font-semibold text-gray-500 mb-3">
              Popular searches
            </Text>
            {popularSearches.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handlePopularSearchClick(item.query)}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <Ionicons
                  name="search"
                  size={18}
                  color="#9CA3AF"
                  style={{ marginRight: 12 }}
                />
                <Text className="text-base text-gray-900">{item.query}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {showSearchSuggestion && (
          <View className="px-4 pt-4">
            <Pressable
              onPress={navigateToResults}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <Ionicons
                name="search"
                size={18}
                color="#9CA3AF"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base text-gray-900">
                Search for {searchQuery}
              </Text>
            </Pressable>
          </View>
        )}

        {showJobResults && (
          <View className="px-4 pt-4">
            <Text className="text-sm font-medium font-semibold text-gray-500 mb-3">
              Jobs
            </Text>
            <FlatList
              data={filteredJobs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SearchResultCard job={item} onPress={navigateToResults} />
              )}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 24 }}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Ionicons
                    name="search-outline"
                    size={48}
                    color="#D1D5DB"
                    style={{ marginBottom: 12 }}
                  />
                  <Text className="text-base text-gray-500 text-center">
                    No jobs found for "{searchQuery}"
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
