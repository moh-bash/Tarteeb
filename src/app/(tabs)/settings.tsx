
import {
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import { useSettings } from "@/contexts/settings.context";

export default function SettingsScreen() {
  const {
    theme,
    language,
    setTheme,
    setLanguage,
    t,
  } = useSettings();

  const isArabic = language === "ar";

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 64,
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <Pressable onPress={() => router.back()}>
        <Text className="font-semibold text-primary">
          {isArabic ? "→ " : "← "}
          {t("back")}
        </Text>
      </Pressable>

      <Text
        className="mt-6 text-3xl font-extrabold text-ink"
        style={{
          textAlign: isArabic ? "right" : "left",
        }}
      >
        {t("settings")}
      </Text>

      <Text
        className="mt-2 text-sm text-muted"
        style={{
          textAlign: isArabic ? "right" : "left",
        }}
      >
        {t("settingsDescription")}
      </Text>

      {/* Appearance */}
      <Text
        className="mb-3 mt-10 text-lg font-bold text-ink"
        style={{
          textAlign: isArabic ? "right" : "left",
        }}
      >
        {t("appearance")}
      </Text>

      <View className="rounded-2xl border border-line bg-surface p-4">
        <Text
          className="mb-4 font-semibold text-ink"
          style={{
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {t("theme")}
        </Text>

        <View className="flex-row gap-3">
          <Pressable
            onPress={() => setTheme("light")}
            className={`flex-1 items-center rounded-xl border p-4 ${
              theme === "light"
                ? "border-primary bg-primary-light"
                : "border-line"
            }`}
          >
            <Text className="mb-2 text-2xl">☀️</Text>

            <Text
              className={`font-semibold ${
                theme === "light"
                  ? "text-primary"
                  : "text-ink"
              }`}
            >
              {t("light")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setTheme("dark")}
            className={`flex-1 items-center rounded-xl border p-4 ${
              theme === "dark"
                ? "border-primary bg-primary-light"
                : "border-line"
            }`}
          >
            <Text className="mb-2 text-2xl">🌙</Text>

            <Text
              className={`font-semibold ${
                theme === "dark"
                  ? "text-primary"
                  : "text-ink"
              }`}
            >
              {t("dark")}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Language */}
      <Text
        className="mb-3 mt-8 text-lg font-bold text-ink"
        style={{
          textAlign: isArabic ? "right" : "left",
        }}
      >
        {t("language")}
      </Text>

      <View className="rounded-2xl border border-line bg-surface p-4">
        <Pressable
          onPress={() => setLanguage("ar")}
          className="flex-row items-center justify-between py-3"
        >
          <Text className="font-medium text-ink">
            🇸🇦 {t("arabic")}
          </Text>

          <Text className="font-bold text-primary">
            {language === "ar" ? "✓" : ""}
          </Text>
        </Pressable>

        <View className="h-px bg-line" />

        <Pressable
          onPress={() => setLanguage("en")}
          className="flex-row items-center justify-between py-3"
        >
          <Text className="font-medium text-ink">
            🇬🇧 {t("english")}
          </Text>

          <Text className="font-bold text-primary">
            {language === "en" ? "✓" : ""}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
