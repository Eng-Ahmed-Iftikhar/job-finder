import Avatar from "@/components/ui/Avatar";
import { ConversationListItem } from "@/types/api/message";
import { Pressable, Text, View } from "react-native";

function ConversationRow({
  item,
  onPress,
}: {
  item: ConversationListItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-100"
    >
      <Avatar name={item.name} />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {item.name}
        </Text>
        <Text
          className="text-sm font-medium text-gray-500 mt-1"
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      <Text className="text-sm font-medium text-gray-400">
        {item.timestamp}
      </Text>
    </Pressable>
  );
}

export default ConversationRow;
