import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { ConnectionRow, ConnectionItem } from "./ConnectionRow";
import { EmptyState } from "./EmptyState";
import { useAppSelector } from "@/hooks/useAppSelector";

const AVATAR_COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#10b981",
  "#ef4444",
];

export function ConnectionsList({ search }: { search: string }) {
  const connections = useAppSelector((state) => state.user.connections);

  const connectionsData: ConnectionItem[] = connections.map((conn, index) => ({
    id: conn.id,
    name: `${conn.user.firstName} ${conn.user.lastName}`,
    location: "",
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    icon: "person" as const,
  }));

  const filteredConnections = useMemo(
    () =>
      connectionsData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
      ),
    [connectionsData, search]
  );

  const handleFindPeople = () => {
    // Navigate to find people screen
  };

  if (filteredConnections.length === 0) {
    return (
      <EmptyState
        icon="person"
        title="You don't have any connections"
        description="It's better when you have company! Find people to follow"
        actionLabel="Find people to connect with"
        onAction={handleFindPeople}
      />
    );
  }

  return (
    <FlatList
      data={filteredConnections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ConnectionRow item={item} />}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
