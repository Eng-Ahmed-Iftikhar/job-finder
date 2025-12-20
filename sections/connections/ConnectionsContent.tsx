import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import SearchInput from "@/components/ui/SearchInput";
import { TabButton } from "./TabButton";
import { ConnectionsList } from "./ConnectionsList";
import { FollowingList } from "./FollowingList";
import { PendingConnectionsList } from "./PendingConnectionsList";
import { useAppSelector } from "@/hooks/useAppSelector";

type TabKey = "connections" | "following" | "pending";

export default function ConnectionsContent() {
  const [tab, setTab] = useState<TabKey>("connections");
  const [search, setSearch] = useState("");

  const connections = useAppSelector((state) => state.user.connections);
  const followedCompanies = useAppSelector(
    (state) => state.user.followedCompanies
  );

  const connectionsCount = connections.length;
  const followingCount = followedCompanies.length;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <View className="flex-row items-center">
            <TabButton
              label="Connections"
              count={connectionsCount}
              active={tab === "connections"}
              onPress={() => setTab("connections")}
            />
            <TabButton
              label="Following"
              count={followingCount}
              active={tab === "following"}
              onPress={() => setTab("following")}
            />
            <TabButton
              label="Pending connections"
              active={tab === "pending"}
              onPress={() => setTab("pending")}
            />
          </View>
        </ScrollView>

        <View className="mt-3 w-[65%]">
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
          />
        </View>
      </View>

      <View className="flex-1 mt-3">
        {tab === "connections" && <ConnectionsList search={search} />}
        {tab === "following" && <FollowingList search={search} />}
        {tab === "pending" && <PendingConnectionsList search={search} />}
      </View>
    </View>
  );
}
