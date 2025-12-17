import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

type ButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "outline";
  icon?: string;
  iconSize?: number;
  iconPosition?: "left" | "right";
} & React.ComponentProps<typeof TouchableOpacity>;

function Button({
  children = "button",
  className,
  disabled = false,
  loading = false,
  variant = "primary",
  icon,
  iconSize = 18,
  iconPosition = "left",
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
        <View className="flex-row items-center justify-center gap-2">
          {icon && iconPosition === "left" && (
            <Icon
              name={icon}
              size={iconSize}
              color={isOutline ? "#1eadff" : "white"}
            />
          )}
          <Text
            className={
              "font-semibold text-lg" +
              (isOutline ? " text-azure-radiance-500" : " text-white")
            }
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <Icon
              name={icon}
              size={iconSize}
              color={isOutline ? "#1eadff" : "white"}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Button;
