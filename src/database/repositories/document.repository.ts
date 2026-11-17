import type { SQLiteDatabase } from "expo-sqlite";

import type { CreateDocumentInput, Document } from "../types";

export async function getDocuments(
  db: SQLiteDatabase,
  groupId: number,
): Promise<Document[]> {
  return db.getAllAsync<Document>(
    `SELECT * FROM documents
     WHERE group_id = ?
     ORDER BY created_at DESC`,
    groupId,
  );
}

export async function createDocument(
  db: SQLiteDatabase,
  input: CreateDocumentInput,
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO documents (
      group_id,
      title,
      file_uri,
      file_size,
      mime_type
    ) VALUES (?, ?, ?, ?, ?)`,
    input.group_id,
    input.title,
    input.file_uri,
    input.file_size,
    input.mime_type ?? "application/pdf",
  );

  return result.lastInsertRowId;
}

export async function deleteDocument(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync("DELETE FROM documents WHERE id = ?", id);
}
