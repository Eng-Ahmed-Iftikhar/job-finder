import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUserConnections } from "@/store/reducers/userSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { ConnectionItem, ConnectionRow } from "./ConnectionRow";
import { EmptyState } from "./EmptyState";

const AVATAR_COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
  "#ec4899",
  "#10b981",
  "#ef4444",
];

function Connections() {
  const connections = useAppSelector(selectUserConnections);
  const searchParams = useLocalSearchParams();
  const search = searchParams.search as string;
  const router = useRouter();

  const connectionsData: ConnectionItem[] = connections.map((conn, index) => ({
    id: conn.id,
    name: `${conn.user.firstName} ${conn.user.lastName}`,
    location: [
      conn.user.location?.city,
      conn.user.location?.state,
      conn.user.location?.country,
    ]
      .filter(Boolean)
      .join(", "),
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    pictureUrl: conn.user?.pictureUrl,
    icon: "person" as const,
  }));

  const filteredConnections = useMemo(
    () =>
      connectionsData.filter(
        (item) =>
          item.name.toLowerCase().includes(search?.toLowerCase() ?? "") ||
          item.location.toLowerCase().includes(search?.toLowerCase() ?? "")
      ),
    [connectionsData, search]
  );

  const handleFindPeople = () => {
    router.push("/search");
  };

  return (
    <FlatList
      data={filteredConnections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ConnectionRow item={item} />}
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
  );
}
export default Connections;
