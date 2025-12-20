import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { PendingTabButton } from "./TabButton";
import { PendingRow, PendingItem } from "./PendingRow";
import { EmptyState } from "./EmptyState";
// TODO: Add pending connections data structure to user slice (inboundPendingConnections, outboundPendingConnections)

type PendingTabKey = "inbound" | "outbound";

export function PendingConnectionsList({ search }: { search: string }) {
  const [pendingTab, setPendingTab] = useState<PendingTabKey>("inbound");

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
  const hasInbound = filteredPendingInbound.length > 0;
  const hasOutbound = filteredPendingOutbound.length > 0;

  const currentData = showInbound
    ? filteredPendingInbound
    : filteredPendingOutbound;
  const hasData = showInbound ? hasInbound : hasOutbound;

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

      {hasData ? (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PendingRow item={item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="person"
          title="You don't have any connections"
          description="It's better when you have company! Find people to follow"
          actionLabel="Find people to connect with"
          onAction={handleFindPeople}
        />
      )}
    </View>
  );
}
