import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

type ButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "outline";
} & React.ComponentProps<typeof TouchableOpacity>;

function Button({
  children = "button",
  className,
  disabled = false,
  loading = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      disabled={disabled}
      className={
        "flex items-center justify-center rounded-lg h-12 w-full" +
        (disabled
          ? " bg-gray-300"
          : isPrimary
            ? " bg-azure-radiance-500"
            : " bg-white border-2 border-azure-radiance-500") +
        (className ? ` ${className}` : "")
      }
      {...props}
    >
      {loading && (
        <View className="animate-spin">
          <Icon
            name="loading1"
            size={16}
            color={isOutline ? "#1eadff" : "white"}
          />
        </View>
      )}

      {!loading && (
        <Text
          className={
            "font-semibold text-lg" +
            (isOutline ? " text-azure-radiance-500" : " text-white")
          }
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default Button;
