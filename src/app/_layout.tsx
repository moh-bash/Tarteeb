
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import { initializeDatabase } from "@/database/migrations/initialize";
import "../../global.css";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="pdf-library.db"
      onInit={initializeDatabase}
    >
      <Stack />
    </SQLiteProvider>
  );
}
