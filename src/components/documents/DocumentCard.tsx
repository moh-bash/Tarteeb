
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";

type DocumentCardProps = {
  title: string;
  sizeLabel: string;
  modifiedLabel: string;
  onPress: () => void;
  onMorePress?: () => void;
  isFavorite?: boolean;
};

export default function DocumentCard({
  title,
  sizeLabel,
  modifiedLabel,
  onPress,
  onMorePress,
  isFavorite = false,
}: DocumentCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl border border-line bg-surface p-4"
    >
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-red-50">
        <Ionicons
          name="document-text"
          size={25}
          color={COLORS.pdf}
        />
      </View>

      <View className="ml-3 flex-1">
        <Text
          numberOfLines={1}
          className="text-sm font-bold text-ink"
        >
          {title}
        </Text>

        <Text className="mt-1 text-xs text-muted">
          PDF · {sizeLabel}
        </Text>

        <Text className="mt-1 text-xs text-muted">
          {modifiedLabel}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        {isFavorite && (
          <Ionicons
            name="heart"
            size={19}
            color={COLORS.danger}
          />
        )}

        {onMorePress && (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onMorePress();
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="More document options"
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={COLORS.muted}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
