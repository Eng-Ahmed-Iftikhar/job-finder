import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

type ButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
} & React.ComponentProps<typeof TouchableOpacity>;

function Button({
  children = "button",
  className,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      className={
        " bg-azure-radiance-500 flex items-center justify-center rounded-lg h-12 w-full" +
        (disabled ? " bg-gray-300" : "bg-azure-radiance-500") +
        (className ? ` ${className}` : "")
      }
      {...props}
    >
      {loading && (
        <View className="animate-spin">
          <Icon name="loading1" size={16} color="white" />
        </View>
      )}

      {!loading && (
        <Text className="text-white font-semibold  text-lg">{children}</Text>
      )}
    </TouchableOpacity>
  );
}

export default Button;
