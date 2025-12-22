import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PeopleItem = {
  id: string;
  name: string;
  location: string;
  mutualConnections: number;
  color: string;
};

function SearchSuggestionUserCard({ item }: { item: PeopleItem }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(dashboard)/(tabs)/profile-detail",
          params: { id: item.id },
        })
      }
      className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-white"
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: item.color }}
        >
          <Ionicons name="person" size={20} color="white" />
        </View>
        <View>
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm font-medium text-gray-600" numberOfLines={1}>
            {item.location}
          </Text>
          <Text className="text-sm font-medium  text-azure-radiance-500 mt-1">
            {item.mutualConnections} mutual connections
          </Text>
        </View>
      </View>
      <Pressable className="px-4 py-2 rounded-lg bg-azure-radiance-50 border border-azure-radiance-200">
        <Text className="text-sm font-medium  text-azure-radiance-500">
          Connect
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default SearchSuggestionUserCard;
