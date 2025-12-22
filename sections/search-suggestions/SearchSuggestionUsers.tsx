import React from "react";
import { FlatList } from "react-native";
import SearchSuggestionUserCard from "./SearchSuggestionUserCard";

type PeopleItem = {
  id: string;
  name: string;
  location: string;
  mutualConnections: number;
  color: string;
};
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
function SearchSugesstionUsers() {
  return (
    <FlatList
      data={peopleData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SearchSuggestionUserCard item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}

export default SearchSugesstionUsers;
