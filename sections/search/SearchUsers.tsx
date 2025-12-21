import { useSearch } from "@/hooks/useSearch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import SearchUserCard from "./SearchUserCard";

function SearchUsers() {
  const { employees } = useSearch();
  const router = useRouter();

  const navigateToResults = () => {
    router.push("/(dashboard)/(tabs)/search-suggestions");
  };

  if (!employees.length) {
    return null;
  }
  return (
    <View className="pt-4">
      <View className="flex-row px-3">
        <Text className="text-sm flex-1 font-medium text-gray-500 mb-3">
          People
        </Text>
        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={navigateToResults}
        >
          <Text className="text-sm font-medium text-blue-600 mb-3">
            See all people
          </Text>
          <Ionicons
            name="chevron-forward"
            size={15}
            color="#3B82F6"
            style={{ marginBottom: 12 }}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SearchUserCard user={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 12,
          width: "100%",
          backgroundColor: "white",
        }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="person-outline"
              size={28}
              color="#D1D5DB"
              style={{ marginBottom: 12 }}
            />
            <Text className="text-sm text-gray-500 text-center">
              No people found
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default SearchUsers;
