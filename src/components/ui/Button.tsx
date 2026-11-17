
import {
    ActivityIndicator,
    Pressable,
    Text,
} from "react-native";

import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-primary-light",
  outline: "border border-line bg-white",
  ghost: "bg-transparent",
};

const textVariants: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-primary",
  outline: "text-ink",
  ghost: "text-primary",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2",
  md: "px-5 py-3",
  lg: "px-6 py-4",
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      className={`
        flex-row items-center justify-center gap-2
        rounded-xl
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50" : ""}
      `}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : "#2563EB"}
        />
      ) : (
        <>
          {icon}

          <Text
            className={`text-sm font-bold ${textVariants[variant]}`}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
