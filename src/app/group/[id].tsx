
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

import { File } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import {
    createDocument,
    deleteDocument,
    getDocuments,
} from "@/database/repositories/document.repository";

import {
    deletePdfFile,
    savePdfFile,
} from "@/services/pdf-storage.service";

import type { Document } from "@/database/types";

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = Number(id);

  const db = useSQLiteContext();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      const data = await getDocuments(db, groupId);
      setDocuments(data);
    } catch (error) {
      console.error("Failed to load documents:", error);
      Alert.alert("Error", "Could not load documents.");
    } finally {
      setLoading(false);
    }
  }, [db, groupId]);

  useEffect(() => {
    if (!Number.isInteger(groupId) || groupId <= 0) {
      router.back();
      return;
    }

    loadDocuments();
  }, [groupId, loadDocuments]);

  async function handleImportPdf() {
    try {
      setImporting(true);

      const result = await File.pickFileAsync({
        multipleFiles: true,
        mimeTypes: ["application/pdf"],
      });

      if (result.canceled) return;

      let importedCount = 0;

      for (const sourceFile of result.result) {
        const fileUri = await savePdfFile(
          sourceFile,
          sourceFile.name
        );

        try {
          await createDocument(db, {
            group_id: groupId,
            title: sourceFile.name.replace(/\.pdf$/i, ""),
            file_uri: fileUri,
            file_size: sourceFile.size ?? 0,
            mime_type: "application/pdf",
          });

          importedCount++;
        } catch (error) {
          deletePdfFile(fileUri);
          throw error;
        }
      }

      if (importedCount > 0) {
        await loadDocuments();
        loadDocuments();
      }
    } catch (error) {
      console.error("Import failed:", error);
      await loadDocuments();

      Alert.alert(
        "Import failed",
        "Could not import PDF files. Please try again."
      );
    } finally {
      setImporting(false);
    }
  }

  async function handleOpenDocument(document: Document) {
    try {
      const file = new File(document.file_uri);

      if (!file.exists) {
        Alert.alert(
          "File missing",
          "This PDF file no longer exists."
        );
        return;
      }

      router.push({
        pathname: "/pdf/[id]",
        params: {
          id: String(document.id),
        },
      });
    } catch (error) {
      console.error("PDF open error:", error);

      Alert.alert(
        "Error",
        "Could not open this PDF."
      );
    }
  }

  function handleDeleteDocument(document: Document) {
    Alert.alert(
      "Delete PDF",
      `Are you sure you want to delete "${document.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDocument(db, document.id);

              try {
                deletePdfFile(document.file_uri);
              } catch (fileError) {
                console.error(
                  "Physical PDF deletion failed:",
                  fileError
                );
              }

              await loadDocuments();
            } catch (error) {
              console.error("Delete PDF error:", error);

              Alert.alert(
                "Error",
                "Could not delete this PDF."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View className="flex-1 bg-canvas px-6 pt-16">
      <Pressable onPress={() => router.back()}>
        <Text className="font-semibold text-primary">
          ← Back to groups
        </Text>
      </Pressable>

      <Text className="mt-6 text-3xl font-extrabold text-ink">
        Group documents
      </Text>

      <Text className="mt-2 text-sm text-muted">
        Import and organize your PDF files.
      </Text>

      <Pressable
        onPress={handleImportPdf}
        disabled={importing}
        className="mt-8 flex-row items-center justify-center rounded-2xl bg-primary p-4"
      >
        {importing ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="font-bold text-white">
            + Import PDF files
          </Text>
        )}
      </Pressable>

      <Text className="mb-4 mt-8 text-lg font-bold text-ink">
        Documents ({documents.length})
      </Text>

      {loading ? (
        <ActivityIndicator color="#2563EB" />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 32 }}
          ListEmptyComponent={
            <Text className="text-muted">
              No PDF files yet. Import your first file.
            </Text>
          }
          renderItem={({ item }) => (
            <View className="mb-3 flex-row items-center rounded-2xl border border-line bg-white p-4">
              <Pressable
                onPress={() => handleOpenDocument(item)}
                className="flex-1"
              >
                <Text
                  numberOfLines={1}
                  className="font-semibold text-ink"
                >
                  {item.title}
                </Text>

                <Text className="mt-1 text-xs text-muted">
                  {formatFileSize(item.file_size)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleDeleteDocument(item)}
                className="ml-3 rounded-lg bg-red-50 px-3 py-2"
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

