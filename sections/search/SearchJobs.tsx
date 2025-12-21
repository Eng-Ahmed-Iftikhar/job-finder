import { useSearch } from "@/hooks/useSearch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import SearchResultCard from "./SearchResultCard";

function SearchJobs() {
  const { jobs, searchText } = useSearch();
  const router = useRouter();

  const navigateToResults = () => {
    router.push("/(dashboard)/(tabs)/search-suggestions");
  };
  if (!jobs.length) {
    return null;
  }
  return (
    <View className=" pt-4">
      <View className="flex-row px-3">
        <Text className="text-sm flex-1 font-medium  text-gray-500 mb-3">
          Jobs
        </Text>
        <TouchableOpacity
          className="flex-row items-center gap-1 "
          onPress={navigateToResults}
        >
          <Text className="text-sm font-medium  text-blue-600 mb-3">
            See all jobs
          </Text>
          <Ionicons
            name="chevron-forward"
            size={15}
            color="#3B82F6"
            style={{ marginBottom: 12 }}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={jobs}
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
              No jobs found for "{searchText}"
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default SearchJobs;
