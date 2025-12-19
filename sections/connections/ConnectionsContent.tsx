import React, { JSX, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchInput from "@/components/ui/SearchInput";

const ACCENT = "#1eadff";

type ConnectionItem = {
  id: string;
  name: string;
  location: string;
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type PendingItem = ConnectionItem;

type TabKey = "connections" | "following" | "pending";

type PendingTabKey = "inbound" | "outbound";

const connectionsData: ConnectionItem[] = [
  {
    id: "1",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#3b82f6",
    icon: "person",
  },
  {
    id: "2",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#f59e0b",
    icon: "person",
  },
  {
    id: "3",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#a855f7",
    icon: "person",
  },
  {
    id: "4",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#ec4899",
    icon: "person",
  },
];

const followingData: ConnectionItem[] = [
  {
    id: "f1",
    name: "Trader Joe's",
    location: "Austin, TX",
    color: "#38bdf8",
    icon: "business",
  },
  {
    id: "f2",
    name: "Trader Joe's",
    location: "Austin, TX",
    color: "#38bdf8",
    icon: "business",
  },
  {
    id: "f3",
    name: "Trader Joe's",
    location: "Austin, TX",
    color: "#38bdf8",
    icon: "business",
  },
  {
    id: "f4",
    name: "Trader Joe's",
    location: "Austin, TX",
    color: "#38bdf8",
    icon: "business",
  },
];

const pendingInboundData: PendingItem[] = [
  {
    id: "p1",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#3b82f6",
    icon: "person",
  },
  {
    id: "p2",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#3b82f6",
    icon: "person",
  },
  {
    id: "p3",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#3b82f6",
    icon: "person",
  },
];

const pendingOutboundData: PendingItem[] = [
  {
    id: "po1",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#3b82f6",
    icon: "person",
  },
  {
    id: "po2",
    name: "Jimmy White",
    location: "Austin, TX",
    color: "#f59e0b",
    icon: "person",
  },
];

function TabButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="mr-6 pb-2">
      <View className="flex-row items-center gap-2">
        <Text
          className={
            "text-base font-semibold " +
            (active ? "text-gray-900" : "text-gray-500")
          }
        >
          {label}
        </Text>
        {typeof count === "number" && count > 0 && (
          <View className="px-2 py-0.5 bg-azure-radiance-50 rounded-full border border-azure-radiance-100">
            <Text className="text-sm font-medium font-semibold text-azure-radiance-600">
              {count}
            </Text>
          </View>
        )}
      </View>
      <View
        className={
          "h-0.5 mt-1 rounded-full " +
          (active ? "bg-azure-radiance-500" : "bg-transparent")
        }
      />
    </Pressable>
  );
}

function PendingTabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="mr-5 pb-2">
      <Text
        className={
          "text-sm font-medium font-semibold " +
          (active ? "text-gray-900" : "text-gray-500")
        }
      >
        {label}
      </Text>
      <View
        className={
          "h-0.5 mt-1 rounded-full " +
          (active ? "bg-azure-radiance-500" : "bg-transparent")
        }
      />
    </Pressable>
  );
}

function ConnectionAvatar({
  color,
  icon = "person",
}: {
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View
      className="w-11 h-11 rounded-full items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <Ionicons name={icon} size={22} color="white" />
    </View>
  );
}

function ConnectionRow({ item }: { item: ConnectionItem }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center gap-3 flex-1">
        <ConnectionAvatar color={item.color} icon={item.icon} />
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm font-medium text-gray-500" numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable className="flex-row items-center px-3 py-2 rounded-lg border border-azure-radiance-500 bg-azure-radiance-50">
          <Ionicons
            name="chatbubble-ellipses"
            size={16}
            color={ACCENT}
            style={{ marginRight: 6 }}
          />
          <Text className="text-sm font-medium font-semibold text-azure-radiance-600">
            Message
          </Text>
        </Pressable>

        <Pressable className="p-2">
          <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
}

function PendingRow({ item }: { item: PendingItem }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center gap-3 flex-1">
        <ConnectionAvatar color={item.color} icon={item.icon} />
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm font-medium text-gray-500" numberOfLines={1}>
            {item.location}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable className="w-9 h-9 rounded-full bg-emerald-100 items-center justify-center">
          <Ionicons name="checkmark" size={18} color="#16a34a" />
        </Pressable>
        <Pressable className="w-9 h-9 rounded-full bg-red-100 items-center justify-center">
          <Ionicons name="close" size={18} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-3">
        <Ionicons name={icon} size={26} color="#9ca3af" />
      </View>
      <Text className="text-base font-semibold text-gray-900 mb-1 text-center">
        {title}
      </Text>
      <Text className="text-sm font-medium text-gray-500 text-center mb-4">
        {description}
      </Text>
      <Pressable
        className="flex-row items-center px-4 py-3 rounded-lg bg-azure-radiance-500"
        onPress={() => {}}
      >
        <Ionicons
          name="search"
          size={18}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-sm font-medium font-semibold text-white">
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

function renderList<ItemType>({
  data,
  renderItem,
}: {
  data: ItemType[];
  renderItem: ({ item }: { item: ItemType }) => JSX.Element;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item: any) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default function ConnectionsContent() {
  const [tab, setTab] = useState<TabKey>("connections");
  const [pendingTab, setPendingTab] = useState<PendingTabKey>("inbound");
  const [search, setSearch] = useState("");

  const filteredConnections = useMemo(
    () =>
      connectionsData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const filteredFollowing = useMemo(
    () =>
      followingData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const filteredPendingInbound = useMemo(
    () =>
      pendingInboundData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const filteredPendingOutbound = useMemo(
    () =>
      pendingOutboundData.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const showConnections = tab === "connections";
  const showFollowing = tab === "following";
  const showPending = tab === "pending";

  const hasConnections = filteredConnections.length > 0;
  const hasFollowing = filteredFollowing.length > 0;
  const hasPendingInbound = filteredPendingInbound.length > 0;
  const hasPendingOutbound = filteredPendingOutbound.length > 0;

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
              count={connectionsData.length}
              active={showConnections}
              onPress={() => setTab("connections")}
            />
            <TabButton
              label="Following"
              count={followingData.length}
              active={showFollowing}
              onPress={() => setTab("following")}
            />
            <TabButton
              label="Pending connections"
              active={showPending}
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
        {showConnections &&
          (hasConnections ? (
            renderList({
              data: filteredConnections,
              renderItem: ({ item }) => <ConnectionRow item={item} />,
            })
          ) : (
            <EmptyState
              icon="person"
              title="You don't have any connections"
              description="It's better when you have company! Find people to follow"
              actionLabel="Find people to connect with"
            />
          ))}

        {showFollowing &&
          (hasFollowing ? (
            renderList({
              data: filteredFollowing,
              renderItem: ({ item }) => <ConnectionRow item={item} />,
            })
          ) : (
            <EmptyState
              icon="business"
              title="You don't follow any businesses"
              description="It's better when you have company! Find people to follow"
              actionLabel="Find businesses to follow"
            />
          ))}

        {showPending && (
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

            {pendingTab === "inbound" &&
              (hasPendingInbound ? (
                renderList({
                  data: filteredPendingInbound,
                  renderItem: ({ item }) => <PendingRow item={item} />,
                })
              ) : (
                <EmptyState
                  icon="person"
                  title="You don't have any connections"
                  description="It's better when you have company! Find people to follow"
                  actionLabel="Find people to connect with"
                />
              ))}

            {pendingTab === "outbound" &&
              (hasPendingOutbound ? (
                renderList({
                  data: filteredPendingOutbound,
                  renderItem: ({ item }) => <PendingRow item={item} />,
                })
              ) : (
                <EmptyState
                  icon="person"
                  title="You don't have any connections"
                  description="It's better when you have company! Find people to follow"
                  actionLabel="Find people to connect with"
                />
              ))}
          </View>
        )}
      </View>
    </View>
  );
}
