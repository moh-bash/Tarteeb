import { useSettings } from "@/contexts/settings.context";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import {
    createSubject,
    deleteSubject,
    getSubjects,
} from "@/database/repositories/subject.repository";

import type { Subject } from "@/database/types";

export default function HomeScreen() {
  const db = useSQLiteContext();
  const { t } = useSettings();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadSubjects() {
    try {
      const data = await getSubjects(db);
      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
      Alert.alert("Error", "Could not load subjects.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSubject() {
    if (!name.trim()) {
      Alert.alert("Validation", "Enter a subject name.");
      return;
    }

    try {
      await createSubject(db, { name });
      setName("");
      await loadSubjects();
    } catch (error) {
      console.error("Failed to create subject:", error);
      Alert.alert("Error", "Could not create subject.");
    }
  }

  async function handleDeleteSubject(id: number) {
    try {
      await deleteSubject(db, id);
      await loadSubjects();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      Alert.alert("Error", "Could not delete subject.");
    }
  }

  function openSubject(subject: Subject) {
    router.push({
      pathname: "/subject/[id]",
      params: { id: String(subject.id) },
    });
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <View className="flex-1 bg-canvas px-6 pt-16">
      <Text className="mt-2 text-3xl font-extrabold text-ink">
        {t("Your_subjects")}
      </Text>

      <Text className="mt-2 text-sm text-muted">
        Organize your study materials.
      </Text>

      <View className="mt-8 flex-row gap-2">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Subject name"
          placeholderTextColor="#94A3B8"
          className="flex-1 rounded-xl border border-line bg-white px-4 py-3 text-ink"
        />

        <Pressable
          onPress={handleAddSubject}
          className="items-center justify-center rounded-xl bg-primary px-5"
        >
          <Text className="font-bold text-white">
            Add
          </Text>
        </Pressable>
      </View>

      <Text className="mb-4 mt-8 text-lg font-bold text-ink">
        Your subjects ({subjects.length})
      </Text>

      {loading ? (
        <Text className="text-muted">Loading...</Text>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 32 }}
          ListEmptyComponent={
            <Text className="text-muted">
              No subjects yet. Add your first subject.
            </Text>
          }
          renderItem={({ item }) => (
            <View className="mb-3 flex-row items-center gap-2">
              <Pressable
                onPress={() => openSubject(item)}
                className="flex-1 flex-row items-center rounded-2xl border border-line bg-white p-4"
              >
                <View
                  style={{ backgroundColor: item.color }}
                  className="mr-3 h-3 w-3 rounded-full"
                />

                <Text className="flex-1 font-semibold text-ink">
                  {item.name}
                </Text>

                <Text className="text-muted">›</Text>
              </Pressable>

              <Pressable
                onPress={() => handleDeleteSubject(item.id)}
                className="rounded-xl bg-red-50 px-3 py-4"
              >
                <Text className="text-sm font-semibold text-red-600">
                  Delete
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}
