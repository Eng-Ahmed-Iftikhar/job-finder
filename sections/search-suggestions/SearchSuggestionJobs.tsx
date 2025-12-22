import { useSearch } from "@/hooks/useSearch";
import React, { useEffect } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { Job } from "../dashboard/JobCard";
import SearchJobResultCard from "../search/SearchJobResultCard";
import {
  useGetSuggestedJobsQuery,
  useLazyGetSuggestedJobsQuery,
} from "@/api/services/jobsApi";
import { SearchJob } from "@/types/search";

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
  {
    id: "3",
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
const PAGE_SIZE = 10;

function SearchSuggestionJobs() {
  const { searchQuery } = useSearch();
  const [page, setPage] = React.useState(1);
  const [jobs, setJobs] = React.useState<SearchJob[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, isLoading, refetch } = useGetSuggestedJobsQuery({
    search: searchQuery,
    page,
    pageSize: PAGE_SIZE,
  });

  const onEndReached = () => {
    if (jobs.length) setPage((prev) => prev + 1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch().unwrap();
    setRefreshing(false);
  };
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setJobs(data.data as SearchJob[]);
        return;
      }
      setJobs((prev) => {
        // Avoid duplicates
        const newJobs = data.data.filter(
          (job) => !prev.find((j) => j.id === job.id)
        );
        return [...prev, ...newJobs] as SearchJob[];
      });
    }
  }, [data, page]);

  return (
    <View className="flex-1 ">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-sm  font-medium text-gray-500 mb-3">
          {data ? data.data.length : 0} job`s found
        </Text>
      </View>
      <View className="bg-white flex-1">
        <FlatList
          data={jobs}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SearchJobResultCard job={item as SearchJob} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Text className="text-base text-gray-500 text-center">
                {isLoading
                  ? "Loading jobs..."
                  : `No jobs found for "${searchQuery}"`}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

export default SearchSuggestionJobs;
