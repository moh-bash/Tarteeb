
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import {
    createGroup,
    deleteGroup,
    getGroups,
} from "@/database/repositories/group.repository";

import type { Group } from "@/database/types";

export default function SubjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const subjectId = Number(id);

  const db = useSQLiteContext();

  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadGroups() {
    try {
      const data = await getGroups(db, subjectId);
      setGroups(data);
    } catch (error) {
      console.error("Failed to load groups:", error);
      Alert.alert("Error", "Could not load groups.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGroup() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert("Validation", "Enter a group name.");
      return;
    }

    try {
      await createGroup(db, {
        subject_id: subjectId,
        name: trimmedName,
      });

      setName("");
      await loadGroups();
    } catch (error) {
      console.error("Failed to create group:", error);

      Alert.alert(
        "Error",
        "Could not create group. It may already exist."
      );
    }
  }

  async function handleDeleteGroup(groupId: number) {
    try {
      await deleteGroup(db, groupId);
      await loadGroups();
    } catch (error) {
      console.error("Failed to delete group:", error);
      Alert.alert("Error", "Could not delete group.");
    }
  }

  useEffect(() => {
    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      Alert.alert("Error", "Invalid subject.");
      router.back();
      return;
    }

    loadGroups();
  }, [subjectId]);

  return (
    <View className="flex-1 bg-canvas px-6 pt-16">
      <Pressable onPress={() => router.back()}>
        <Text className="font-semibold text-primary">
          ← Back to subjects
        </Text>
      </Pressable>

      <Text className="mt-6 text-3xl font-extrabold text-ink">
        Subject groups
      </Text>

      <Text className="mt-2 text-sm text-muted">
        Organize your documents into groups.
      </Text>

      <View className="mt-8 flex-row gap-2">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Group name"
          placeholderTextColor="#94A3B8"
          className="flex-1 rounded-xl border border-line bg-white px-4 py-3 text-ink"
        />

        <Pressable
          onPress={handleAddGroup}
          className="items-center justify-center rounded-xl bg-primary px-5"
        >
          <Text className="font-bold text-white">
            Add
          </Text>
        </Pressable>
      </View>

      <Text className="mb-4 mt-8 text-lg font-bold text-ink">
        Groups ({groups.length})
      </Text>

      {loading ? (
        <Text className="text-muted">Loading...</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text className="text-muted">
              No groups yet. Create your first group.
            </Text>
          }
          renderItem={({ item }) => (
            <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-line bg-white p-4">
              <View className="flex-1">

                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/group/[id]",
                      params: { id: String(item.id) },
                    })
                  }
                  className="mb-3 flex-row items-center justify-between rounded-2xl border border-line bg-white p-4"
                >
                  <Text className="font-semibold text-ink">
                    {item.name}
                  </Text>

                  <Text className="text-muted">›</Text>
                </Pressable>

              </View>

              <Pressable
                onPress={() => handleDeleteGroup(item.id)}
                className="rounded-lg bg-red-50 px-3 py-2"
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
