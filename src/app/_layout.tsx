
import { ActivityIndicator, View } from "react-native";

import { LocaleProvider, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import "../../global.css";

import {
    SettingsProvider,
    useSettings,
} from "@/contexts/settings.context";
import { initializeDatabase } from "@/database/migrations/initialize";
import { SafeAreaView } from "react-native-safe-area-context";

function AppNavigator() {
  const { theme, language, isReady } = useSettings();

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color="#2563EB" />
      </View>
    );
  }

  return (
    <LocaleProvider
      direction={language === "ar" ? "rtl" : "ltr"}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </LocaleProvider>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="pdf-library.db"
      onInit={initializeDatabase}
    >
            <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-surface" edges={['top', 'left', 'right']}>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
      </SafeAreaView>
    </SQLiteProvider>
  );
}
