import { Message } from "@/types/api/message";
import { Text } from "react-native";
import { View } from "react-native";

function MessageBubble({ message }: { message: Message }) {
  return (
    <View
      className={
        "px-4 py-3 rounded-2xl max-w-xs " +
        (message.isOwn
          ? "bg-azure-radiance-500 self-end mr-4"
          : "bg-gray-100 self-start ml-4")
      }
    >
      <Text
        className={
          "text-base " + (message.isOwn ? "text-white" : "text-gray-900")
        }
      >
        {message.text}
      </Text>
      <Text
        className={
          "text-sm font-medium mt-1 " +
          (message.isOwn ? "text-blue-100" : "text-gray-500")
        }
      >
        {message.timestamp}
      </Text>
    </View>
  );
}

export default MessageBubble;
