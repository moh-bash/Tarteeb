
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from "react-native";
import Pdf from "react-native-pdf";

import { getDocumentById } from "@/database/repositories/document.repository";
import type { Document } from "@/database/types";

export default function PdfViewerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadDocument() {
      try {
        setLoading(true);
        setError(null);

        const result = await getDocumentById(db, Number(id));

        if (!result) {
          setError("المستند غير موجود");
          return;
        }

        setDocument(result);
      } catch (err) {
        console.error("Load PDF document error:", err);
        setError("تعذر تحميل بيانات المستند");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadDocument();
    }
  }, [id, db]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-500">
          جارٍ تحميل المستند...
        </Text>
      </View>
    );
  }

  if (error || !document) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-4 text-center text-gray-700">
          {error ?? "حدث خطأ غير متوقع"}
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="rounded-xl bg-blue-600 px-5 py-3"
        >
          <Text className="font-semibold text-white">
            العودة
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <Pressable onPress={() => router.back()}>
          <Text className="text-base font-semibold text-blue-600">
            رجوع
          </Text>
        </Pressable>

        <Text
          numberOfLines={1}
          className="mx-3 flex-1 text-center font-semibold text-gray-900"
        >
          {document.title}
        </Text>

        <Text className="text-sm text-gray-500">
          {totalPages > 0
            ? `${currentPage}/${totalPages}`
            : "..."}
        </Text>
      </View>

      {/* PDF Viewer */}
      <View className="flex-1 bg-gray-100">
        <Pdf
          source={{
            uri: document.file_uri,
            cache: false,
          }}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
          }}
          horizontal={false}
          enablePaging={false}
          enableDoubleTapZoom={true}
          minScale={1}
          maxScale={3}
          spacing={8}
          onLoadComplete={(numberOfPages) => {
            setTotalPages(numberOfPages);
            setCurrentPage(1);
            console.log("PDF loaded:", numberOfPages);
          }}
          onPageChanged={(page, numberOfPages) => {
            setCurrentPage(page);
            setTotalPages(numberOfPages);
          }}
          onError={(err) => {
            console.error("PDF viewer error:", err);
            setError("تعذر عرض ملف PDF");
          }}
          renderActivityIndicator={() => (
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />
          )}
        />
      </View>
    </View>
  );
}
