import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { FollowRow, FollowedCompany } from "./FollowRow";
import { EmptyState } from "./EmptyState";
import { useAppSelector } from "@/hooks/useAppSelector";

export function FollowingList({ search }: { search: string }) {
  const followedCompanies = useAppSelector(
    (state) => state.user.followedCompanies
  );

  const filteredFollowing = useMemo(
    () =>
      followedCompanies.filter((company) => {
        const searchLower = search.toLowerCase();
        const matchesName = company.name.toLowerCase().includes(searchLower);
        const matchesCity = company.location?.city
          ?.toLowerCase()
          .includes(searchLower);
        const matchesState = company.location?.state
          ?.toLowerCase()
          .includes(searchLower);
        const matchesAddress = company.address
          ?.toLowerCase()
          .includes(searchLower);

        return matchesName || matchesCity || matchesState || matchesAddress;
      }),
    [followedCompanies, search]
  );

  const handleFindBusinesses = () => {
    // Navigate to find businesses screen
  };

  if (filteredFollowing.length === 0) {
    return (
      <EmptyState
        icon="business"
        title="You don't follow any businesses"
        description="It's better when you have company! Find businesses to follow"
        actionLabel="Find businesses to follow"
        onAction={handleFindBusinesses}
      />
    );
  }

  return (
    <FlatList
      data={filteredFollowing}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FollowRow item={item} />}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
