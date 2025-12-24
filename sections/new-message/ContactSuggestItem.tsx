import Avatar from "@/components/ui/Avatar";
import { ContactItem } from "@/types/api/message";
import { Pressable, Text } from "react-native";

function ContactSuggestItem({
  item,
  onPress,
}: {
  item: ContactItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-100"
    >
      <Avatar name={`${item.user.firstName} ${item.user.lastName}`} />
      <Text className="text-base font-semibold text-gray-900">{`${item.user.firstName} ${item.user.lastName}`}</Text>
    </Pressable>
  );
}

export default ContactSuggestItem;
