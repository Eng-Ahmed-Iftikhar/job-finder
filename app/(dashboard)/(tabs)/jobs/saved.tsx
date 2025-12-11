import React from "react";
import { View, FlatList } from "react-native";
import JobCard, { Job } from "@/sections/dashboard/JobCard";

const savedJobs: Job[] = [
  {
    id: "1",
    title: "Restaurant Manager",
    company: "Slices & Dices",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    shiftInfo: "Full time",
    rate: "$ 35 / hr",
    description: "Looking for an experienced Restaurant Manager",
  },
  {
    id: "2",
    title: "Restaurant Manager",
    company: "Slices & Dices",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    shiftInfo: "Full time",
    rate: "$ 35 / hr",
    description: "Looking for an experienced Restaurant Manager",
  },
];

export default function SavedJobsScreen() {
  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
