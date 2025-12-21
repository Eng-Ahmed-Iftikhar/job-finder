import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { PendingTabButton } from "./TabButton";
import { PendingRow, PendingItem } from "./PendingRow";
import { EmptyState } from "./EmptyState";
import { useLocalSearchParams } from "expo-router";
// TODO: Add pending connections data structure to user slice (inboundPendingConnections, outboundPendingConnections)

type PendingTabKey = "inbound" | "outbound";

export function PendingConnectionsList() {
  const [pendingTab, setPendingTab] = useState<PendingTabKey>("inbound");
  const searchParams = useLocalSearchParams();
  const search = (searchParams.search as string) || "";
  // TODO: Get from Redux state when implemented
  const pendingInboundData: PendingItem[] = [];
  const pendingOutboundData: PendingItem[] = [];

  const filteredPendingInbound = useMemo(
    () =>
      pendingInboundData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
      ),
    [pendingInboundData, search]
  );

  const filteredPendingOutbound = useMemo(
    () =>
      pendingOutboundData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
      ),
    [pendingOutboundData, search]
  );

  const handleFindPeople = () => {
    // Navigate to find people screen
  };

  const showInbound = pendingTab === "inbound";

  const currentData = showInbound
    ? filteredPendingInbound
    : filteredPendingOutbound;

  return (
    <View className="flex-1">
      <View className="flex-row items-center px-4 mb-2">
        <PendingTabButton
          label="Inbound"
          active={pendingTab === "inbound"}
          onPress={() => setPendingTab("inbound")}
        />
        <PendingTabButton
          label="Outbound"
          active={pendingTab === "outbound"}
          onPress={() => setPendingTab("outbound")}
        />
      </View>

      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PendingRow item={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="person"
            title="You don't have any connections"
            description="It's better when you have company! Find people to follow"
            actionLabel="Find people to connect with"
            onAction={handleFindPeople}
          />
        }
      />
    </View>
  );
}
