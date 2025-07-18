import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonProps = {
  children?: React.ReactNode;
} & React.ComponentProps<typeof TouchableOpacity>;

function Button({ children = "button", className, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={
        "bg-azure-radiance-500 flex items-center justify-center rounded-lg h-10 w-full" +
        (className ? ` ${className}` : "")
      }
      {...props}
    >
      <Text className="text-white font-semibold text-base">{children}</Text>
    </TouchableOpacity>
  );
}

export default Button;
