import Avatar from "@/components/ui/Avatar";
import { SearchUser } from "@/types/search";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface SearchUserCardProps {
  user: SearchUser;
}

export default function SearchUserCard({ user }: SearchUserCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(dashboard)/(tabs)/profile-detail",
      params: { id: user.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-lg px-2  items-center w-32"
    >
      <Avatar
        imageUrl={user.pictureUrl}
        size={64}
        name={`${user.firstName} ${user.lastName}`}
      />
      <Text
        className="text-sm font-semibold text-gray-900 mt-3 text-center"
        numberOfLines={2}
      >
        {user.firstName} {user.lastName}
      </Text>
    </Pressable>
  );
}
