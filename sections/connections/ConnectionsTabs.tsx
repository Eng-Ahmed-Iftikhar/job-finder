import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { TabButton } from "./TabButton";
import { CONNECTIONS_TABS, ConnectionsTab } from "@/types/connections";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectFollowedCompanies,
  selectPendingConnections,
  selectUserConnections,
} from "@/store/reducers/userSlice";
import { usePathname, useRouter } from "expo-router";

const connectionsTabs: ConnectionsTab[] = [
  {
    key: CONNECTIONS_TABS.CONNECTIONS,
    label: "Connections",
    path: "/connections",
  },
  {
    key: CONNECTIONS_TABS.FOLLOWING,
    label: "Following",
    path: "/connections/following",
  },
  {
    key: CONNECTIONS_TABS.PENDING,
    label: "Pending connections",
    path: "/connections/pending",
  },
];

function ConnectionsTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const connections = useAppSelector(selectUserConnections);
  const followedCompanies = useAppSelector(selectFollowedCompanies);
  const pendingConnections = useAppSelector(selectPendingConnections);
  const handleTabPress = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
    >
      <View className="flex-row items-center">
        {connectionsTabs.map((connectionsTab) => {
          let count = 0;
          switch (connectionsTab.key) {
            case CONNECTIONS_TABS.CONNECTIONS:
              count = connections.length;
              break;
            case CONNECTIONS_TABS.FOLLOWING:
              count = followedCompanies.length;
              break;
            case CONNECTIONS_TABS.PENDING:
              count = pendingConnections.length;
              break;
            default:
              count = 0;
          }

          const isActive = pathname === connectionsTab.path;

          return (
            <TabButton
              key={connectionsTab.key}
              label={connectionsTab.label}
              count={count}
              active={isActive}
              onPress={handleTabPress.bind(null, connectionsTab.path)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

export default ConnectionsTabs;
