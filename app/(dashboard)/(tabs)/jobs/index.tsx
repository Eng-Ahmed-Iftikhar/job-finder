import React from "react";
import { View, FlatList } from "react-native";
import JobCard, { Job } from "@/sections/dashboard/JobCard";

const jobs: Job[] = [
  {
    id: "1",
    title: "Bartender for a restaurant – Green Street + medical insurance",
    company: "Johnny's Best",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    shiftInfo: "Shift position • Shift starts 24 Jan 5 PM",
    rate: "$250",
    urgent: true,
    description: "Bartender needed for two shifts at the restaurant tomorrow!",
    imageUrl:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "2",
    title: "Restaurant Manager",
    company: "Slices & Dices",
    location: "Austin, TX",
    distance: "0.9 mi from you",
    shiftInfo: "Full time",
    rate: "$35 / hr",
    description: "Looking for an experienced Restaurant Manager",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60",
  },
];

export default function SuggestedJobsScreen() {
  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
