import React from "react";
import { FlatList } from "react-native";
import SearchSuggestionCompanyCard from "./SearchSuggestionCompanyCard";

type CompanyItem = {
  id: string;
  name: string;
  location: string;
  openJobs: number;
  color: string;
};

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
function SearchSuggestionCompanies() {
  return (
    <FlatList
      data={companiesData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SearchSuggestionCompanyCard item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}

export default SearchSuggestionCompanies;
