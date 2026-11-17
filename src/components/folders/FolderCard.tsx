
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";

type FolderCardProps = {
  name: string;
  documentCount: number;
  onPress: () => void;
};

export default function FolderCard({
  name,
  documentCount,
  onPress,
}: FolderCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl border border-line bg-surface p-4"
    >
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
        <Ionicons
          name="folder"
          size={26}
          color={COLORS.folder}
        />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold text-ink">
          {name}
        </Text>

        <Text className="mt-1 text-xs text-muted">
          {documentCount} documents
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.muted}
      />
    </Pressable>
  );
}
