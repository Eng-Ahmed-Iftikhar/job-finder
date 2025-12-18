import React, { useMemo } from "react";
import { View, FlatList, RefreshControl, Text } from "react-native";
import JobCard, { Job } from "@/sections/dashboard/JobCard";
import { useGetSuggestedJobsQuery } from "@/api/services/jobsApi";

export default function SuggestedJobsScreen() {
  const { data, isLoading, isFetching, refetch, error } =
    useGetSuggestedJobsQuery();

  const jobs: Job[] = useMemo(() => {
    if (!data) return [];
    return data.map((j) => {
      const firstEmployer = j.employers?.[0]?.employer;
      const firstProfile = firstEmployer?.companyProfiles?.[0];
      const company = firstProfile?.company?.name || "Company";
      const jobType = j?.jobType;

      // Company address with city and state
      const companyAddress = firstProfile
        ? [
            firstProfile.address,
            firstProfile.location?.city,
            firstProfile.location?.state,
          ]
            .filter(Boolean)
            .join(", ")
        : undefined;

      // Prefer job's own location; fallback to company profile location
      const locationStr = j.location
        ? [j.location.city, j.location.state].filter(Boolean).join(", ")
        : firstProfile?.location
          ? [firstProfile.location.city, firstProfile.location.state]
              .filter(Boolean)
              .join(", ")
          : "";

      const currencySymbol = j.currency === "USD" ? "$" : "";
      const rate = j.wage
        ? `${currencySymbol}${j.wage} / ${
            j.wageRate === "HOUR" ? "hr" : j.wageRate?.toLowerCase() || ""
          }`
        : undefined;

      return {
        id: j.id,
        title: j.name,
        company,
        companyAddress,
        location: locationStr,
        rate,
        jobType,
        publishedAt: j.publishAt,
        description: j.description,
      } as Job;
    });
  }, [data]);

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching || isLoading}
            onRefresh={refetch}
          />
        }
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <View className="py-20 items-center">
              <Text className="text-gray-500">No jobs to show</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
